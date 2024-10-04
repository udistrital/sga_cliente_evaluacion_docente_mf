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
    "estado",
    "ponderacion",
    "acciones",
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
    { numero: 1, nombre: "Componente 1", estado: "Activo", ponderacion: 20 },
    { numero: 2, nombre: "Componente 2", estado: "Inactivo", ponderacion: 30 },
  ];
  mostrandoVistaComponente = false;
  nuevoTitulo: string = "";
  creandoFormulario = false;
  editandoComponente = false;
  mostrarOpcionesTipoRespuesta = false;
  tipoRespuestaSeleccionada: string = ""; // Almacena el tipo de respuesta seleccionada
  formularioSeleccionado: any = {};
  textoOrientativo = "";
  procesos = ["Heteroevaluación", "Autoevaluación", "Coevaluación"];
  periodos = ["2024-1", "2024-2"];
  roles = ["Administrador", "Docente", "Estudiante"];

  constructor() {}

  crearNuevoFormulario() {
    this.creandoFormulario = true;
  }

  mostrarOpciones() {
    this.mostrarOpcionesTipoRespuesta = !this.mostrarOpcionesTipoRespuesta;
  }

  seleccionarTipoRespuesta(tipo: string) {
    this.tipoRespuestaSeleccionada = tipo;
    this.mostrarOpcionesTipoRespuesta = false; // Cerrar las opciones después de seleccionar
  }

  cancelarCreacion() {
    this.creandoFormulario = false;
  }

  guardarFormulario() {
    console.log("Formulario guardado");
  }

  // Muestra la vista de componentes
  mostrarVistaComponente() {
    this.mostrandoVistaComponente = true;
  }

  // Oculta la vista de componentes
  ocultarVistaComponente() {
    this.mostrandoVistaComponente = false;
  }

  // Agregar texto orientativo
  agregarTextoOrientativo() {
    console.log("Texto orientativo agregado:", this.textoOrientativo);
  }

  // Agregar nuevo componente
  agregarComponente() {
    const nuevoComponente = {
      numero: this.componentes.length + 1,
      nombre: "Nuevo componente",
      estado: "Activo",
      ponderacion: 100,
    };
    this.componentes.push(nuevoComponente);
  }
}
