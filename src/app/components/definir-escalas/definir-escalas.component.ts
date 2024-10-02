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
  tipoEscala: string = "";
  descripcion: string = "";
  escalas: any[] = [];
  tiposInput: any[] = [];
  userRoles: string[] = [];
  ROLES = ROLES;
  isCreating: boolean = false;  
  activeTab = 0;
  isViewingScale: boolean = false;
  escalaSeleccionada: any = {};
  exampleQuestion: string = "";
  previsualizacionActiva: boolean = false;
  ejemploPregunta: string = '';

  // Formulario Reactivo
  formularioEscala!: FormGroup;
  showMultipleOptions: boolean = false;

  // Valores por defecto de las opciones
  valores: number[] = [1, 2, 3, 4, 5];

  // Lista de opciones de ejemplo
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

  constructor(
    private fb: FormBuilder,
    private evaluacionDocenteService: EvaluacionDocenteService,
    private parametrosService: ParametrosService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarEscalas();
    this.obtenerTiposInput();

    // Configurar el paginador para mostrar 10 escalas por página por defecto
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = "Escalas por página";
    }
  }

  inicializarFormulario() {
    this.formularioEscala = this.fb.group({
      label: ["", Validators.required],
      tipoCampo: ["", Validators.required],
      opciones: this.fb.array([]), // Inicialización del FormArray vacío
    });

    // Añadir opciones por defecto como FormGroups dentro del FormArray
    this.opcionesPorDefecto.forEach((opcion, index) => {
      this.opciones.push(
        this.fb.group({
          opcion: [opcion, Validators.required], // Campo de la opción
          valorControl: [
            this.valores[index],
            [Validators.required, Validators.min(1), Validators.max(100)],
          ], // Campo del valor
        })
      );
    });
  }

  get opciones(): FormArray {
    return this.formularioEscala.get("opciones") as FormArray;
  }

  // Método para obtener el placeholder para las opciones
  getPlaceholderForOption(index: number): string {
    return this.opcionesPorDefecto[index] || "Opción " + (index + 1);
  }

  cargarEscalas() {
    this.evaluacionDocenteService.getCamposActivos().subscribe(
      (response: any) => {
        this.escalas = response.Data || [];
        this.dataSource = new MatTableDataSource(this.escalas);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error("Error al cargar las escalas activas", error);
      }
    );
  }

  obtenerTiposInput() {
    const ids = "4668|4674|4672|6686";
    this.parametrosService.get(`parametro?query=id__in:${ids}`).subscribe(
      (response: any) => {
        this.tiposInput = response.Data;
      },
      (error) => {
        console.error("Error al obtener los tipos de input", error);
      }
    );
  }

  getTipoEscalaNombre(tipoCampoId: number): string {
    switch (tipoCampoId) {
      case 4674:
        return "Texto";
      case 4668:
        return "Selección de única respuesta";
      case 6686:
        return "Cargar archivo";
      case 4672:
        return "Descargar archivo";
      default:
        return "Desconocido";
    }
  }

  regresarLista() {
    this.isViewingScale = false;
    this.activeTab = 0;
  }

  // Función para mostrar el diálogo de confirmación
  mostrarConfirmacion(escala: any): void {
    console.log("Iniciando confirmación para la escala:", escala);

    this.evaluacionDocenteService.get(`campo/${escala.Id}`).subscribe(
      (response: any) => {
        const escalaSeleccionada = response?.Data;

        const dialogRef = this.dialog.open(DialogoConfirmacion, {
          width: "300px",
          data: {
            message: `Va a inhabilitar la escala "${escalaSeleccionada?.Nombre}", y no podrá recuperarla, ¿está segur@ de hacer esto?`,
            buttonText: { ok: "Inhabilitar", cancel: "Cancelar" },
            escala: escalaSeleccionada,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log("Resultado del diálogo: OK");
            this.inactivarEscala(escalaSeleccionada); // Llamada a inactivarEscala
          } else {
            console.log("Resultado del diálogo: Cancelado");
          }
        });
      },
      (error) => {
        console.error("Error al obtener la escala:", error);
      }
    );
  }

  applyFilterEscalas(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  activarModoCreacion() {
    this.isCreating = true;
    this.activeTab = 1;
  }

  tabChanged(event: any) {
    if (event.index === 1) {
      this.activarModoCreacion();
    }
  }

  onTipoCampoChange(event: any) {
    const tipoSeleccionado = event.value;

    console.log("Tipo de campo seleccionado: ", tipoSeleccionado);

    switch (tipoSeleccionado) {
      case "Radio":
        this.showMultipleOptions = true;
        this.opciones.clear(); // Limpia el FormArray

        // Añadir las opciones de forma correcta, cada una como FormGroup
        this.opciones.push(
          this.fb.group({
            opcion: ["INSUFICIENTE", Validators.required],
            valorControl: [
              1,
              [Validators.required, Validators.min(1), Validators.max(100)],
            ],
          })
        );
        this.opciones.push(
          this.fb.group({
            opcion: ["NECESITA MEJORAR", Validators.required],
            valorControl: [
              2,
              [Validators.required, Validators.min(1), Validators.max(100)],
            ],
          })
        );
        this.opciones.push(
          this.fb.group({
            opcion: ["BUENO", Validators.required],
            valorControl: [
              3,
              [Validators.required, Validators.min(1), Validators.max(100)],
            ],
          })
        );
        this.opciones.push(
          this.fb.group({
            opcion: ["SOBRESALIENTE", Validators.required],
            valorControl: [
              4,
              [Validators.required, Validators.min(1), Validators.max(100)],
            ],
          })
        );
        this.opciones.push(
          this.fb.group({
            opcion: ["EXCELENTE", Validators.required],
            valorControl: [
              5,
              [Validators.required, Validators.min(1), Validators.max(100)],
            ],
          })
        );
        this.exampleQuestion =
          "Demuestra conocimientos de los contenidos que se van a enseñar en el espacio curricular";
        break;
      case "Textarea":
        this.showMultipleOptions = false;
        this.opciones.clear();
        this.exampleQuestion =
          "Frente a la heteroevaluación realizada por el estudiante a la persona docente, esta tiene las siguientes observaciones:";
        break;
      case "ArchivoAnexo":
        this.showMultipleOptions = false;
        this.opciones.clear();
        this.exampleQuestion =
          "El cuerpo docente debe cargar el acta de coevaluación del espacio curricular en este botón:";
        break;
      case "LinkNuxeo":
        this.showMultipleOptions = false;
        this.opciones.clear();
        this.exampleQuestion = "01 Ámbito 01: Docencia";
        break;
      default:
        this.showMultipleOptions = false;
        this.opciones.clear();
        this.exampleQuestion = "";
    }

    console.log(
      "Opciones después del cambio de tipo de campo: ",
      this.opciones.value
    ); // Verifica las opciones después de cambiar el tipo de campo
  }

  agregarEscala() {
    console.log(
      "Formulario al intentar guardar: ",
      this.formularioEscala.value
    );

    if (this.formularioEscala.valid) {
      const nuevaEscala = {
        ...this.formularioEscala.value,
        activo: true,
        fechaCreacion: new Date(),
      };

      const TipoCampoId = this.tipoCamposMap[nuevaEscala.tipoCampo];

      if (!TipoCampoId) {
        console.error(
          `No se encontró un ID de tipo de campo para el tipo: ${nuevaEscala.tipoCampo}`
        );
        return;
      }

      // Realizar el POST para la pregunta base
      this.evaluacionDocenteService
        .post("campo", {
          TipoCampoId: TipoCampoId, // Cambiamos a TipoCampoId
          CampoPadreId: 0, // Para la pregunta base, el CampoPadreId es 0
          Nombre: nuevaEscala.label,
          Valor: 0,
          Activo: true,
        })
        .subscribe(
          (response: any) => {
            console.log(
              "POST para la pregunta base realizado con éxito. Respuesta: ",
              response
            );

            const campoPadreId = response.Data.Id; // Obtener el Id de la pregunta base

            if (nuevaEscala.tipoCampo === "Radio") {
              // Si es de tipo Radio, realizar POST para cada opción
              nuevaEscala.opciones.forEach((opcion: any, index: number) => {
                this.evaluacionDocenteService
                  .post("campo", {
                    TipoCampoId: TipoCampoId, // Mantener el mismo TipoCampoId
                    CampoPadreId: campoPadreId, // El CampoPadreId es el Id de la pregunta base
                    Nombre: opcion.opcion,
                    Valor: opcion.valorControl, // Asignar el valor de la opción
                    Activo: true,
                  })
                  .subscribe(
                    (respuestaOpcion: any) => {
                      console.log(
                        `POST para la opción ${
                          index + 1
                        } de Radio realizado con éxito. Respuesta:`,
                        respuestaOpcion
                      );
                    },
                    (error: any) => {
                      console.error(
                        `Error al hacer el POST para la opción ${
                          index + 1
                        } de Radio:`,
                        error
                      );
                    }
                  );
              });
            }

            // Después de guardar exitosamente, regresa a la lista y recarga las escalas
            this.isCreating = false;
            this.formularioEscala.reset();
            this.activeTab = 0;
            this.cargarEscalas(); // Recargar la lista automáticamente
          },
          (error: any) => {
            console.error(
              "Error al hacer el POST para la pregunta base:",
              error
            );
          }
        );
    } else {
      console.error(
        "Formulario no es válido. Datos del formulario:",
        this.formularioEscala.value
      );
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
    this.cdr.detectChanges(); // Forzar la detección de cambios
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

  vistaGeneral(escala: any) {
    // Asignar la escala seleccionada a la variable para visualizar sus detalles
    this.escalaSeleccionada = escala;

    // Configurar el tipo de escala según el tipo de campo
    switch (escala.TipoCampoId) {
      case this.tipoCamposMap['Textarea']:
        this.tipoEscala = 'Textarea';
        break;
      case this.tipoCamposMap['Radio']:
        this.tipoEscala = 'Radio';
        break;
      case this.tipoCamposMap['ArchivoAnexo']:
        this.tipoEscala = 'ArchivoAnexo';
        break;
      case this.tipoCamposMap['LinkNuxeo']:
        this.tipoEscala = 'LinkNuxeo';
        break;
      default:
        this.tipoEscala = '';
    }
    

    // Cambiar a la pestaña de vista general
    this.isViewingScale = true;
    this.activeTab = 2;
  }

  inactivarEscala(escala: any) {
    console.log(
      "Iniciando proceso de inactivación para la escala con Id:",
      escala?.Id
    );

    if (!escala?.Id) {
      console.error("Error: El Id de la escala es undefined o null.");
      return;
    }

    // Ajustar el formato de las fechas eliminando +0000 y utilizando toISOString
    const escalaActualizada = {
      Id: escala?.Id,
      TipoCampoId: escala?.TipoCampoId || 4668, // Asegúrate de que el TipoCampoId esté presente
      CampoPadreId: escala?.CampoPadreId || 0, // Asegúrate de que CampoPadreId esté presente
      Nombre: escala?.Nombre || "Nombre por defecto", // Verificar el campo Nombre
      Valor: escala?.Valor || 0, // Definir el valor si es necesario
      Activo: false, // Cambiar el estado a inactivo
      FechaCreacion: new Date(escala?.FechaCreacion).toISOString(), // Ajustar el formato de la fecha
      FechaModificacion: new Date().toISOString(), // Actualizar la fecha de modificación en formato limpio
    };

    console.log("Cuerpo del PUT antes de enviar:", escalaActualizada); // Verificar el cuerpo

    // Realizar el PUT
    this.evaluacionDocenteService
      .put(`campo/${escala?.Id}`, escalaActualizada)
      .subscribe(
        (response: any) => {
          console.log("Escala inactivada con éxito:", response);
          this.cargarEscalas(); // Recargar la lista de escalas
        },
        (error) => {
          console.error("Error al inactivar la escala:", error);
        }
      );
  }

  toggleEstadoEscala(escala: any) {
    if (!escala || !escala.Id) {
      console.error("El Id de la escala no está definido.");
      return;
    }

    // Invertir el estado de activo
    const nuevoEstado = !escala.activo;

    // Actualizar la escala con el nuevo estado y las fechas correctas
    const escalaActualizada = {
      ...escala,
      Activo: nuevoEstado,
      FechaModificacion: new Date().toISOString(), // Fecha de modificación actual
      FechaCreacion: escala.FechaCreacion || new Date().toISOString(), // Mantener la fecha de creación
      TipoCampoId: escala.TipoCampoId || 4668, // Asegúrate de que TipoCampoId esté presente y correcto
      CampoPadreId: escala.CampoPadreId || 0, // Si es necesario, asigna el valor correcto a CampoPadreId
      Valor: escala.Valor || 0, // Asegúrate de que el valor esté definido
      Nombre: escala.Nombre || "Nombre por defecto", // Revisa que el nombre esté correctamente definido
    };

    // Agregar log para verificar el cuerpo del PUT antes de enviarlo
    console.log("Cuerpo del PUT a enviar:", escalaActualizada);

    // Realizar el PUT para cambiar el estado de la escala
    this.evaluacionDocenteService
      .put(`campo/${escala.Id}`, escalaActualizada)
      .subscribe(
        (response: any) => {
          console.log(
            `${
              nuevoEstado ? "Escala activada" : "Escala inactivada"
            } con éxito`,
            response
          );
          this.cargarEscalas(); // Recargar la lista de escalas después de actualizar el estado
        },
        (error: any) => {
          console.error("Error al actualizar la escala:", error);
        }
      );
  }


  previsualizarEscala() {
    // Activar la previsualización
    this.previsualizacionActiva = true;

    // Configurar la pregunta de ejemplo según el tipo de campo seleccionado
    switch (this.formularioEscala.get('tipoCampo')?.value) {
      case 'Radio':
        this.tipoEscala = 'Radio';
        this.ejemploPregunta = this.formularioEscala.get('label')?.value || 'Texto de la pregunta';
        break;
      case 'Textarea':
        this.tipoEscala = 'Textarea';
        this.ejemploPregunta = this.formularioEscala.get('label')?.value || 'Texto de la pregunta';
        break;
      case 'ArchivoAnexo':
        this.tipoEscala = 'ArchivoAnexo';
        this.ejemploPregunta = this.formularioEscala.get('label')?.value || 'Texto de la pregunta';
        break;
      case 'LinkNuxeo':
        this.tipoEscala = 'LinkNuxeo';
        this.ejemploPregunta = this.formularioEscala.get('label')?.value || 'Texto de la pregunta';
        break;
      default:
        this.tipoEscala = '';
        this.ejemploPregunta = '';
    }
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
