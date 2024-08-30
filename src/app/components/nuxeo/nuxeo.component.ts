import { Component } from "@angular/core";
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

  // Datos quemados del formulario
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
        archivos: [] as string[]  // Define el tipo correctamente
      }
    ]
  };  

  constructor(private gestorService: GestorDocumentalService) {}

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
        espacio_academico: "Espacio académico", // Ajustar según sea necesario
      },
      descripcion: "Acta de consejo curricular para nuevo syllabus",
      file: this.actaFile,
    };

    this.gestorService.uploadFiles([sendActa]).subscribe({
      next: () => {
        const archivos = this.formData.respuestas[2].archivos;
        if (archivos && Array.isArray(archivos)) {
          archivos[0] = 'UID nuxeo actualizado'; // Simula la actualización del UID después de la carga
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
}
