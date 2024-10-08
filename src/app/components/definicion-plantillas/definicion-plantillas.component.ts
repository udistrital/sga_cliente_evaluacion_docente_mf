import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { startWith, map } from "rxjs";
import { EvaluacionDocenteService } from "src/app/services/evaluacion-docente-crud.service";

interface Campo {
  TipoCampoId: number;
  Nombre: string;
  // Otras propiedades según tu JSON
}

interface Seccion {
  titulo: string;
  componentes: Componente[];
}

interface Componente {
  nombre: string;
  ponderacion: number;
}

@Component({
  selector: "app-definicion-plantillas",
  templateUrl: "./definicion-plantillas.component.html",
  styleUrls: ["./definicion-plantillas.component.scss"],
})
export class DefinicionPlantillasComponent implements OnInit {
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
    { numero: 1, nombre: "Componente 1", ponderacion: 20 },
    { numero: 2, nombre: "Componente 2", ponderacion: 30 },
  ];

  mostrandoVistaComponente = false;
  mostrarTablaDos = false;
  formularioTitulo: string = "Formulario heteroevaluación";
  nuevoPorcentaje: number = 0;
  tipoCampos: any[] = [];
  preguntasFiltradas: any[] = [];
  tipoCampoSeleccionado: number = 0;
  preguntaSeleccionada: any;
  preguntaControl = new FormControl();
  tituloSeccion: string = "";
  secciones: Seccion[] = [];
  formularioSeleccionado: string = "heteroevaluacion"; // Valor por defecto
  seccionSeleccionada: any = null;

  constructor(private evaluacionDocenteService: EvaluacionDocenteService) {}

  ngOnInit() {
    this.obtenerCamposActivos();
    this.preguntaControl.valueChanges
      .pipe(
        startWith(""),
        map((value) => this._filterPreguntas(value))
      )
      .subscribe((filtered) => {
        this.preguntasFiltradas = filtered;
      });
  }

  obtenerCamposActivos() {
    this.evaluacionDocenteService.getCamposActivos().subscribe(
      (response: any) => {
        if (Array.isArray(response.Data)) {
          this.tipoCampos = response.Data.map((campo: Campo) => {
            let label = "";
            switch (campo.TipoCampoId) {
              case 4668:
                label = "Pregunta de opción múltiple con única respuesta";
                break;
              case 4674:
                label = "Pregunta abierta";
                break;
              case 4672:
                label = "Botón de descargar archivos";
                break;
              case 6686:
                label = "Botón de cargar archivos";
                break;
              default:
                label = "Desconocido";
            }
            return { TipoCampoId: campo.TipoCampoId, label: label };
          });
        } else {
          console.error(
            "Error: la respuesta de la API no es un arreglo.",
            response
          );
        }
      },
      (error) => {
        console.error("Error al obtener los campos activos:", error);
      }
    );
  }

  filtrarPorTipo() {
    this.evaluacionDocenteService
      .getCamposActivos()
      .subscribe((response: any) => {
        if (Array.isArray(response.Data)) {
          this.preguntasFiltradas = response.Data.filter(
            (p: Campo) => p.TipoCampoId === this.tipoCampoSeleccionado
          );
        } else {
          console.error(
            "Error: la respuesta de la API no contiene un arreglo en la propiedad Data.",
            response
          );
        }
      });
  }

  private _filterPreguntas(value: string): any[] {
    const filterValue = value.toLowerCase();
    const filtered = this.preguntasFiltradas.filter((option) =>
      option.Nombre.toLowerCase().includes(filterValue)
    );
    return filtered.length ? filtered : [{ Nombre: "No existe escala" }];
  }

  displayNombre(pregunta: any): string {
    return pregunta && pregunta.Nombre ? pregunta.Nombre : "";
  }

  mostrarVistaComponente() {
    this.mostrandoVistaComponente = true;
  }

  mostrarSegundaTabla() {
    this.mostrarTablaDos = true;
  }

  prepararAgregarComponente(seccion: any) {
    this.seccionSeleccionada = seccion;
  }

  agregarComponente() {
    if (
      this.nuevoPorcentaje > 0 &&
      this.preguntaSeleccionada &&
      this.preguntaSeleccionada.Nombre !== "No existe escala"
    ) {
      const nuevoComponente = {
        numero: this.seccionSeleccionada.componentes.length + 1,
        nombre: this.preguntaSeleccionada ? this.preguntaSeleccionada.Nombre : "",
        ponderacion: this.nuevoPorcentaje,
      };
  
      // Asegurarnos de que 'componentes' esté definido
      if (!this.seccionSeleccionada.componentes) {
        this.seccionSeleccionada.componentes = [];
      }
  
      // Insertar el nuevo componente en la sección seleccionada
      this.seccionSeleccionada.componentes.push(nuevoComponente);
  
      // Actualizamos el 'dataSource' de la tabla para reflejar el nuevo componente
      this.seccionSeleccionada.componentes = [...this.seccionSeleccionada.componentes];
  
      // Reiniciar los valores del formulario para agregar componentes
      this.nuevoPorcentaje = 0;
      this.preguntaSeleccionada = null;
  
      // Opcional: Cerrar el panel de agregar componente después de la inserción
      this.seccionSeleccionada = null;
    } else {
      console.error(
        "El porcentaje debe ser mayor que 0 o la pregunta seleccionada no es válida."
      );
    }
  }  

  // Función para cambiar el proceso seleccionado en el menú desplegable
  cambiarProceso(form: any) {
    this.formularioSeleccionado = form.proceso;
    console.log("Proceso seleccionado:", this.formularioSeleccionado);
  }

  // Función para agregar una nueva sección
  agregarSeccion() {
    if (this.tituloSeccion.trim()) {
      // Aseguramos que cada nueva sección tenga la propiedad 'componentes' inicializada como un arreglo vacío
      this.secciones.push({ titulo: this.tituloSeccion, componentes: [] });
      this.tituloSeccion = ""; // Limpiar el campo de entrada
    }
  }

  eliminarSeccion(index: number) {
    this.secciones.splice(index, 1); // Eliminar la sección seleccionada
  }

  eliminarComponente(seccion: any, componente: any) {
    const index = seccion.componentes.indexOf(componente);
    if (index >= 0) {
      seccion.componentes.splice(index, 1);
    }
  }

    // Función para guardar el formulario
    guardarFormulario() {
      // Construimos la estructura del JSON con las secciones y los componentes
      const formularioData = {
        estructura: `Formulario ${this.formularioSeleccionado}`,
        secciones: this.secciones.map((seccion: Seccion) => ({
          nombre: seccion.titulo,
          items: seccion.componentes.map((componente: Componente) => ({
            nombre: componente.nombre,
            porcentaje: componente.ponderacion
          }))
        }))
      };
  
      console.log("JSON generado:", formularioData);
  
      // Aquí puedes hacer algo con el JSON generado, por ejemplo, enviarlo a una API
      // this.miServicio.guardarFormulario(formularioData).subscribe(response => {
      //   console.log("Formulario guardado exitosamente:", response);
      // });
    }
  

}
