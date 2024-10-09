import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { startWith, map } from "rxjs";
import { EvaluacionDocenteService } from "src/app/services/evaluacion-docente-crud.service";

interface Campo {
  TipoCampoId: number;
  Nombre: string;
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
  formularioSeleccionado: string = "heteroevaluacion";
  seccionSeleccionada: any = null;
  porcentajeInvalido: boolean = false;

  constructor(
    private evaluacionDocenteService: EvaluacionDocenteService,
    private cdr: ChangeDetectorRef
  ) {}

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

  // Método para validar que el porcentaje esté entre 1 y 100
  validarPorcentaje() {
    if (this.nuevoPorcentaje < 1 || this.nuevoPorcentaje > 100) {
      this.porcentajeInvalido = true;
    } else {
      this.porcentajeInvalido = false;
    }
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

  agregarSeccion() {
    if (this.tituloSeccion.trim()) {
      this.secciones.push({ titulo: this.tituloSeccion, componentes: [] });
      this.tituloSeccion = "";
      this.secciones = [...this.secciones]; // Actualizar vista
    }
  }

  agregarComponente() {
    this.validarPorcentaje(); // Validar antes de agregar el componente
  
    if (
      this.nuevoPorcentaje > 0 &&
      this.nuevoPorcentaje <= 100 &&
      this.preguntaSeleccionada &&
      this.preguntaSeleccionada.Nombre !== "No existe escala"
    ) {
      const nuevoComponente = {
        numero: this.seccionSeleccionada.componentes.length + 1,
        nombre: this.preguntaSeleccionada.Nombre,
        ponderacion: this.nuevoPorcentaje,
      };
  
      // Asegurarse de que la lista de componentes esté definida
      if (!this.seccionSeleccionada.componentes) {
        this.seccionSeleccionada.componentes = [];
      }
  
      // Añadir el nuevo componente a la sección seleccionada
      this.seccionSeleccionada.componentes.push(nuevoComponente);
  
      // Actualizar la lista de componentes para que Angular detecte los cambios
      this.seccionSeleccionada.componentes = [...this.seccionSeleccionada.componentes];
      this.secciones = [...this.secciones]; // Actualizar la vista
  
      this.cdr.detectChanges(); // Forzar la detección de cambios
  
      // Limpiar las variables para el siguiente uso
      this.nuevoPorcentaje = 0;
      this.preguntaSeleccionada = null;
      this.seccionSeleccionada = null;
    } else {
      console.error(
        "El porcentaje debe estar entre 1 y 100 o la pregunta seleccionada no es válida."
      );
    }
  }  

  cambiarProceso(form: any) {
    this.formularioSeleccionado = form.proceso;
    console.log("Proceso seleccionado:", this.formularioSeleccionado);
  }

  eliminarSeccion(index: number) {
    this.secciones.splice(index, 1);
  }

  eliminarComponente(seccion: any, componente: any) {
    console.log("Sección recibida para eliminar:", seccion);
    console.log("Componentes en la sección:", seccion ? seccion.componentes : 'Sección es null');
  
    if (!seccion || !seccion.componentes) {
      console.error("Sección o componentes no están definidos.");
      return; // Salir de la función si no están definidos
    }
  
    const index = seccion.componentes.indexOf(componente);
    if (index >= 0) {
      // Eliminar el componente
      seccion.componentes.splice(index, 1); 
      
      // Forzar reasignación para que Angular detecte el cambio
      seccion.componentes = [...seccion.componentes];
      this.secciones = [...this.secciones]; 
  
      // Forzar la detección de cambios en el próximo ciclo
      this.cdr.markForCheck(); 
  
      console.log("Componente eliminado, tabla actualizada.");
    } else {
      console.error("No se pudo encontrar el componente para eliminar.");
    }
  }
  
  prepararAgregarComponenteDebajo(seccion: Seccion, componente: Componente) {
    // Encuentra el índice del componente actual
    const index = seccion.componentes.indexOf(componente);

    // Agrega un nuevo componente debajo del componente seleccionado
    if (index >= 0) {
      const nuevoComponente = {
        numero: seccion.componentes.length + 1, // Actualiza el número según el tamaño actual de los componentes
        nombre: "Nuevo componente",
        ponderacion: 0,
      };

      // Agregar el componente en la posición específica
      seccion.componentes.splice(index + 1, 0, nuevoComponente);

      // Forzar la actualización de la vista
      this.secciones = [...this.secciones];
    }
  }

  guardarFormulario() {
    const formularioData = {
      estructura: `Formulario ${this.formularioSeleccionado}`,
      secciones: this.secciones.map((seccion: Seccion) => ({
        nombre: seccion.titulo,
        items: seccion.componentes.map((componente: Componente) => ({
          nombre: componente.nombre,
          porcentaje: componente.ponderacion,
        })),
      })),
    };

    console.log("JSON generado:", formularioData);
  }
}
