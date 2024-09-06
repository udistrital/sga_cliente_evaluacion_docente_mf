import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import {
  HETEROEVALUACION,
  AUTOEVALUACION_I,
  AUTOEVALUACION_II,
  COEVALUACION_I,
  COEVALUACION_II,
} from "src/app/models/formularios-data";
import { GestorDocumentalService } from "src/app/services/gestor-documental.service";
import Swal from "sweetalert2";

// Definir las interfaces
interface Pregunta {
  text: string;
  tipo: string;
  options: { valor: string; texto: string }[];
}

interface Ambito {
  nombre: string;
  titulo: string;
  preguntas: Pregunta[];
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
  formularios = [
    HETEROEVALUACION,
    AUTOEVALUACION_I,
    AUTOEVALUACION_II,
    COEVALUACION_I,
    COEVALUACION_II,
  ]; // Lista de formularios disponibles
  selectedForm: any; // Variable para almacenar el formulario seleccionado
  ambitos: Ambito[] = []; // Tipar los ámbitos correctamente
  comentarioCounter = 1; // Contador para numerar los comentarios de forma continua
  actaFile: File | null = null;
  isFormView: boolean = false;
  coevaluacionI = COEVALUACION_I;
  expandAllState: boolean[] = [];

  @ViewChild("mainStepper") mainStepper!: MatStepper;

  constructor(
    private fb: FormBuilder,
    private gestorService: GestorDocumentalService
  ) {}

  ngOnInit() {
    // Inicializar el formulario principal
    this.stepperForm = this.fb.group({});

    // Seleccionar el formulario por defecto para la vista inicial
    this.selectForm("heteroevaluacion"); // Se puede cambiar según las necesidades
  }

  // Método para inicializar el formulario seleccionado
  selectForm(tipo_formulario: string) {
    this.stepperForm = this.fb.group({});
    this.selectedForm = this.formularios.find(
      (f) => f.tipo_formulario === tipo_formulario
    );

    if (this.selectedForm) {
      this.ambitos = this.selectedForm.ambitos;

      // Inicializamos el estado de expansión para cada ámbito
      this.expandAllState = this.ambitos.map(() => false);

      // Convertir preguntas de tipo 'select' a 'radio' para los formularios de Heteroevaluación y Autoevaluación I
      if (
        tipo_formulario === "heteroevaluacion" ||
        tipo_formulario === "autoevaluacion-i"
      ) {
        this.ambitos.forEach((ambito) => {
          ambito.preguntas.forEach((pregunta) => {
            if (pregunta.tipo === "select") {
              pregunta.tipo = "radio"; // Convertimos 'select' a 'radio'
            }
          });
        });
      }

      // Mostrar el botón "Cargar Evidencias" al final de los ámbitos 1, 2 y 3 del formulario "Autoevaluación II"
      if (tipo_formulario === "autoevaluacion-ii") {
        this.ambitos.forEach((ambito, index) => {
          // Mostrar el botón solo en los ámbitos 1, 2 y 3
          if (index === 0 || index === 1 || index === 2) {
            ambito.preguntas.push({
              text: "El cuerpo docente debe cargar las evidencias correspondientes:",
              tipo: "boton",
              options: [],
            });
          }
        });
      }

      // Inicializar el formulario específico de Coevaluación II si se selecciona ese formulario
      if (tipo_formulario === "coevaluacion-ii") {
        this.initializeCoevaluacionIIForm();
      }

      // Inicializar el formulario dinámico
      this.initializeForm();

      // Inicializamos el estado expandido de las preguntas
      this.expandAllState = this.ambitos.map(() => false); // Inicialmente, todas las preguntas están colapsadas
    }
  }

  // Método para inicializar el formulario específico de Coevaluación II
  initializeCoevaluacionIIForm() {
    this.ambitos.forEach((ambito: Ambito, index: number) => {
      const group = this.fb.group({});

      ambito.preguntas.forEach((pregunta: Pregunta) => {
        // Si no hay texto o es un tipo de pregunta que no requiere input, no creamos el control
        if (!pregunta.text || pregunta.tipo === "download") {
          console.warn(
            `Pregunta sin texto o de tipo ${pregunta.tipo} no necesita control.`
          );
          return;
        }

        const controlName = this.generateControlName(pregunta.text);
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
      const group = this.fb.group({});

      ambito.preguntas.forEach((pregunta: Pregunta) => {
        // Si la pregunta no tiene texto o es de tipo 'download', lo ignoramos
        if (!pregunta.text || pregunta.tipo === "download") {
          console.log(
            `Pregunta sin texto o de tipo download encontrada en ámbito: ${ambito.titulo}`
          );
          return; // No creamos un control para estas preguntas
        }

        const controlName = this.generateControlName(pregunta.text);

        // Si es una pregunta de tipo 'radio', agregamos el control con validación requerida
        if (pregunta.tipo === "radio") {
          group.addControl(
            `pregunta_${controlName}`,
            this.fb.control("", Validators.required)
          );
        }
        // Si es una pregunta de tipo 'input' o 'textarea', simplemente agregamos el control
        else if (pregunta.tipo === "input" || pregunta.tipo === "textarea") {
          group.addControl(`pregunta_${controlName}`, this.fb.control(""));
        }
        // Para otros tipos, como 'checkbox' u 'options', también se pueden agregar controles aquí
        else if (pregunta.tipo === "checkbox") {
          group.addControl(`pregunta_${controlName}`, this.fb.control(false));
        } else {
          // En caso de un tipo no especificado, agregar un control por defecto
          group.addControl(`pregunta_${controlName}`, this.fb.control(""));
        }
      });

      // Agregamos el conjunto de preguntas para el ámbito actual al formulario
      this.stepperForm.addControl(`ambito_${index}`, group);
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
        text: "Por favor seleccione un archivo para cargar.",
      });
      return;
    }
    const sendActa = {
      IdDocumento: 74,
      nombre: this.actaFile.name.split(".")[0],
      metadatos: {
        proyecto: "123",
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
      `pregunta_${this.ambitos[ambitoIndex].preguntas[preguntaIndex].text}`
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
    const respuestas: Respuesta[] = []; // Tipado explícito de la variable respuestas
    this.ambitos.forEach((ambito, i) => {
      ambito.preguntas.forEach((pregunta, j) => {
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
  generateControlName(text: string): string {
    // Verificamos si el texto es undefined o null, en ese caso devolvemos un valor por defecto
    return (text || "pregunta_sin_texto")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();
  }

  cargarEvidencias(): void {
    this.uploadActa();
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
}
