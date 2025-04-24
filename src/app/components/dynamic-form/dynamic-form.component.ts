import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin } from "rxjs";
import { TIPOINPUT } from "src/app/models/const_eva";
import { GestorDocumentalService } from "src/app/services/gestor-documental.service";
//import { ParametrosService } from "src/app/services/parametros.service";
import { SgaEvaluacionDocenteMidService } from "src/app/services/sga_evaluacion_docente_mid.service";
import Swal from "sweetalert2";

// Definir las interfaces

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
export class DynamicFormComponent implements OnInit, OnChanges {

  stepperForm!: FormGroup; // Inicializa el FormGroup correctamente
  TIPOINPUT = TIPOINPUT;
  todasSecciones: any[] = [];
  actaFile: File | null = null;
  expandAllState: boolean = false;
  vertHorAllState: boolean = false;
  panelIndex: number[] = [];
  periodoActual!: number;

  uploadedFileUid: string | null = null;
  documentId: string | null = null;

  @ViewChild("mainStepper") mainStepper!: MatStepper;
  @Input() inputData: any; // Define el @Input

  @Input() formtype!: string;
  @Input() evaluador!: number;
  @Input() evaluado!: number;
  @Input() proyectoEspacio!: number;
  @Input() proyectoEvaluador!: number;
  @Input() espacio!: string;
  @Input() grupos!: any[];
  @Input() espacios!: any[];
  @Input() grupo!: any;

  @Output() evaluacionCompletada = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private evaluacionDocenteMidService: SgaEvaluacionDocenteMidService,
    private gestorService: GestorDocumentalService,
    private gestorDocumentalService: GestorDocumentalService,
    private translateService: TranslateService,
    //private parametrosService: ParametrosService
  ) {
    this.stepperForm = this.fb.group({});
  }

  ngOnInit() {
    //consulta el periodo actual
    /*let anioActual = new Date().getFullYear().toString();
    this.parametrosService.get('periodo?query=year:' + anioActual + ',activo:true,codigo_abreviacion:PA').subscribe(
      (responsePeriodo: any) => {
        if (responsePeriodo && responsePeriodo.Data && responsePeriodo.Data.length) {
          this.periodoActual = responsePeriodo.Data[0].Id;
        } else {
          console.error('Error al obtener el periodo actual:', responsePeriodo.Message);
        }
      },
      (error) => {
        console.error('Error al obtener el periodo actual:', error);
      }
    );*/

    const periodo = localStorage.getItem('periodo_actual');

    if (periodo && periodo !== '0') {
      this.periodoActual = Number(periodo);
    } else {
      console.warn('⚠️ No hay periodo actual válido en localStorage');
    }
  }

  ngOnChanges() {
    this.selectForm(this.formtype);
  }

  // Método para inicializar el formulario seleccionado
  selectForm(tipo_formulario: string) {
    let url;
    this.grupos && this.grupos.length !== undefined ? url = `formulario_por_tipo?id_tipo_formulario=${tipo_formulario}&id_periodo=1&id_evaluador=${this.evaluador}&id_espacio=0` : url = `formulario_por_tipo?id_tipo_formulario=${tipo_formulario}&id_periodo=1&id_evaluador=${this.evaluador}&id_espacio=0&id_grupo=0`
    this.evaluacionDocenteMidService.get(url)
      .subscribe(response => {
        if (response.Success === true && response.Status === 200) {
          this.todasSecciones = response.Data.seccion;
          this.todasSecciones.forEach((seccion, i) => {
            seccion.items.forEach((pregunta: any, j: number) => {
              if (pregunta.campos !== null) {
                let controlName = this.generateControlName(seccion.id, pregunta.id);
                const requiredCheck = pregunta.campos[0].tipo_campo === TIPOINPUT.FileDownload ? null : Validators.required;
                this.stepperForm.addControl(`pregunta_${controlName}`, this.fb.control('', requiredCheck));
              }
            });
          });
          const maxSecciones = this.todasSecciones.length;
          // Inicializamos el estado expandido de las preguntas
          this.expandAllState = true;
          this.vertHorAllState = true;
          this.panelIndex = Array(maxSecciones).fill(0);
      } else {
        console.error('Error al obtener el formulario:', response.Message);
      }
    }, error => {
      console.error('Error validando la existencia de la evaluación:', error);
      if (error.Message == null) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al consultar el formulario.',
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: this.translateService.instant('GLOBAL.atencion'),
          text: error.Message,
        }).then(() => {
          this.evaluacionCompletada.emit();
        });
      }
    });
}

  handleFileInputChange(event: any, seccionId: number, itemId: number): void {
    const controlName = `pregunta_${this.generateControlName(seccionId, itemId)}`;
    this.stepperForm.patchValue({
        [controlName]: event.target.files[0] ?? null,
    })
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
        return new FormControl(); // Retornamos un control vacío para evitar el error
      }

      const control = ambitoControl.get(controlName);
      if (control) {
        return control;
      } else {
        console.error(`Control not found for ${controlName}`);
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
      `pregunta_${this.todasSecciones[ambitoIndex].preguntas[preguntaIndex].text}`
    );

    // Si la respuesta es válida (se ha seleccionado una opción)
    if (control.valid) {
      // Avanzar automáticamente a la siguiente pregunta si existe
      if (preguntaIndex < this.todasSecciones[ambitoIndex].preguntas.length - 1) {
        innerStepper.next(); // Avanzar a la siguiente pregunta
      } else {
        // Si es la última pregunta, se queda en el mismo ámbito hasta que el usuario decida avanzar
        console.log(
          "Última pregunta del ámbito, el usuario debe avanzar manualmente al siguiente ámbito"
        );
      }
    }
  }

  saveForm(requests: any) {
    forkJoin(requests).subscribe((responses: any) => {
      let allSuccess = true;

      responses.forEach((response: any) => {
        if (response.Status !== 200 || response.Success !== true) {
          allSuccess = false;
        }
      });

      if (allSuccess) {
        Swal.fire({
          icon: 'success',
          title: 'Formulario guardado',
          text: 'El formulario ha sido guardado correctamente.',
        }).then(() => {
          this.evaluacionCompletada.emit();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar el formulario.',
        });
      }
    },
      error => {
        console.error(error);
        if (error.Message == null) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al guardar el formulario.',
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('GLOBAL.atencion'),
            text: error.Message,
          }).then(() => {
            this.evaluacionCompletada.emit();
          });
        }
      });
  }

  // Método para manejar el evento de submit
  submit() {
    if (this.stepperForm.valid) {
      this.generateResponseData().then(respuestas => {
        const requests: any[] = [];
  
        if (this.espacios && this.espacios.length > 0) {
          this.espacios.forEach((esp) => {
            const gruposJson = JSON.stringify(esp.grupos);
            const jsonData = {
              id_periodo: this.periodoActual,
              id_evaluador: String(this.evaluador),
              id_evaluado: this.evaluado != null ? String(this.evaluado) : String(this.evaluador),
              proyecto_curricular_espacio: String(this.proyectoEspacio),
              proyecto_curricular_evaluador: String(this.proyectoEvaluador),
              grupos: gruposJson,
              espacio_academico: esp.id,
              plantilla_id: 456,
              proceso_id: Number(this.formtype),
              respuestas,
            };
            const request = this.evaluacionDocenteMidService.post('respuesta_formulario', jsonData);
            requests.push(request);
          });
        } else {
          let gruposJson;
          if (this.grupos && this.grupos.length !== undefined) {
            gruposJson = JSON.stringify(this.grupos);
          } else if (this.grupo) {
            gruposJson = JSON.stringify([this.grupo]);
          } else {
            gruposJson = '[]';
          }
  
          const espaciosArray = this.espacio ? this.espacio.split(',') : [];
          espaciosArray.forEach(esp => {
            const jsonData = {
              id_periodo: this.periodoActual,
              id_evaluador: String(this.evaluador),
              id_evaluado: this.evaluado != null ? String(this.evaluado) : String(this.evaluador),
              proyecto_curricular_espacio: String(this.proyectoEspacio),
              proyecto_curricular_evaluador: String(this.proyectoEvaluador),
              grupos: gruposJson,
              espacio_academico: esp,
              plantilla_id: 456,
              proceso_id: Number(this.formtype),
              respuestas,
            };
            const request = this.evaluacionDocenteMidService.post('respuesta_formulario', jsonData);
            requests.push(request);
          });
        }
        this.saveForm(requests);
      }).catch(error => {
        console.error('Error al generar las respuestas:', error);
      });
    } else {
      console.error("Formulario inválido:", this.stepperForm);
      this.stepperForm.markAllAsTouched();
      this.markInvalidFields(this.stepperForm);
      Swal.fire({
        icon: "error",
        title: "Formulario incompleto",
        text: "Por favor, complete todas las preguntas.",
      });
    }
  }

  markInvalidFields(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control?.invalid) {
        console.error(`El campo ${field} es inválido.`);
      }
    });
  }

  async generateResponseData(): Promise<Respuesta[]> {
    const respuestas: Respuesta[] = [];

    const promesas = this.todasSecciones.map(seccion =>
      seccion.items.map(async (pregunta: any) => {
        const controlName = this.generateControlName(seccion.id, pregunta.id);
        const control = this.stepperForm.get(`pregunta_${controlName}`);

        if (control?.value instanceof File) {
          const resp = await this.loadFile(control.value);
          this.documentId = resp[0].res.Enlace;
          respuestas.push({
            item_id: pregunta.id,
            valor: resp[0].res.Enlace,
          });
        } else {
          respuestas.push({
            item_id: pregunta.id,
            valor: control?.value || "",
          });
        }
      })
    );

    await Promise.all(promesas.flat());

    return respuestas;
  }

  hasDocumentForDownload(pregunta: any) {
    return pregunta != null && pregunta.campos != null
      ? pregunta.campos.some((campo: any) => campo.tipo_campo == TIPOINPUT.FileDownload)
      : false;
  }

  // Función para generar el nombre de un control
  generateControlName(seccionId: number, itemId: number): string {
    // Ejemplo: sec_1_pre1
    return `sec_${seccionId}_pre_${itemId}`;
  }

  // Cargar archivos nuxeo como promesa
  loadFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const objetoFile = {
        IdDocumento: 74, // Este ID puede cambiar según el contexto
        nombre: "Evidencia evaluación",
        metadatos: {},
        descripcion: "",
        file: file,
    };
    this.gestorService.uploadFiles([objetoFile]).subscribe({
      next: (resp) => {
        resolve(resp);
        /* Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Archivo cargado correctamente.",
        }); */
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al cargar el archivo.",
        });
        reject("Error al cargar archivo");
      },
    });
    });
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

  getNumericalInputLabel(ambitoIndex: number, inputIndex: number): number {
    const inputStart = ambitoIndex === 0 ? 1 : ambitoIndex === 1 ? 6 : 11;
    return inputStart + inputIndex;
  }

  // Función para manejar la descarga de archivos
  onDownload(fileName: string) {
    // lógica para descargar el archivo
    // se puede hacer una petición HTTP para obtener el archivo y descargarlo
  }

  // Método para alternar la expansión de todas las preguntas de un ámbito
  /*toggleAll(index: number) {
    this.expandAllState = !this.expandAllState;
  }

  // Método para alternar entre radio horizontal o vertical
  toggleLayout(index: number) {
    this.vertHorAllState = !this.vertHorAllState;
  }*/

  cambioPanel(index: number, sentido: boolean) {
    if (sentido) {
      this.panelIndex[index] = this.panelIndex[index] + 1;
    } else {
      this.panelIndex[index] = this.panelIndex[index] - 1;
    }
  }

  // Método para manejar la descarga 
  downloadDocument() {
    if (this.documentId) {
      this.gestorDocumentalService.getByUUID(this.documentId).subscribe(
        (fileUrl: string) => {
          this.triggerDownload(fileUrl);
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