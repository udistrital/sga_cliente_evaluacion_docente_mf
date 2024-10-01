import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ROLES } from "src/app/models/diccionario";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { EvaluacionDocenteService } from "src/app/services/evaluacion-docente-crud.service";
import { ParametrosService } from "src/app/services/parametros.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

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

  // Formulario Reactivo
  formularioEscala!: FormGroup;
  showMultipleOptions: boolean = false;

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
    public dialog: MatDialog // Inyectar el servicio de diálogo
  ) {
    
  }

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
  }

  get opciones(): FormArray {
    return this.formularioEscala.get("opciones") as FormArray;
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

  getTipoEscalaNombre(tipoCampo: string): string {
    switch (tipoCampo) {
      case "Textarea":
        return "Texto";
      case "LinkNuxeo":
        return "Descargar Archivo";
      case "ArchivoAnexo":
        return "Cargar archivo";
      case "Radio":
        return "Selección de única respuesta";
      default:
        return "Desconocido";
    }
  }

  // Función para mostrar el diálogo de confirmación
  mostrarConfirmacion(escala: any): void {
    // Realizar un GET para obtener la escala seleccionada
    this.evaluacionDocenteService.get(`campo/${escala.Id}`).subscribe(
      (response: any) => {
        const escalaSeleccionada = response.Data;

        const dialogRef = this.dialog.open(DialogoConfirmacion, {
          width: "300px",
          data: {
            message: `Va a inhabilitar la escala "${escalaSeleccionada.Nombre}", y no podrá recuperarla, ¿está segur@ de hacer esto?`,
            buttonText: { ok: "Inhabilitar", cancel: "Cancelar" },
            escala: escalaSeleccionada,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            // Al confirmar, hacemos el PUT para actualizar el campo "Activo"
            const escalaActualizada = {
              ...escalaSeleccionada,
              Activo: false, // Cambiar a inactivo
              FechaModificacion: new Date().toISOString(), // Fecha de modificación actual
            };

            this.evaluacionDocenteService
              .put(`campo/${escalaSeleccionada.Id}`, escalaActualizada)
              .subscribe(
                (response: any) => {
                  console.log("Escala inactivada con éxito", response);
                  this.cargarEscalas(); // Recargar la lista de escalas
                },
                (error) => {
                  console.error("Error al inactivar la escala", error);
                }
              );
          }
        });
      },
      (error) => {
        console.error("Error al obtener la escala", error);
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

    if (tipoSeleccionado === "Radio") {
      this.showMultipleOptions = true;
      this.opciones.clear();
      this.opciones.push(this.fb.control("Opción 1"));
      this.opciones.push(this.fb.control("Opción 2"));
    } else {
      this.showMultipleOptions = false;
      this.opciones.clear();
    }
  }

  agregarEscala() {
    if (this.formularioEscala.valid) {
      const nuevaEscala = {
        ...this.formularioEscala.value,
        activo: true,
        fechaCreacion: new Date(),
      };

      const tipoCampoId = this.tipoCamposMap[nuevaEscala.tipoCampo];

      if (!tipoCampoId) {
        console.error(
          `No se encontró un ID de tipo de campo para el tipo: ${nuevaEscala.tipoCampo}`
        );
        return;
      }

      console.log("Preparando POST para la pregunta base:", {
        tipo_campo_id: tipoCampoId,
        campo_padre_id: null,
        nombre: nuevaEscala.label,
        valor: 0,
        activo: true,
      });

      this.evaluacionDocenteService
        .post("campo", {
          tipo_campo_id: tipoCampoId,
          campo_padre_id: null, 
          nombre: nuevaEscala.label, 
          valor: 0,
          activo: true, 
        })
        .subscribe(
          (response: any) => {
            console.log(
              "POST para la pregunta base realizado con éxito. Respuesta:",
              response
            );
            const campoPadreId = response.Data.Id;

            
            if (nuevaEscala.tipoCampo === "Radio") {
              console.log(
                "El campo es de tipo 'Radio'. Preparando POST para cada opción..."
              );
              nuevaEscala.opciones.forEach((opcion: string) => {
                console.log("Preparando POST para la opción de Radio:", {
                  tipo_campo_id: tipoCampoId, 
                  campo_padre_id: campoPadreId, 
                  nombre: opcion,
                  valor: 0,
                  activo: true,
                });

                this.evaluacionDocenteService
                  .post("campo", {
                    tipo_campo_id: tipoCampoId, 
                    campo_padre_id: campoPadreId, 
                    nombre: opcion, 
                    valor: 0,
                    activo: true, // Activo por defecto
                  })
                  .subscribe(
                    (respuestaOpcion: any) => {
                      console.log(
                        "POST para la opción de Radio realizado con éxito. Respuesta:",
                        respuestaOpcion
                      );
                    },
                    (error: any) => {
                      console.error(
                        "Error al hacer el POST para la opción de Radio:",
                        error
                      );
                    }
                  );
              });
            }

            nuevaEscala.TipoCampoId = tipoCampoId;
            nuevaEscala.Nombre = nuevaEscala.label;
            this.escalas.push(nuevaEscala);
            this.dataSource.data = this.escalas;

            this.isCreating = false;
            this.formularioEscala.reset();
            this.activeTab = 0;
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
    const nuevaOpcion = this.fb.control("");
    this.opciones.push(nuevaOpcion);
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
    this.escalaSeleccionada = escala;
    this.isViewingScale = true;
    this.activeTab = 2;
  }

  regresarLista() {
    this.isViewingScale = false;
    this.activeTab = 0;
  }

  inactivarEscala(escala: any) {
    console.log("Inactivando escala con Id:", escala.Id);

    if (!escala.Id) {
      console.error("Error: El Id de la escala es undefined o null.");
      return;
    }

    const escalaActualizada = { ...escala, activo: false };

    this.evaluacionDocenteService
      .put(`campo/${escala.Id}`, escalaActualizada)
      .subscribe(
        (response: any) => {
          console.log("Escala inactivada con éxito", response);
          this.cargarEscalas(); 
        },
        (error) => {
          console.error("Error al inactivar la escala", error);
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
    
    // Actualizar la escala con el nuevo estado
    const escalaActualizada = { 
      ...escala, 
      activo: nuevoEstado, 
      FechaModificacion: new Date().toISOString() // Asegúrate de que el formato de fecha sea correcto
    };
  
    // Agregar el log para verificar el cuerpo del PUT
    console.log("Cuerpo del PUT:", escalaActualizada);
  
    // Realizar el PUT para cambiar el estado de la escala
    this.evaluacionDocenteService.put(`campo/${escala.Id}`, escalaActualizada).subscribe(
      (response: any) => {
        console.log(`${nuevoEstado ? "Escala activada" : "Escala inactivada"} con éxito`, response);
        this.cargarEscalas(); // Recargar la lista de escalas
      },
      (error: any) => {
        console.error("Error al inactivar la escala", error);
      }
    );
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
  
