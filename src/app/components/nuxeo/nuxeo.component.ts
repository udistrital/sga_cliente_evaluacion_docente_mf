import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GestorDocumentalService } from "src/app/services/gestor-documental.service";
import Swal from "sweetalert2";


@Component({
  selector: "app-nuxeo",
  templateUrl: "./nuxeo.component.html",
  styleUrls: ["./nuxeo.component.scss"],
})
export class NuxeoComponent {
  actaFile: File | null = null;
  actaPrevia: { uid: string | null; url: string | null } = {
    uid: null,
    url: null,
  };

  formData = {
    id_periodo: 1,
    id_tercero: 1,
    id_evaluado: 1,
    proyecto_curricular: 123,
    espacio_academico: 12,
    plantilla_id: 456,
    respuestas: [
      {
        item_id: 1,
        valor: '5'
      },
      {
        item_id: 2,
        valor: 'comentario'
      },
      {
        item_id: 3,
        archivos: [] as string[]
      }
    ]
  };

  forms = [
    { value: 'form1', viewValue: 'Formulario 1' },
    { value: 'form2', viewValue: 'Formulario 2' }
  ];

  options = ['Insuficiente', 'Necesita mejorar', 'Bueno', 'Sobresaliente', 'Excelente'];

  selectedForm: string = '';
  currentFormQuestions: any[] = [];
  form2: FormGroup;
  showFullView: boolean = false;

  displayedColumns: string[] = ['label', 'options'];

  constructor(private gestorService: GestorDocumentalService, private fb: FormBuilder) {
    this.loadFormQuestions('form1'); // Cargar el formulario inicial
    this.form2 = this.fb.group({}); // Inicializa el formulario 2
  }

  handleFileInputChange(event: any): void {
    this.actaFile = event.target.files[0] ?? null;
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
        proyecto: this.formData.proyecto_curricular.toString(),
        plan_estudio: this.formData.espacio_academico.toString(),
        espacio_academico: "Espacio académico",
      },
      descripcion: "Acta de consejo curricular para nuevo syllabus",
      file: this.actaFile,
    };

    this.gestorService.uploadFiles([sendActa]).subscribe({
      next: () => {
        const archivos = this.formData.respuestas[2].archivos;
        if (archivos && Array.isArray(archivos)) {
          archivos[0] = 'UID nuxeo actualizado';
        } else {
          this.formData.respuestas[2].archivos = ['UID nuxeo actualizado'];
        }
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Archivo cargado correctamente.',
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar el archivo.',
        });
      }
    });
  }

  downloadActa(): void {
    if (this.actaPrevia.uid) {
      this.gestorService.getByUUID(this.actaPrevia.uid).subscribe({
        next: (document) => {
          window.open(document);
        },
        error: () => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al descargar el archivo.",
          });
        },
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "No hay un archivo cargado previamente para descargar.",
      });
    }
  }

  confirmUpload(): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas enviar el archivo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.uploadActa();
      }
    });
  }

  onFormChange(event: any): void {
    this.selectedForm = event.value;
    this.loadFormQuestions(event.value);
  }

  loadFormQuestions(formName: string): void {
    this.currentFormQuestions = [
      { label: '01. Demuestra conocimiento de los contenidos...', control: this.fb.group({ response: ['', Validators.required] }) },
      { label: '02. Demuestra habilidades para conducir procesos...', control: this.fb.group({ response: ['', Validators.required] }) },
      { label: '03. Demuestra comprensión de ritmos de aprendizaje...', control: this.fb.group({ response: ['', Validators.required] }) },
      { label: '04. Demuestra habilidades para organizar y explicar ideas', control: this.fb.group({ response: ['', Validators.required] }) },
      { label: '05. Demuestra habilidades para observar su aula, diagnosticar necesidades y adaptarse al contexto', control: this.fb.group({ response: ['', Validators.required] }) }
    ];

    // Si es el formulario 2, agrega los controles al formGroup form2
    if (formName === 'form2') {
      this.form2 = this.fb.group({});
      this.currentFormQuestions.forEach((question, index) => {
        this.form2.addControl(`question_${index}`, question.control);
      });
    }
  }

  goToNextStep(stepper: any, index: number): void {
    if (index < this.currentFormQuestions.length - 1) {
      stepper.next();
    }
  }

  toggleFullView(): void {
    this.showFullView = !this.showFullView;
  }

  submitFullViewForm(): void {
    if (this.form2.valid) {
      Swal.fire({
        icon: 'success',
        title: 'Formulario completado',
        text: '¡Gracias por completar el formulario!',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, responda todas las preguntas antes de finalizar.',
      });
    }
  }
}