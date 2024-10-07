import { Component } from "@angular/core";

@Component({
  selector: "app-definicion-plantillas",
  templateUrl: "./definicion-plantillas.component.html",
  styleUrls: ["./definicion-plantillas.component.scss"],
})
export class DefinicionPlantillasComponent {
  displayedColumns: string[] = [
    "numero",
    "proceso",
    "fecha",
    "estado",
    "ponderacion",
    "acciones",
  ];
  displayedColumnsComponente: string[] = [
    "numero",
    "nombre",
    "ponderacion",
  ];

  formularios = [
    {
      numero: 1,
      proceso: "Heteroevaluación",
      fecha: new Date(),
      estado: "Activo",
      ponderacion: 100,
    },
  ];

  componentes = [
    { numero: 1, nombre: "Componente 1", ponderacion: 20 },
    { numero: 2, nombre: "Componente 2", ponderacion: 30 },
  ];

  mostrandoVistaComponente = false;
  mostrarTablaDos = false; // Para controlar la visibilidad de la tabla dos
  formularioTitulo: string = "Formulario heteroevaluación"; // Título editable
  nuevoPorcentaje: number = 0;  // Variable para el porcentaje
  tiposDeRespuesta: string[] = ["Opción 1", "Opción 2", "Opción 3"];

  // Muestra el formulario editable y el texto orientativo
  mostrarVistaComponente() {
    this.mostrandoVistaComponente = true;
  }

  // Muestra la segunda tabla de componentes
  mostrarSegundaTabla() {
    this.mostrarTablaDos = true;
  }

  // Función para agregar un nuevo componente con porcentaje
  agregarComponente() {
    if (this.nuevoPorcentaje > 0) {
      const nuevoComponente = {
        numero: this.componentes.length + 1,
        nombre: "Nuevo componente",
        ponderacion: this.nuevoPorcentaje, // Añade el porcentaje aquí
      };
      this.componentes.push(nuevoComponente);
      this.nuevoPorcentaje = 0; // Reiniciar el valor del porcentaje
    } else {
      console.error('El porcentaje debe ser mayor que 0.');
    }
  }
}

