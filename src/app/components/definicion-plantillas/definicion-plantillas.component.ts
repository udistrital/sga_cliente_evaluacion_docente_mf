import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { startWith, map } from "rxjs";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
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

  validarPorcentaje() {
    if (this.nuevoPorcentaje < 1 || this.nuevoPorcentaje > 100) {
      this.porcentajeInvalido = true;
    } else {
      this.porcentajeInvalido = false;
    }
  }

  private _filterPreguntas(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.preguntasFiltradas.filter((option) =>
      option.Nombre.toLowerCase().includes(filterValue)
    );
  }

  displayNombre(pregunta: any): string {
    return pregunta && pregunta.Nombre ? pregunta.Nombre : "";
  }

  mostrarVistaComponente() {
    this.mostrandoVistaComponente = true;
  }

  agregarSeccion() {
    if (this.tituloSeccion.trim()) {
      this.secciones.push({ titulo: this.tituloSeccion, componentes: [] });
      this.tituloSeccion = "";
      this.secciones = [...this.secciones]; // Actualizar vista
    }
  }

  agregarComponente() {
    this.validarPorcentaje();

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

      if (!this.seccionSeleccionada.componentes) {
        this.seccionSeleccionada.componentes = [];
      }

      this.seccionSeleccionada.componentes.push(nuevoComponente);

      this.seccionSeleccionada.componentes = [
        ...this.seccionSeleccionada.componentes,
      ];
      this.secciones = [...this.secciones];

      this.cdr.detectChanges(); // Forzar la detección de cambios

      this.nuevoPorcentaje = 0;
      this.preguntaSeleccionada = null;
      this.seccionSeleccionada = null;
    } else {
      console.error(
        "El porcentaje debe estar entre 1 y 100 o la pregunta seleccionada no es válida."
      );
    }
  }

  dropComponentes(event: CdkDragDrop<Componente[]>, seccion: Seccion) {
    moveItemInArray(
      seccion.componentes,
      event.previousIndex,
      event.currentIndex
    );
    seccion.componentes = [...seccion.componentes];
    this.cdr.detectChanges();
    console.log("Componentes reordenados: ", seccion.componentes);
  }

  // Método para reordenar las secciones
  dropSecciones(event: CdkDragDrop<Seccion[]>) {
    moveItemInArray(this.secciones, event.previousIndex, event.currentIndex);
    this.secciones = [...this.secciones];
    this.cdr.detectChanges();
    console.log("Secciones reordenadas: ", this.secciones);
  }

  cambiarProceso(form: any) {
    this.formularioSeleccionado = form.proceso;
    console.log("Proceso seleccionado:", this.formularioSeleccionado);
  }

  prepararAgregarComponente(seccion: any) {
    this.seccionSeleccionada = seccion;
  }

  eliminarSeccion(index: number) {
    this.secciones.splice(index, 1);
  }

  eliminarComponente(seccion: any, componente: any) {
    const index = seccion.componentes.indexOf(componente);
    if (index >= 0) {
      seccion.componentes.splice(index, 1);
      seccion.componentes = [...seccion.componentes];
      this.secciones = [...this.secciones];
      this.cdr.markForCheck();
    } else {
      console.error("No se pudo encontrar el componente para eliminar.");
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
