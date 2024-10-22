import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { startWith, map } from "rxjs";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { EvaluacionDocenteService } from "src/app/services/evaluacion-docente-crud.service";
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
  campo_id?: number;
  item_relacion_id?: number;
}

@Component({
  selector: "app-definicion-plantillas",
  templateUrl: "./definicion-plantillas.component.html",
  styleUrls: ["./definicion-plantillas.component.scss"],
})
export class DefinicionPlantillasComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'proceso', 'fecha', 'estado', 'ponderacion', 'acciones'];
  displayedColumnsComponente: string[] = ["numero", "nombre", "ponderacion", "acciones"];

  formularios: any[] = []; // Almacenar los formularios obtenidos
  secciones: any[] = []; // Almacenar las secciones obtenidas
  tipoCampos: any[] = []; // Almacenar los tipos de campos obtenidos

  formularioSeleccionado: any = null; // Almacenar el formulario seleccionado
  seccionSeleccionadaPrevia: any = null; // Almacenar la sección seleccionada
  tipoCampoSeleccionadoPrevia: number = 0; // Almacenar el tipo de campo seleccionado
  seccionSeleccionada: any = null;
  porcentajeInvalido: boolean = false;

  mostrandoVistaComponente = false;
  tituloSeccion: string = "";
  nuevoPorcentaje: number = 0;
  preguntasFiltradas: any[] = [];
  tipoCampoSeleccionado: number = 0;
  preguntaSeleccionada: any;
  preguntaControl = new FormControl();
  camposCargarEvidencias: any[] = [];
  campoRelacionado: any = null;

  constructor(
    private httpClient: HttpClient,
    private evaluacionDocenteService: EvaluacionDocenteService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.obtenerCamposActivos();
    this.obtenerFormularios();
    this.preguntaControl.valueChanges
      .pipe(
        startWith(""),
        map((value) => this._filterPreguntas(value))
      )
      .subscribe((filtered) => {
        this.preguntasFiltradas = filtered;
      });
  }

  obtenerFormularios() {
    this.evaluacionDocenteService.get('plantilla?limit=0').subscribe(
      (response: any) => {
        if (response && response.Data && response.Data.length > 0) {
          // Asignar solo el primer formulario al array
          this.formularios = [response.Data[0]];
          this.cdr.detectChanges();
        } else {
          console.error("Error al obtener formularios", response);
        }
      },
      (error) => {
        console.error("Error al obtener formularios:", error);
      }
    );
  }  

  // Obtener las secciones según el formulario seleccionado
  obtenerSecciones() {
    if (!this.formularioSeleccionado) return;

    this.evaluacionDocenteService.get(`plantilla?query=EstructuraId:${this.formularioSeleccionado}&sortby=FechaModificacion&order=desc&limit=100`)
      .subscribe(
        (response: any) => {
          if (response && response.Data) {
            this.secciones = response.Data.map((sec: any) => ({
              SeccionId: sec.SeccionId.Id,
              SeccionNombre: sec.SeccionId.Nombre,
            }));
            this.cdr.detectChanges();
          } else {
            console.error("Error al obtener secciones", response);
          }
        },
        (error) => {
          console.error("Error al obtener secciones:", error);
        }
      );
  }

  // Obtener los tipos de input según la sección seleccionada
  obtenerTiposDeInput() {
    if (!this.formularioSeleccionado || !this.seccionSeleccionadaPrevia) return;

    this.evaluacionDocenteService.get(`plantilla?query=SeccionId.Id:${this.seccionSeleccionadaPrevia},EstructuraId:${this.formularioSeleccionado}&sortby=FechaModificacion&order=desc&limit=100`)
      .subscribe(
        (response: any) => {
          if (response && response.Data) {
            this.tipoCampos = response.Data.map((campo: any) => ({
              TipoCampoId: campo.ItemId.Id,
              Nombre: campo.ItemId.Nombre,
            }));
            this.cdr.detectChanges();
          } else {
            console.error("Error al obtener tipos de input", response);
          }
        },
        (error) => {
          console.error("Error al obtener tipos de input:", error);
        }
      );
  }

  // Métodos para corregir los errores

  editarFormulario(form: any) {
    console.log('Editando formulario:', form);
    // Aquí puedes agregar la lógica para editar un formulario
  }

  obtenerCamposPorSeccion() {
    const seccionId = this.seccionSeleccionadaPrevia?.SeccionId;
    const estructuraId = this.formularioSeleccionado?.EstructuraId;

    if (!seccionId || !estructuraId) {
      console.error('No se puede obtener los campos, falta el ID de la sección o el formulario');
      return;
    }

    this.evaluacionDocenteService.get(`plantilla?query=SeccionId.Id:${seccionId},EstructuraId:${estructuraId}&sortby=FechaModificacion&order=desc&limit=100`).subscribe(
      (response: any) => {
        if (response && response.Data) {
          this.tipoCampos = response.Data.map((campo: any) => ({
            TipoCampoId: campo.ItemId.Id,
            label: campo.ItemId.Nombre
          }));
          this.cdr.detectChanges();
        } else {
          console.error("Error: no se pudo obtener campos por sección", response);
        }
      },
      (error) => {
        console.error("Error al obtener campos por sección:", error);
      }
    );
  }

  // Agregar componente anterior
  agregarComponentePrevio() {
    if (!this.formularioSeleccionado || !this.seccionSeleccionadaPrevia || !this.tipoCampoSeleccionadoPrevia) {
      console.error('Formulario, Sección o Tipo de Campo no seleccionado');
      return;
    }

    const nuevoComponente = {
      nombre: `Pregunta del formulario ${this.formularioSeleccionado} en la sección ${this.seccionSeleccionadaPrevia}`,
      campo_id: this.tipoCampoSeleccionadoPrevia
    };

    // Aquí puedes agregar la lógica de cómo quieres manejar este nuevo componente.
    console.log("Nuevo componente agregado:", nuevoComponente);
  }

  // Obtener los campos de "carga de evidencias"
  obtenerCamposCargarEvidencias() {
    this.evaluacionDocenteService.getCamposCargarEvidencias().subscribe(
      (response: any) => {
        if (Array.isArray(response.Data)) {
          this.camposCargarEvidencias = response.Data.map((campo: any) => ({
            campo_id: campo.Id || campo.campo_id,
            nombre: campo.Nombre,
            formularioTitulo: campo.formularioTitulo || 'N/A',
            seccionTitulo: campo.seccionTitulo || 'N/A',
          }));
          this.cdr.detectChanges();
        } else {
          console.error("Error: la respuesta de la API no es un arreglo.", response);
        }
      },
      (error) => {
        console.error("Error al obtener los campos de evidencias:", error);
      }
    );
  }

  // Obtener los campos activos
  obtenerCamposActivos() {
    this.evaluacionDocenteService.getCamposActivos().subscribe(
      (response: any) => {
        if (Array.isArray(response.Data)) {
          this.tipoCampos = response.Data.map((campo: Campo) => this.mapTipoCampo(campo));
        } else {
          console.error("Error: la respuesta de la API no es un arreglo.", response);
        }
      },
      (error) => {
        console.error("Error al obtener los campos activos:", error);
      }
    );
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
      label: tipos[campo.TipoCampoId] || "Desconocido"
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

  // Filtrar preguntas
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

  // Agregar componente relacionado
  agregarComponente() {
    this.validarPorcentaje();

    if (this.esComponenteValido()) {
      const nuevoComponente = this.crearNuevoComponente();

      // Relacionar el campo de descarga con el de carga de evidencias si corresponde
      if (this.tipoCampoSeleccionado === 4672 && this.campoRelacionado) {
        nuevoComponente.item_relacion_id = this.campoRelacionado.campo_id;
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
      numero: this.seccionSeleccionada?.componentes.length + 1,
      nombre: this.preguntaSeleccionada?.Nombre || 'Pregunta',
      ponderacion: this.nuevoPorcentaje,
      campo_id: this.tipoCampoSeleccionado,
      item_relacion_id: this.tipoCampoSeleccionado === 4672 ? this.campoRelacionado?.campo_id : undefined,
    };
  }

  resetComponente() {
    this.nuevoPorcentaje = 0;
    this.preguntaSeleccionada = null;
    this.seccionSeleccionada = null;
    this.cdr.detectChanges();
  }

  validarPorcentaje() {
    this.porcentajeInvalido = this.nuevoPorcentaje < 1 || this.nuevoPorcentaje > 100;
  }

  esComponenteValido(): boolean {
    return this.nuevoPorcentaje > 0 && this.nuevoPorcentaje <= 100 && this.preguntaSeleccionada;
  }

  dropComponentes(event: CdkDragDrop<Componente[]>, seccion: Seccion) {
    moveItemInArray(seccion.componentes, event.previousIndex, event.currentIndex);
    seccion.componentes = [...seccion.componentes];
    this.cdr.detectChanges();
  }

  dropSecciones(event: CdkDragDrop<Seccion[]>) {
    moveItemInArray(this.secciones, event.previousIndex, event.currentIndex);
    this.secciones = [...this.secciones];
    this.cdr.detectChanges();
  }

  cambiarProceso(form: any) {
    this.formularioSeleccionado = form.proceso;
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
    }
  }

  // Guardar formulario con el formato solicitado
  guardarFormulario() {
    const formularioData = {
      estructura: this.formularioSeleccionado,
      proceso_id: 5, // Proceso fijo
      secciones: this.secciones.map((seccion: Seccion, indexSeccion) => ({
        nombre: seccion.titulo,
        orden: indexSeccion + 1,
        items: seccion.componentes.map((componente: Componente, indexItem) => ({
          nombre: componente.nombre,
          orden: indexItem + 1,
          campo_id: componente.campo_id,
          item_relacion_id: componente.item_relacion_id || null,
          porcentaje: componente.ponderacion || null,
        })),
      })),
    };


    // Hacer el POST con el servicio
    this.evaluacionDocenteService.post('formulario_por_tipo', formularioData)
      .subscribe(
        (response) => {
          //console.log('Formulario guardado con éxito:', response);
        },
        (error) => {
          console.error('Error al guardar el formulario:', error);
        }
      );
  }
}
