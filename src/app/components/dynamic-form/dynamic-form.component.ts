import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { DomSanitizer } from "@angular/platform-browser";
import { Subject } from "rxjs/internal/Subject";
import {
  HETEROEVALUACION,
  AUTOEVALUACION_I,
  AUTOEVALUACION_II,
  COEVALUACION_I,
  COEVALUACION_II,
  response,
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
    response,
    HETEROEVALUACION,
    AUTOEVALUACION_I,
    AUTOEVALUACION_II,
    COEVALUACION_I,
    COEVALUACION_II,
  ]; // Lista de formularios disponibles
  selectedForm: any; // Variable para almacenar el formulario seleccionado
  ambitos: Ambito[] = []; // Tipar los ámbitos correctamente
  todasSecciones: any[] = [];
  comentarioCounter = 1; // Contador para numerar los comentarios de forma continua
  actaFile: File | null = null;
  isFormView: boolean = false;
  coevaluacionI = COEVALUACION_I;
  expandAllState: boolean[] = [];
  uploadedFileUid: string | null = null;
  documentId: string | null = null;

  @ViewChild("mainStepper") mainStepper!: MatStepper;
  @Input() inputData: any; // Define el @Input

  constructor(
    private fb: FormBuilder,
    private gestorService: GestorDocumentalService,
    private gestorDocumentalService: GestorDocumentalService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // Inicializar el formulario principal
    this.stepperForm = this.fb.group({});
    this.documentId = '74';
    // Seleccionar el formulario por defecto para la vista inicial
    this.selectForm(this.inputData); // Se puede cambiar según las necesidades
  }

  // Método para inicializar el formulario seleccionado
  selectForm(tipo_formulario: string) {
    const docenteId = response.Data.Data.docente;
    const espacioAcademico = response.Data.Data.espacioAcademico;
    const cualitativa = response.Data.Data.seccion.cualitativa.map(seccion => ({ tipo: 'cualitativa', ...seccion }));
    const cuantitativa = response.Data.Data.seccion.cuantitativa.map(seccion => ({ tipo: 'cuantitativa', ...seccion }));
    // const descripcion = [{ tipo: 'descripcion', orden: 3, nombre: "Descripción" }];
    // const cargarArchivo = [{ tipo: 'cargar archivo', orden: 1, nombre: "Cargar Archivo" }];
    // const descargaArchivos = [{ tipo: 'descarga de archivos', orden: 4, nombre: "Descarga de Archivos" }];
    // Combinar todas las secciones en un solo array
    this.todasSecciones = [
      ...cualitativa,
      ...cuantitativa,
      // ...descripcion,
      // ...cargarArchivo,
      // ...descargaArchivos
    ];
    this.todasSecciones = this.todasSecciones.filter((seccion, index, self) => 
      index === self.findIndex((s) => s.orden === seccion.orden)
    );
    
    // Ordenar todas las secciones de menor a mayor por 'orden'
    this.todasSecciones.sort((a, b) => a.orden - b.orden);

    // Imprimir las secciones ordenadas
    console.log("Secciones ordenadas de menor a mayor:", this.todasSecciones);


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
          console.error('Error downloading the document:', error);
        }
      );
    } else {
      console.error('Document ID not found');
    }
  }

  triggerDownload(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = 'documento.pdf';
    link.click();
  }
}