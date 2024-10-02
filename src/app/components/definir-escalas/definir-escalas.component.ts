import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ROLES } from "src/app/models/diccionario";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { EvaluacionDocenteService } from "src/app/services/evaluacion-docente-crud.service";
import { ParametrosService } from "src/app/services/parametros.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "app-definir-escalas",
  templateUrl: "./definir-escalas.component.html",
  styleUrls: ["./definir-escalas.component.scss"],
})
export class DefinirEscalasComponent implements OnInit {
  tipoEscala = "";
  escalas: any[] = [];
  tiposInput: any[] = [];
  ROLES = ROLES;
  isCreating = false;
  activeTab = 0;
  isViewingScale = false;
  escalaSeleccionada: any = {};
  previsualizacionActiva = false;
  ejemploPregunta = "";
  showMultipleOptions = false;

  valores: number[] = [1, 2, 3, 4, 5];
  opcionesPorDefecto: string[] = [
    "INSUFICIENTE",
    "NECESITA MEJORAR",
    "BUENO",
    "SOBRESALIENTE",
    "EXCELENTE",
  ];

  tipoCamposMap: { [key: string]: number } = {
    Textarea: 4674,
    Radio: 4668,
    ArchivoAnexo: 6686,
    LinkNuxeo: 4672,
  };

  displayedColumns: string[] = ["Pregunta", "TipoEscala", "Estado", "Acciones"];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formularioEscala!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private evaluacionDocenteService: EvaluacionDocenteService,
    private parametrosService: ParametrosService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarEscalas();
    this.obtenerTiposInput();
  }

  inicializarFormulario() {
    this.formularioEscala = this.fb.group({
      label: ["", Validators.required],
      tipoCampo: ["", Validators.required],
      opciones: this.fb.array([]),
    });
    this.agregarOpcionesPorDefecto();
  }

  get opciones(): FormArray {
    return this.formularioEscala.get("opciones") as FormArray;
  }

  agregarOpcionesPorDefecto() {
    this.opcionesPorDefecto.forEach((opcion, index) => {
      this.opciones.push(
        this.fb.group({
          opcion: [opcion, Validators.required],
          valorControl: [
            this.valores[index],
            [Validators.required, Validators.min(1), Validators.max(100)],
          ],
        })
      );
    });
  }

  cargarEscalas() {
    this.evaluacionDocenteService.getCamposActivos().subscribe(
      (response: any) => {
        this.escalas = response.Data || [];
        this.dataSource = new MatTableDataSource(this.escalas);
        this.dataSource.paginator = this.paginator;
      },
      (error) => console.error("Error al cargar las escalas activas", error)
    );
  }

  obtenerTiposInput() {
    const ids = "4668|4674|4672|6686";
    this.parametrosService.get(`parametro?query=id__in:${ids}`).subscribe(
      (response: any) => (this.tiposInput = response.Data),
      (error) => console.error("Error al obtener los tipos de input", error)
    );
  }

  getTipoEscalaNombre(tipoCampoId: number): string {
    const nombres: { [key: number]: string } = {
      4674: "Texto",
      4668: "Selección de única respuesta",
      6686: "Cargar archivo",
      4672: "Descargar archivo",
    };

    return nombres[tipoCampoId] || "Desconocido";
  }

  regresarLista() {
    this.isViewingScale = false;
    this.activeTab = 0;
  }

  mostrarConfirmacion(escala: any): void {
    this.evaluacionDocenteService.get(`campo/${escala.Id}`).subscribe(
      (response: any) => {
        const escalaSeleccionada = response?.Data;
        const dialogRef = this.dialog.open(DialogoConfirmacion, {
          width: "300px",
          data: {
            message: `Va a inhabilitar la escala "${escalaSeleccionada?.Nombre}", ¿está segur@ de hacer esto?`,
            buttonText: { ok: "Inhabilitar", cancel: "Cancelar" },
            escala: escalaSeleccionada,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.inactivarEscala(escalaSeleccionada);
          }
        });
      },
      (error) => console.error("Error al obtener la escala:", error)
    );
  }

  activarModoCreacion() {
    this.isCreating = true;
    this.activeTab = 1;
  }

  onTipoCampoChange(event: any) {
    const tipoSeleccionado = event.value;
    this.showMultipleOptions = tipoSeleccionado === "Radio";
    this.opciones.clear();

    if (this.showMultipleOptions) {
      this.agregarOpcionesPorDefecto();
    }

    this.ejemploPregunta = this.getEjemploPregunta(tipoSeleccionado);
  }

  getEjemploPregunta(tipoSeleccionado: string): string {
    const preguntas: { [key: string]: string } = {
      Radio:
        "Demuestra conocimientos de los contenidos que se van a enseñar en el espacio curricular",
      Textarea:
        "Frente a la heteroevaluación realizada por el estudiante a la persona docente, esta tiene las siguientes observaciones:",
      ArchivoAnexo:
        "El cuerpo docente debe cargar el acta de coevaluación del espacio curricular en este botón:",
      LinkNuxeo: "01 Ámbito 01: Docencia",
    };

    return preguntas[tipoSeleccionado] || "";
  }

  getPlaceholderForOption(index: number): string {
    return this.opcionesPorDefecto[index] || "Opción " + (index + 1);
  }

  agregarEscala() {
    if (this.formularioEscala.valid) {
      const nuevaEscala = {
        ...this.formularioEscala.value,
        activo: true,
        fechaCreacion: new Date(),
      };

      const TipoCampoId = this.tipoCamposMap[nuevaEscala.tipoCampo];

      if (!TipoCampoId) {
        return console.error(
          `No se encontró un ID de tipo de campo para el tipo: ${nuevaEscala.tipoCampo}`
        );
      }

      this.evaluacionDocenteService
        .post("campo", {
          TipoCampoId,
          CampoPadreId: 0,
          Nombre: nuevaEscala.label,
          Valor: 0,
          Activo: true,
        })
        .subscribe(
          (response: any) => {
            const campoPadreId = response.Data.Id;

            if (nuevaEscala.tipoCampo === "Radio") {
              nuevaEscala.opciones.forEach((opcion: any, index: number) => {
                this.evaluacionDocenteService
                  .post("campo", {
                    TipoCampoId,
                    CampoPadreId: campoPadreId,
                    Nombre: opcion.opcion,
                    Valor: opcion.valorControl,
                    Activo: true,
                  })
                  .subscribe();
              });
            }

            this.resetFormulario();
          },
          (error: any) =>
            console.error(
              "Error al hacer el POST para la pregunta base:",
              error
            )
        );
    } else {
      console.error("Formulario no es válido.", this.formularioEscala.value);
    }
  }

  agregarOpcion() {
    this.opciones.push(
      this.fb.group({
        opcion: ["", Validators.required],
        valorControl: [
          1,
          [Validators.required, Validators.min(1), Validators.max(100)],
        ],
      })
    );
    this.cdr.detectChanges();
  }

  quitarOpcion() {
    if (this.opciones.length > 1) {
      this.opciones.removeAt(this.opciones.length - 1);
    }
  }

  cancelarCreacion() {
    this.isCreating = false;
    this.formularioEscala.reset();
    this.activeTab = 0;
  }

  resetFormulario() {
    this.isCreating = false;
    this.formularioEscala.reset();
    this.activeTab = 0;
    this.cargarEscalas();
  }

  vistaGeneral(escala: any) {
    this.escalaSeleccionada = escala;
    this.tipoEscala = this.getTipoEscalaNombre(escala.TipoCampoId);
    this.isViewingScale = true;
    this.activeTab = 2;
  }

  inactivarEscala(escala: any) {
    if (!escala?.Id) {
      return console.error("Error: El Id de la escala es undefined o null.");
    }
  
    const escalaActualizada = {
      Id: escala.Id,
      TipoCampoId: escala.TipoCampoId, 
      CampoPadreId: escala.CampoPadreId, 
      Nombre: escala.Nombre, 
      Valor: escala.Valor, 
      Activo: false,
      FechaCreacion: this.formatFecha(escala.FechaCreacion), 
      FechaModificacion: this.formatFecha(new Date()), 
    };
  
    this.evaluacionDocenteService
      .put(`campo/${escala.Id}`, escalaActualizada)
      .subscribe(
        () => this.cargarEscalas(), 
        (error: any) => console.error("Error al inactivar la escala:", error)
      );
  }

  private formatFecha(fecha: string | Date): string {
    return new Date(fecha).toISOString().split(".")[0] + "Z";
  }

  toggleEstadoEscala(escala: any) {
    if (!escala?.Id) {
      return console.error("El Id de la escala no está definido.");
    }
  
    const nuevoEstado = false;
  
    const escalaActualizada = {
      Id: escala.Id,
      TipoCampoId: escala.TipoCampoId, 
      CampoPadreId: escala.CampoPadreId , 
      Nombre: escala.Nombre , 
      Valor: escala.Valor, 
      Activo: nuevoEstado, 
      FechaCreacion: this.formatFecha(escala.FechaCreacion), 
      FechaModificacion: this.formatFecha(new Date()), 
    };
  
    this.evaluacionDocenteService
      .put(`campo/${escala.Id}`, escalaActualizada)
      .subscribe(
        () => this.cargarEscalas(), 
        (error: any) => console.error("Error al actualizar la escala:", error)
      );
  }

  tabChanged(event: any) {
    if (event.index === 1) {
      this.activarModoCreacion();
    }
  }

  applyFilterEscalas(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  previsualizarEscala() {
    this.previsualizacionActiva = true;
    this.ejemploPregunta =
      this.formularioEscala.get("label")?.value || "Texto de la pregunta";
    this.tipoEscala = this.formularioEscala.get("tipoCampo")?.value;
  }
}

// Definir el diálogo de confirmación directamente dentro del mismo archivo
@Component({
  selector: "dialogo-confirmacion",
  template: `
    <h1 mat-dialog-title>Confirmación</h1>
    <div mat-dialog-content>{{ data.message }}</div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancelClick()">
        {{ data.buttonText.cancel }}
      </button>
      <button mat-button (click)="onConfirmClick()">
        {{ data.buttonText.ok }}
      </button>
    </div>
  `,
})
export class DialogoConfirmacion {
  constructor(
    public dialogRef: MatDialogRef<DialogoConfirmacion>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }
}
