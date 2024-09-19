import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { DomSanitizer } from "@angular/platform-browser";

import { DocenteMidService } from "src/app/services/docente-mid.service";
import { GestorDocumentalService } from "src/app/services/gestor-documental.service";
import Swal from "sweetalert2";

// Definir las interfaces
interface Pregunta {
  text: string;
  tipo: string;
  campos?: Array<{
    tipo_campo: number;
    escala: Array<{ valor: string; nombre: string }>;
  }>;
}

interface Ambito {
  nombre: string;
  titulo: string;
  preguntas: Pregunta[];
  items: Pregunta[];
}

interface Respuesta {
  item_id: number;
  valor?: string;
  archivos?: string[];
}

@Component({
  selector: "ngx-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.scss"],
})
export class DynamicFormComponent implements OnInit {
  stepperForm!: FormGroup; // Inicializa el FormGroup correctamente
  selectedForm: any;
  ambitos: Ambito[] = [];
  comentarioCounter = 1;
  actaFile: File | null = null;
  isFormView: boolean = false;
  //coevaluacionI = COEVALUACION_I;
  expandAllState: boolean[] = [];
  uploadedFileUid: string | null = null;
  documentId: string | null = null;

  @ViewChild("mainStepper") mainStepper!: MatStepper;

  @Input() formtype!: string;

  constructor(
    private fb: FormBuilder,
    private gestorService: GestorDocumentalService,
    private gestorDocumentalService: GestorDocumentalService,
    private sanitizer: DomSanitizer,
    private docentemidservice: DocenteMidService
  ) {}

  ngOnInit() {
    this.stepperForm = this.fb.group({});
    if (this.formtype) {
      this.loadFormulario(this.formtype);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["formtype"] && changes["formtype"].currentValue) {
      this.loadFormulario(changes["formtype"].currentValue);
    }
  }

  private getFormTypeId(formtype: string): number {
    switch (formtype) {
      case "autoevaluacion-ii":
        return 5;
      case "autoevaluacion-i":
        return 4;
      case "heteroevaluacion":
        return 3;
      case "coevaluacion-ii":
        return 2;
      case "coevaluacion-i":
        return 1;
      default:
        return 0; // Caso por defecto, puede ajustarse
    }
  }

  loadFormulario(tipo_formulario: string) {
    const id_tipo_formulario = this.getFormTypeId(tipo_formulario);

    if (id_tipo_formulario === 0) {
      console.warn("Tipo de formulario no válido");
      return;
    }

    this.docentemidservice
      .obtenerFormulario(id_tipo_formulario)
      .subscribe((data) => {
        if (data && data.seccion) {
          console.log("Datos recibidos del servicio:", data);

          // Procesar las secciones y generar los ámbitos (cualitativa, cuantitativa, descripcion)
          const secciones = data.seccion;
          this.ambitos = [];

          if (secciones.cualitativa) {
            this.ambitos.push(secciones.cualitativa);
          }
          if (secciones.cuantitativa) {
            this.ambitos.push(secciones.cuantitativa);
          }
          if (secciones.descripcion) {
            this.ambitos.push(secciones.descripcion);
          }

          // Validar que cada ítem tenga las propiedades correctas antes de construir el formulario
          this.ambitos.forEach((ambito) => {
            ambito.items.forEach((item) => {
              console.log(`Verificando item: ${item.text}`, item);
            });
          });

          this.buildForm(); // Construir el formulario
        } else {
          console.log(
            "No se recibieron datos del backend o los datos no tienen el formato esperado"
          );
        }
      });
  }

  buildForm() {
    this.stepperForm = this.fb.group({}); // Crear un nuevo FormGroup

    this.ambitos.forEach((ambito, index) => {
      const group = this.fb.group({}); // Crear un FormGroup por cada ámbito

      if (ambito.items) {
        ambito.items.forEach((item: any) => {
          const controlName = this.generateControlName(
            item.nombre || item.text
          ); // Generar el nombre del control, usando 'text' o 'nombre'

          // Verificar si el nombre del control es válido
          if (controlName.startsWith("control_sin_nombre")) {
            console.warn(
              "No se puede generar un control válido para la pregunta:",
              item
            );
            return; // Saltar este ítem si no tiene un nombre válido
          }

          // Crear controles según el tipo de campo
          if (
            item.campos &&
            item.campos.length > 0 &&
            item.campos[0].tipo_campo === 1
          ) {
            // Escalas (tipo_campo === 1)
            group.addControl(
              `pregunta_${controlName}`,
              this.fb.control("", Validators.required)
            );
          } else {
            // Para otros tipos de campos (si aplica)
            group.addControl(`pregunta_${controlName}`, this.fb.control(""));
          }
        });
      }

      this.stepperForm.addControl(`ambito_${index}`, group); // Añadir el grupo de ámbito al formulario principal
    });
  }

  // Método para inicializar el formulario seleccionado
  selectForm(tipo_formulario: string) {
    // Limpiar el formulario antes de cargar uno nuevo
    this.stepperForm = this.fb.group({});
    this.ambitos = []; // Reinicia los ámbitos para evitar mostrar datos anteriores

    // Cargar el formulario desde el backend utilizando el servicio
    this.loadFormulario(tipo_formulario);
  }

  // Método para inicializar el formulario específico de Coevaluación II
  initializeCoevaluacionIIForm() {
    this.ambitos.forEach((ambito: Ambito, index: number) => {
      const group = this.fb.group({});

      ambito.items.forEach((item: Pregunta) => {
        // Usar 'items'
        if (!item.text || item.tipo === "download") {
          console.warn(
            `Item sin texto o de tipo ${item.tipo} no necesita control.`
          );
          return;
        }

        const controlName = this.generateControlName(item.text);
        group.addControl(`pregunta_${controlName}`, this.fb.control(""));
      });

      this.stepperForm.addControl(`ambito_${index}`, group);
    });
  }

  // Método para insertar inputs numerados después de las preguntas en Heteroevaluación
  insertNumericalInputs(ambitoIndex: number): void {
    const inputStart = ambitoIndex === 0 ? 1 : ambitoIndex === 1 ? 6 : 11;
    const inputEnd = inputStart + 4;
    const inputsArray = [];

    for (let i = inputStart; i <= inputEnd; i++) {
      inputsArray.push(this.fb.control(""));
    }

    const ambitoControl = this.stepperForm.get(
      `ambito_${ambitoIndex}`
    ) as FormGroup;
    if (ambitoControl) {
      inputsArray.forEach((control, index) => {
        ambitoControl.addControl(`input_${inputStart + index}`, control);
      });
    }
  }

  // Inicializa el formulario dinámico creando los controles para cada pregunta
  initializeForm() {
    this.ambitos.forEach((ambito: Ambito, index: number) => {
      const group = this.fb.group({}); // Crear un grupo de control para el ámbito

      ambito.items.forEach((item: Pregunta) => {
        if (!item.text || item.tipo === "download") {
          console.log(
            `Item sin texto o de tipo download encontrado en ámbito: ${ambito.nombre}`
          );
          return; // No se crean controles para ítems de tipo descarga o sin texto
        }

        const controlName = this.generateControlName(item.text);

        // Crear controles según el tipo de pregunta
        switch (item.tipo) {
          case "radio":
            group.addControl(
              `pregunta_${controlName}`,
              this.fb.control("", Validators.required)
            );
            break;
          case "input":
          case "textarea":
            group.addControl(
              `pregunta_${controlName}`,
              this.fb.control("", Validators.required)
            );
            break;
          case "checkbox":
            group.addControl(`pregunta_${controlName}`, this.fb.control(false));
            break;
          case "file":
            group.addControl(`pregunta_${controlName}`, this.fb.control(null)); // Para archivos, si es necesario
            break;
          default:
            group.addControl(`pregunta_${controlName}`, this.fb.control("")); // Control por defecto
            break;
        }
      });

      this.stepperForm.addControl(`ambito_${index}`, group); // Añadir el grupo de ámbito al formulario principal
    });
  }

  handleFileInputChange(event: any): void {
    this.actaFile = event.target.files[0] ?? null;
  }

  // Agregamos la función calculateComentarioIndex
  calculateComentarioIndex(
    ambitoIndex: number,
    comentarioIndex: number
  ): number {
    // Asegúrate de que los índices se calculen de manera que no se repitan
    return ambitoIndex * 10 + comentarioIndex; // Ajuste este valor si es necesario
  }

  uploadActa(): void {
    if (!this.actaFile) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor selecciona un archivo para cargar.",
      });
      return;
    }

    const sendActa = {
      IdDocumento: 74, // Este ID puede cambiar según sea necesario en tu contexto
      nombre: this.actaFile.name.split(".")[0],
      metadatos: {
        proyecto: "123", // Debes ajustar estos valores según tu lógica de negocio
        plan_estudio: "12",
        espacio_academico: "Espacio académico",
      },
      descripcion: "Acta de coevaluación",
      file: this.actaFile,
    };

    this.gestorService.uploadFiles([sendActa]).subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Archivo cargado correctamente.",
        });
      },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al cargar el archivo.",
        });
      },
    });
  }

  // Método para obtener un control
  getFormControl(ambitoIndex: number, controlName: string): AbstractControl {
    const ambitoControl = this.stepperForm.get("ambito_" + ambitoIndex);

    if (ambitoControl) {
      // Evitar obtener controles para preguntas de tipo 'download'
      if (controlName.includes("descarga_archivo_aqu")) {
        console.log(`Control no necesario para descarga: ${controlName}`);
        return new FormControl(); // Retornamos un control vacío para evitar el error
      }

      const control = ambitoControl.get(controlName);
      if (control) {
        return control;
      } else {
        console.warn(`Control not found for ${controlName}`);
        return new FormControl(); // Evitar errores retornando un control vacío
      }
    }

    return new FormControl(); // Retornamos un control vacío si no se encuentra el ámbito
  }

  // Método para manejar la selección de una opción
  onSelectOption(
    preguntaIndex: number,
    ambitoIndex: number,
    innerStepper: MatStepper
  ) {
    const control = this.getFormControl(
      ambitoIndex,
      `pregunta_${this.ambitos[ambitoIndex].items[preguntaIndex].text}` // Cambia preguntas por items
    );

    // Si la respuesta es válida (se ha seleccionado una opción)
    if (control.valid) {
      // Avanzar automáticamente a la siguiente pregunta si existe
      if (preguntaIndex < this.ambitos[ambitoIndex].preguntas.length - 1) {
        innerStepper.next(); // Avanzar a la siguiente pregunta
      } else {
        // Si es la última pregunta, se queda en el mismo ámbito hasta que el usuario decida avanzar
        console.log(
          "Última pregunta del ámbito, el usuario debe avanzar manualmente al siguiente ámbito"
        );
      }
    }
  }

  // Método para manejar el evento de submit
  submit() {
    if (this.stepperForm.valid) {
      const respuestas = this.generateResponseData();
      const jsonData = {
        id_periodo: 1,
        id_tercero: 1,
        id_evaluado: 1,
        proyecto_curricular: 123,
        espacio_academico: 12,
        plantilla_id: 456,
        respuestas,
      };
      console.log("Formulario guardado:", jsonData);
    } else {
      Swal.fire({
        icon: "error",
        title: "Formulario incompleto",
        text: "Por favor, complete todas las preguntas.",
      });
    }
  }

  generateResponseData(): Respuesta[] {
    const respuestas: Respuesta[] = [];
    this.ambitos.forEach((ambito, i) => {
      ambito.items.forEach((pregunta, j) => {
        const controlName = this.generateControlName(pregunta.text);
        const control = this.stepperForm.get(
          `ambito_${i}.pregunta_${controlName}`
        );

        const respuesta: Respuesta = {
          item_id: j + 1,
          valor: control?.value || "",
        };

        respuestas.push(respuesta);
      });
    });
    return respuestas;
  }

  // Función para transformar un texto en una clave válida (remueve espacios y caracteres especiales)
  /**
   * Generar un nombre de control basado en el texto (remueve espacios y caracteres especiales).
   */
  generateControlName(text: string | null): string {
    if (!text || text.trim() === "") {
      console.warn(
        "El texto proporcionado para generar el control está vacío o no es válido"
      );
      return "control_sin_nombre_" + Math.random().toString(36).substring(2, 7); // Generar un nombre aleatorio
    }
    return text.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  }

  // Método para renderizar las preguntas dependiendo de su tipo
  renderQuestion(question: Pregunta, form: FormGroup, controlName: string) {
    switch (question.tipo) {
      case "radio":
        return this.renderRadioQuestion(question, form, controlName);
      case "input":
        return this.renderInputQuestion(question, form, controlName);
      case "checkbox":
        return this.renderCheckboxQuestion(question, form, controlName);
      default:
        return null;
    }
  }

  // Métodos para manejar las preguntas de tipo radio, input y checkbox
  renderRadioQuestion(question: any, form: FormGroup, controlName: string) {
    return `
      <mat-radio-group [formControlName]="${controlName}">
        ${question.options
          .map(
            (option: any) =>
              `<mat-radio-button [value]="${option.valor}">${option.texto}</mat-radio-button>`
          )
          .join("")}
      </mat-radio-group>
    `;
  }

  renderInputQuestion(question: any, form: FormGroup, controlName: string) {
    return `
      <mat-form-field appearance="fill">
        <mat-label>${question.text}</mat-label>
        <input matInput [formControlName]="${controlName}">
      </mat-form-field>
    `;
  }

  renderCheckboxQuestion(question: any, form: FormGroup, controlName: string) {
    return `
      <mat-checkbox [formControlName]="${controlName}">
        ${question.text}
      </mat-checkbox>
    `;
  }

  // Método para subir el archivo
  cargarEvidencias(): void {
    if (!this.actaFile) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor selecciona un archivo para cargar.",
      });
      return;
    }

    const sendActa = {
      IdDocumento: 74, // Este ID puede cambiar según el contexto
      nombre: this.actaFile.name.split(".")[0],
      metadatos: {
        proyecto: "123", // Ajusta estos valores según los metadatos del sistema
        plan_estudio: "12",
        espacio_academico: "Espacio académico",
      },
      descripcion: "Acta de coevaluación",
      file: this.actaFile,
    };

    this.gestorService.uploadFiles([sendActa]).subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Archivo cargado correctamente.",
        });
      },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al cargar el archivo.",
        });
      },
    });
  }

  getDropdownOptions(campo: string): string[] {
    if (campo === "Espacio Curricular") {
      return ["Curricular A", "Curricular B"];
    } else if (campo === "Código del Espacio Curricular") {
      return ["Cód. 101", "Cód. 202"];
    } else if (campo === "Grupo") {
      return ["Grupo 1", "Grupo 2"];
    }
    return [];
  }

  onNext(innerStepper: MatStepper, ambitoIndex: number, preguntaIndex: number) {
    const control = this.getFormControl(
      ambitoIndex,
      "pregunta_" +
        this.generateControlName(
          this.ambitos[ambitoIndex].preguntas[preguntaIndex].text
        )
    );

    if (control.valid) {
      // Si es la última pregunta del ámbito actual, avanza al siguiente ámbito
      if (preguntaIndex < this.ambitos[ambitoIndex].preguntas.length - 1) {
        innerStepper.next(); // Avanzar a la siguiente pregunta
      } else {
        this.mainStepper.next(); // Si es la última pregunta, avanzar al siguiente ámbito
      }
    }
  }

  getNumericalInputLabel(ambitoIndex: number, inputIndex: number): number {
    const inputStart = ambitoIndex === 0 ? 1 : ambitoIndex === 1 ? 6 : 11;
    return inputStart + inputIndex;
  }

  // Función para manejar la descarga de archivos
  onDownload(fileName: string) {
    // lógica para descargar el archivo
    console.log(`Descargando archivo: ${fileName}`);
    // se puede hacer una petición HTTP para obtener el archivo y descargarlo
  }

  // Método para alternar la expansión de todas las preguntas de un ámbito
  toggleAll(index: number) {
    this.expandAllState[index] = !this.expandAllState[index];
  }

  // Método para manejar la descarga
  downloadDocument() {
    if (this.documentId) {
      this.gestorDocumentalService.getByUUID(this.documentId).subscribe(
        (fileUrl: string) => {
          const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
          this.triggerDownload(sanitizedUrl as string);
        },
        (error: any) => {
          console.error("Error downloading the document:", error);
        }
      );
    } else {
      console.error("Document ID not found");
    }
  }

  triggerDownload(url: string) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = "documento.pdf";
    link.click();
  }
}
