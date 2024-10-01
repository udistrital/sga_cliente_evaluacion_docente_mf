import { Component, OnInit, ViewChild } from "@angular/core";
import { ROLES } from "src/app/models/diccionario";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { EvaluacionDocenteService } from "src/app/services/evaluacion-docente-crud.service";
import { ParametrosService } from "src/app/services/parametros.service";

@Component({
  selector: "app-definir-escalas",
  templateUrl: "./definir-escalas.component.html",
  styleUrls: ["./definir-escalas.component.scss"],
})
export class DefinirEscalasComponent implements OnInit {
  tipoEscala: string = "";
  descripcion: string = "";
  escalas: any[] = [];
  tiposInput: any[] = []; // Guardará los tipos de input de la API
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
    Textarea: 4674, // Cambia 'Texto' por 'Textarea'
    Radio: 4668, // 'Selección Múltiple' por 'Radio'
    ArchivoAnexo: 6686, // Mantener 'Cargar Archivos'
    LinkNuxeo: 4672, // 'Descargar Archivos'
  };

  // Columnas de la tabla incluyendo "Estado"
  displayedColumns: string[] = ["Pregunta", "TipoInput", "Estado", "Acciones"];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private evaluacionDocenteService: EvaluacionDocenteService,
    private parametrosService: ParametrosService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarEscalas();
    this.obtenerTiposInput(); // Llama al método para obtener los tipos de input
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
    this.evaluacionDocenteService.get("campo").subscribe(
      (response: any) => {
        this.escalas = response.Data;
  
        // Ordenar primero los activos, luego los inactivos
        this.escalas.sort((a: any, b: any) => {
          if (a.activo === b.activo) {
            // Si ambos tienen el mismo estado, no hacer nada
            return 0;
          }
          // Colocar los activos (true) antes que los inactivos (false)
          return a.activo ? -1 : 1;
        });
  
        this.dataSource = new MatTableDataSource(this.escalas);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error("Error al cargar las escalas", error);
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
      case 'Textarea':
        return 'Texto';
      case 'LinkNuxeo':
        return 'Descargar Archivo';
      case 'ArchivoAnexo':
        return 'Cargar archivo';
      case 'Radio':
        return 'Selección de única respuesta';
      default:
        return 'Desconocido';
    }
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

      // Realizamos el POST para la pregunta base (aplica para cualquier tipo de input)
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
          campo_padre_id: null, // Siempre es null para la pregunta principal
          nombre: nuevaEscala.label, // Escriba su pregunta
          valor: 0,
          activo: true, // Activo por defecto
        })
        .subscribe(
          (response: any) => {
            console.log(
              "POST para la pregunta base realizado con éxito. Respuesta:",
              response
            );
            const campoPadreId = response.Data.Id; // Guardamos el ID del campo padre para opciones (Radio)

            // Si el tipo de campo es Radio, generamos un POST por cada opción
            if (nuevaEscala.tipoCampo === "Radio") {
              console.log(
                "El campo es de tipo 'Radio'. Preparando POST para cada opción..."
              );
              nuevaEscala.opciones.forEach((opcion: string) => {
                console.log("Preparando POST para la opción de Radio:", {
                  tipo_campo_id: tipoCampoId, // Mismo tipo de campo para opciones
                  campo_padre_id: campoPadreId, // Relacionamos con el campo padre (pregunta base)
                  nombre: opcion, // Nombre de la opción
                  valor: 0,
                  activo: true,
                });

                this.evaluacionDocenteService
                  .post("campo", {
                    tipo_campo_id: tipoCampoId, // Mismo tipo de campo para opciones
                    campo_padre_id: campoPadreId, // Relacionamos con el campo padre (pregunta base)
                    nombre: opcion, // Nombre de la opción
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

            // Añadimos la nueva escala al arreglo local para actualizar la vista
            nuevaEscala.TipoCampoId = tipoCampoId;
            nuevaEscala.Nombre = nuevaEscala.label; // Nombre de la pregunta o campo
            this.escalas.push(nuevaEscala);
            this.dataSource.data = this.escalas;

            // Resetear el formulario después de guardar
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
          this.cargarEscalas(); // Actualizar la lista de escalas
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
    const escalaActualizada = { ...escala, activo: nuevoEstado };
  
    // Realizar el PUT para cambiar el estado de la escala
    this.evaluacionDocenteService.put(`campo/${escala.Id}`, escalaActualizada).subscribe(
      (response: any) => {
        console.log(`${nuevoEstado ? "Escala activada" : "Escala inactivada"} con éxito`, response);
  
        // Actualizar la lista de escalas después de cambiar el estado
        this.cargarEscalas();
      },
      (error: any) => {
        console.error("Error al cambiar el estado de la escala", error);
      }
    );
  }
  
}
