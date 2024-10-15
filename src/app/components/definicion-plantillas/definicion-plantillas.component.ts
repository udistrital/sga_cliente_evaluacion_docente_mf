import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { startWith, map } from "rxjs";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { EvaluacionDocenteService } from "src/app/services/evaluacion-docente-crud.service";
import { SgaEvaluacionDocenteMidService } from "src/app/services/sga_evaluacion_docente_mid.service";
import { HttpClient } from "@angular/common/http";

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
  numero?: number;
  item_relacion_campo_id?: {
    campo_id: number;
    nombre: string;
    formularioTitulo: string | null;
    seccionTitulo: string | null;
  };
}

@Component({
  selector: "app-definicion-plantillas",
  templateUrl: "./definicion-plantillas.component.html",
  styleUrls: ["./definicion-plantillas.component.scss"],
})
export class DefinicionPlantillasComponent implements OnInit {
  displayedColumns: string[] = ["numero", "proceso", "fecha", "estado", "ponderacion", "acciones"];
  displayedColumnsComponente: string[] = ["numero", "nombre", "ponderacion", "acciones"];

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
  tituloSeccion: string = "";
  nuevoPorcentaje: number = 0;
  tipoCampos: any[] = [];
  preguntasFiltradas: any[] = [];
  tipoCampoSeleccionado: number = 0;
  preguntaSeleccionada: any;
  preguntaControl = new FormControl();
  secciones: Seccion[] = [];
  formularioSeleccionado: string = "heteroevaluacion";
  seccionSeleccionada: any = null;
  porcentajeInvalido: boolean = false;
  camposCargarEvidencias: any[] = [];
  campoRelacionado: any = null;

  constructor(
    private httpClient: HttpClient,
    private evaluacionDocenteService: EvaluacionDocenteService,
    private sgaEvaluacionDocenteMidService: SgaEvaluacionDocenteMidService,
    private cdr: ChangeDetectorRef
  ) { }

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
          this.tipoCampos = response.Data.map((campo: Campo) => this.mapTipoCampo(campo));

          // Filtrar campos de tipo "carga de evidencias"
          this.camposCargarEvidencias = response.Data.filter(
            (campo: Campo) => campo.TipoCampoId === 6686 // Cargar evidencias
          );
        } else {
          console.error("Error: la respuesta de la API no es un arreglo.", response);
        }
      },
      (error) => {
        console.error("Error al obtener los campos activos:", error);
      }
    );
  }

  onTipoCampoChange() {
    if (this.tipoCampoSeleccionado === 4672) { // Si se selecciona "descargar evidencias"
      this.filtrarPorTipoCargarEvidencias();
    }
  }

  filtrarPorTipoCargarEvidencias() {
    this.campoRelacionado = null; // Reiniciar campo relacionado
  }

  seleccionarCampoRelacionado(campo: any) {
    this.campoRelacionado = campo;
  }

  mapTipoCampo(campo: Campo) {
    const tipos: { [key: number]: string } = {
      4668: "Pregunta de opción múltiple con única respuesta",
      4674: "Pregunta abierta",
      4672: "Botón de descargar archivos",
      6686: "Botón de cargar archivos"
    };
    return {
      TipoCampoId: campo.TipoCampoId,
      label: tipos[campo.TipoCampoId] || "Desconocido",
    };
  }

  filtrarPorTipo() {
    this.evaluacionDocenteService.getCamposActivos().subscribe((response: any) => {
      if (Array.isArray(response.Data)) {
        this.preguntasFiltradas = response.Data.filter(
          (p: Campo) => p.TipoCampoId === this.tipoCampoSeleccionado
        );
      } else {
        console.error("Error: la respuesta de la API no contiene un arreglo en la propiedad Data.", response);
      }
    });
  }

  validarPorcentaje() {
    this.porcentajeInvalido = this.nuevoPorcentaje < 1 || this.nuevoPorcentaje > 100;
  }

  private _filterPreguntas(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.preguntasFiltradas.filter((option) =>
      option.Nombre.toLowerCase().includes(filterValue)
    );
  }

  displayNombre(pregunta: any): string {
    return pregunta?.Nombre || "";
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

    if (this.esComponenteValido()) {
      const nuevoComponente = this.crearNuevoComponente();

      // Relacionar el campo de descarga con el de carga de evidencias si corresponde
      if (this.tipoCampoSeleccionado === 4672 && this.campoRelacionado) {
        nuevoComponente.item_relacion_campo_id = {
          campo_id: this.campoRelacionado.campo_id,
          nombre: this.campoRelacionado.nombre,
          formularioTitulo: this.campoRelacionado.formularioTitulo || null,
          seccionTitulo: this.campoRelacionado.seccionTitulo || null
        };
      }

      this.seccionSeleccionada.componentes.push(nuevoComponente);
      this.seccionSeleccionada.componentes = [...this.seccionSeleccionada.componentes];
      this.secciones = [...this.secciones];
      this.resetComponente();
    } else {
      console.error("El porcentaje debe estar entre 1 y 100 o la pregunta seleccionada no es válida.");
    }
  }

  crearNuevoComponente(): Componente {
    return {
      numero: this.seccionSeleccionada.componentes.length + 1,
      nombre: this.preguntaSeleccionada.Nombre,
      ponderacion: this.nuevoPorcentaje,
      item_relacion_campo_id: this.tipoCampoSeleccionado === 4672 ? this.campoRelacionado : null
    };
  }

  resetComponente() {
    this.nuevoPorcentaje = 0;
    this.preguntaSeleccionada = null;
    this.seccionSeleccionada = null;
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  esComponenteValido(): boolean {
    return this.nuevoPorcentaje > 0 && this.nuevoPorcentaje <= 100 && this.preguntaSeleccionada;
  }

  dropComponentes(event: CdkDragDrop<Componente[]>, seccion: Seccion) {
    moveItemInArray(seccion.componentes, event.previousIndex, event.currentIndex);
    seccion.componentes = [...seccion.componentes];
    this.cdr.detectChanges();
    console.log("Componentes reordenados: ", seccion.componentes);
  }

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
          ponderacion: componente.ponderacion,
          item_relacion_campo_id: componente.item_relacion_campo_id || null,
        })),
      })),
    };

    console.log("Formulario data a enviar:", formularioData);

    this.sgaEvaluacionDocenteMidService.post('formulario', formularioData)
      .subscribe(
        (response) => {
          console.log('Formulario guardado con éxito:', response);
        },
        (error) => {
          console.error('Error al guardar el formulario:', error);
        }
      );
  }
}
