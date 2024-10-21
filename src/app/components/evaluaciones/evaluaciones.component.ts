import { Component, OnInit, Input, SimpleChanges, ViewChild } from "@angular/core";
import { ROLES } from "src/app/models/diccionario";
import { UserService } from "src/app/services/user.service";
import { MatSelectChange } from "@angular/material/select";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { DateService } from 'src/app/services/date.service';
import { ProyectoAcademicoService } from '../../services/proyecto_academico.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { checkContent } from "src/app/utils/verify-response";
import { EspaciosAcademicosService } from '../../services/espacios_academicos.service';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SgaEvaluacionDocenteMidService } from "src/app/services/sga_evaluacion_docente_mid.service";
import { TercerosCrudService } from "src/app/services/terceros-crud.service";
import { TranslateService } from "@ngx-translate/core";
import Swal from "sweetalert2";
import { AcademicaService } from "src/app/services/academica.service";

@Component({
  selector: "app-evaluaciones",
  templateUrl: "./evaluaciones.component.html",
  styleUrls: ["./evaluaciones.component.scss"],
})
export class EvaluacionesComponent implements OnInit {
  showTerms = false;
  selectedEvaluation: string = "";
  showModal = false;
  userRoles: string[] = [];
  ROLES = ROLES;
  heteroForm: FormGroup;
  coevaluacionIIForm: FormGroup;
  coevaluacionIForm: FormGroup;
  autoevaluacionIIForm: FormGroup;
  autoevaluacionIForm: FormGroup;
  dateHeader: string | undefined;
  proyectos: { select: any, opciones: any[] } = { select: undefined, opciones: [] };
  docentes: { select: any, opciones: any[] } = { select: undefined, opciones: [] };
  espacios: { select: any, opciones: any[] } = { select: undefined, opciones: [] };
  facultad = [];
  displayedColumns: string[] = ['nombre', 'codigo', 'estado'];
  espacios_academicos: any[] = [];
  grupos: any[] = [];
  dataSource!: MatTableDataSource<any>;
  tercero!: number;
  terceroEvaluado!: number;
  nombreDocente!: string;
  proyecto!: number;
  nombreProyecto!: string;
  espacio!: string;
  nombreEspacio!: string;
  mostrarEvaluacion: boolean = false;
  
  @Input() formtype: string = '';  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private proyectoAcademicoService: ProyectoAcademicoService,
    private _snackBar: MatSnackBar,
    private espaciosAcademicosService: EspaciosAcademicosService,
    private popUpManager: PopUpManager,
    private dateService: DateService,
    private evaluacionDocenteMidService: SgaEvaluacionDocenteMidService,
    private tercerosService: TercerosCrudService,
    private academicaService: AcademicaService,
    private translate: TranslateService
  ) {
    this.heteroForm = this.fb.group({});
    this.coevaluacionIIForm = this.fb.group({});
    this.coevaluacionIForm = this.fb.group({});
    this.autoevaluacionIIForm = this.fb.group({});
    this.autoevaluacionIForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForms();

    // Obtener roles del usuario
    this.userService.getUserRoles().then((roles) => {
      this.userRoles = roles;
    }).catch(error => console.error('Error al obtener los roles de usuario:', error));

    this.dateService.getDateHeader().subscribe(
      (date: string) => {
        this.dateHeader = date;
        console.log('DateHeader:', this.dateHeader);
      },
      (error: any) => console.error('Error al obtener el encabezado de fecha:', error)
    );

    this.userService.getPersonaId()
      .then(
        (personaId) => {
          this.tercero = personaId;
        }
      ).catch(error => {
        this.tercero = 1;
        console.error('Error:', error.message);
      });
  }

  // Inicializar formularios
  initializeForms(): void {
    this.heteroForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      estudianteNombre: ["", Validators.required],
      estudianteIdentificacion: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: [`Estimado estudiantado: Por favor evalúe formativamente a su docente utilizando el formato dispuesto para ello. Los ítems 01 a 20 de selección múltiple con única respuesta son obligatorios. Puede realizar anotaciones de felicitación o de sugerencias respetuosas en los espacios destinados para tal fin. Utilice como referencia la siguiente escala para medir el grado de desempeño a evaluar:`, 
        Validators.required],
    });

    this.coevaluacionIIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      descripcionProceso: [`Estimado Consejo Curricular: Por favor coevalúe con plan de mejoramiento su desempeño docente utilizando el formato dispuesto para ello. Los ítems PROMEDIO con única respuesta son obligatorios en cada dimensión.`, Validators.required],
    });

    this.coevaluacionIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      grupoSeleccionado: ["", Validators.required],
      descripcionProceso: [`Estimado cuerpo docente y estudiantado: Por favor co-evalúen con compromisos mutuos su desempeño docente y el de sus estudiantes en este espacio curricular utilizando el formato dispuesto para ello. Por favor cargue el acta resultado de este ejercicio de coevaluación.`, Validators.required],
    });

    this.autoevaluacionIIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      docenteIdentificacion: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: [`Estimado cuerpo docente: Por favor autoevalúe con plan de mejoramiento su desempeño docente utilizando el formato dispuesto para ello. Los items 01 a 15 con única respuesta son obligatorios en cada dimensión.`, Validators.required],
    });

    this.autoevaluacionIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      estudianteNombre: ["", Validators.required],
      estudianteIdentificacion: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: [`Estimado estudiantado: Por favor autoevalúe su desempeño como estudiante en este espacio curricular. Los ítems 01 a 05 de selección múltiple con única respuesta son obligatorios. Puede realizar anotaciones de mejoramiento para conseguir sus resultados de aprendizaje en los espacios destinados para tal fin.`, Validators.required],
    });
  }

  // Método para cargar espacios académicos
  async loadEspaciosAcademicos() {
    try {
      const response = await this.cargarEspaciosAcademicos();
      this.dataSource = new MatTableDataSource<any>(this.espacios_academicos);
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      this.popUpManager.showErrorToast('Error al cargar los espacios académicos: ' + error);
    }
  } 

   async cargarEspaciosAcademicos() {
    return new Promise((resolve, reject) => {
      this.espaciosAcademicosService
        .get('espacio-academico?query=espacio_academico_padre,activo:true&limit=0')
        .subscribe(
          (response: any) => {
            this.espacios_academicos = response['Data'];
            resolve(true);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  async consultarCargaAcademica(codigo: string) {
    let parametros = {
      parametros: {
        codigo_estudiante: codigo
      }
    }
    return new Promise((resolve, reject) => {
      this.evaluacionDocenteMidService
        .post('carga_academica', parametros)
        .subscribe(
          (response: any) => {
            if (response.Data != null) {
              resolve({
                codigo_estudiante: response.Data[0].COD_ESTUDIANTE,
                nombre: response.Data[0].ESTUDIANTE,
                proyectos: this.transformarDatosEstudiante(response.Data)
              });
            } else {
              resolve(response);
            }
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  transformarDatosEstudiante(lista: any[]): any[] {
    const proyectosMap = new Map<number, any>();

    lista.forEach((elemento) => {
      const { COD_PROYECTO, DOCENTE, DOC_DOCENTE, PROYECTO, COD_ESPACIO, ESPACIO } = elemento;

      if (!proyectosMap.has(COD_PROYECTO)) {
        proyectosMap.set(COD_PROYECTO, {
          id: COD_PROYECTO,
          nombre: PROYECTO,
          docentes: [],
          asignaturas: []
        });
      }

      const proyecto = proyectosMap.get(COD_PROYECTO);
      if (proyecto) {
        const docenteExistente = proyecto.docentes.some((docente: any) => docente.id === DOC_DOCENTE);
        if (!docenteExistente) {
          proyecto.docentes.push({
            id: DOC_DOCENTE,
            nombre: DOCENTE
          });
        }

        const asignaturaExistente = proyecto.asignaturas.some((asignatura: any) => asignatura.id === String(COD_ESPACIO));
        if (!asignaturaExistente) {
          proyecto.asignaturas.push({
            id: String(COD_ESPACIO),
            nombre: ESPACIO
          });
        }
      }
    });

    return Array.from(proyectosMap.values());
  }

  async consultarEspaciosAcademicos(documento: string) {
    let parametros = {
      parametros: {
        identificacion: documento
      }
    }
    return new Promise((resolve, reject) => {
      this.evaluacionDocenteMidService
        .post('espacios_academicos', parametros)
        .subscribe(
          (response: any) => {
            if (response.Data != null) {
              resolve({
                identificacion: response.Data[0].DOC_DOCENTE,
                nombre: response.Data[0].DOCENTE,
                proyectos: this.transformarDatosDocente(response.Data)
              });
            } else {
              resolve(response);
            }
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  transformarDatosDocente(lista: any[]): any[] {
    const proyectosMap = new Map<number, any>();

    lista.forEach((elemento) => {
      const { CRA_COD, CARRERA, CODIGO_SIGNATURA, ASIGNATURA, ID_GRUPO, GRUPO } = elemento;

      if (!proyectosMap.has(CRA_COD)) {
        proyectosMap.set(CRA_COD, {
          id: CRA_COD,
          nombre: CARRERA,
          asignaturas: []
        });
      }

      const proyecto = proyectosMap.get(CRA_COD);
      if (proyecto) {
        const asignaturaExistente = proyecto.asignaturas.find((asignatura: any) => asignatura.id === CODIGO_SIGNATURA);
        if (asignaturaExistente) {
          const grupoExistente = asignaturaExistente.grupos.some((grupo: any) => grupo.id === ID_GRUPO);
          if (!grupoExistente) {
            asignaturaExistente.grupos.push({
              id: ID_GRUPO,
              nombre: GRUPO
            });
          }
        } else {
          proyecto.asignaturas.push({
            id: String(CODIGO_SIGNATURA),
            nombre: ASIGNATURA,
            grupos: [
              {
                id: ID_GRUPO,
                nombre: GRUPO
              }
            ]
          });
        }
      }
    });

    return Array.from(proyectosMap.values());
  }

  // Método para aplicar filtro en la tabla de espacios académicos
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectForm(formType: string) {
    this.selectedEvaluation = formType;
  }

  // Método que maneja la selección del menú desplegable
  onSelectChange(event: MatSelectChange) {
    this.selectedEvaluation = event.value;
    this.mostrarEvaluacion = false;
    this.consultarDatos();
  }

  consultarDatos() {
    if (this.hasRole([ROLES.ESTUDIANTE])) {
      this.userService.getCodigoEstudiante().then((codigo) => {
        if (codigo != null) {
          this.consultarCargaAcademica(codigo).then((response: any) => {
            if (this.selectedEvaluation == "heteroevaluacion") {
              this.heteroForm.patchValue({
                estudianteNombre: response.nombre,
                estudianteIdentificacion: response.codigo_estudiante,
                inicioFecha: new Date(),
                finFecha: new Date()
              });
            } else if (this.selectedEvaluation == "autoevaluacion_i") {
              this.autoevaluacionIForm.patchValue({
                estudianteNombre: response.nombre,
                estudianteIdentificacion: response.codigo_estudiante,
                inicioFecha: new Date(),
                finFecha: new Date()
              });
            }

            this.proyectos.opciones = response.proyectos;
          });
        }
      });
    } else if (this.hasRole([ROLES.DOCENTE])) {
      this.userService.getUserDocument().then((documento) => {
        this.consultarEspaciosAcademicos(documento).then((response: any) => {
          if (this.selectedEvaluation == "autoevaluacion_ii") {
            this.autoevaluacionIIForm.patchValue({
              docenteIdentificacion: response.identificacion,
              docenteNombre: response.nombre,
              inicioFecha: new Date(),
              finFecha: new Date()
            });
          } else if (this.selectedEvaluation == "coevaluacion_i") {
            this.coevaluacionIForm.patchValue({
              docenteNombre: response.nombre,
              inicioFecha: new Date(),
              finFecha: new Date()
            });
          }

          this.proyectos.opciones = response.proyectos;
        });
      });
    } else if (this.hasRole([ROLES.COORDINADOR])) {
      if (this.selectedEvaluation == "coevaluacion_ii") {
        this.consultarProyectos().then((carreras) => {
          this.coevaluacionIIForm.patchValue({
            inicioFecha: new Date(),
            finFecha: new Date()
          });

          this.proyectos.opciones = carreras;
        });
      }
    }
  }

  // Detecta cambios en el valor de formtype y actualiza el formulario mostrado
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formtype']) {
      this.selectForm(this.formtype);
    }
  }

  onGuardar(formValues?: any): void {
    if (formValues) {
      console.log("Formulario recibido:", formValues);
      if (this.validateForm(formValues)) {
        const formattedValues = {
          ...formValues,
          inicioFecha: moment(formValues.inicioFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
          finFecha: moment(formValues.finFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
        };
        console.log("Datos formateados para envío:", formattedValues);
      } else {
        console.error("El formulario no es válido. Por favor, completa todos los campos requeridos.");
      }
    } else {
      console.error("No se recibieron valores del formulario.");
    }
  }

  validateForm(formValues: any): boolean {
    const requiredFields = [
      "inicioFecha",
      "finFecha",
      "proyectoCurricular",
      "docenteNombre",
      "descripcionProceso",
    ];

    for (const field of requiredFields) {
      if (!formValues[field] || formValues[field].trim() === "") {
        console.error(`El campo ${field} es obligatorio.`);
        return false;
      }
    }

    return true;
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some((role) => this.userRoles.includes(role));
  }

  onProyectoSelection(event: MatSelectChange): void {
    const proyectoSeleccionado = event.value;

    if (this.selectedEvaluation === "coevaluacion_ii") {
      this.consultarDocentesPorProyecto(proyectoSeleccionado.id).then((docentes) => {
        this.docentes.opciones = docentes;
        this.proyecto = proyectoSeleccionado.id;
        this.nombreProyecto = proyectoSeleccionado.nombre;
      });
    } else if (proyectoSeleccionado) {
      this.proyecto = proyectoSeleccionado.id;
      this.nombreProyecto = proyectoSeleccionado.nombre;
      this.docentes.opciones = proyectoSeleccionado.docentes;
      this.espacios.opciones = proyectoSeleccionado.asignaturas;
      this.espacios_academicos = [];
      if (proyectoSeleccionado.asignaturas != null) {
        proyectoSeleccionado.asignaturas.forEach((espacio: any) => {
          this.espacios_academicos.push({
            id: espacio.id,
            nombre: espacio.nombre,
            grupos: espacio.grupos
          });
        });
      }

      this.openSnackBar(`Proyecto seleccionado: ${proyectoSeleccionado.nombre}`);
    }
  }

  onEspacioSelection(event: MatSelectChange): void {
    const espacioSeleccionado = event.value;

    if (Array.isArray(espacioSeleccionado)) {
      var idsEspacios: string = "";
      var nombresEspacios: string = "";
      var grupos: any[] = [];
      espacioSeleccionado.forEach((esp) => {
        idsEspacios += esp.id + ",";
        nombresEspacios += esp.nombre + ",";
        if (Array.isArray(esp.grupos)) {
          grupos.push(...esp.grupos);
        }
      });
      this.espacio = idsEspacios.slice(0, -1);
      this.nombreEspacio = nombresEspacios.slice(0, -1);
    } else if (espacioSeleccionado) {
      this.espacio = espacioSeleccionado.id;
      this.nombreEspacio = espacioSeleccionado.nombre;
      this.grupos = espacioSeleccionado.grupos;
      this.openSnackBar(`Espacio seleccionado: ${espacioSeleccionado.nombre}`);
    }
  }

  loadProyectos(): void {
    this.proyectoAcademicoService.get('proyecto_academico_institucion?query=Activo:true&sortby=Nombre&order=asc&limit=0')
      .subscribe({
        next: (resp) => {
          if (checkContent(resp)) {
            this.proyectos.opciones = resp;
          } else {
            console.error('No se encontraron proyectos');
          }
        },
        error: (err) => {
          console.error('Error al cargar proyectos:', err);
        }
      });
  }

  onDocenteSelection(event: MatSelectChange): void {
    const docenteSeleccionado = event.value;

    this.consultarDocenteTercero(docenteSeleccionado).then(
      (res) => {
        if (res != null) {
          this.terceroEvaluado = res.Id;
          this.nombreDocente = res.NombreCompleto;
        }
      }
    )
  }

  async consultarDocenteTercero(docente: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tercerosService.get('datos_identificacion?query=Numero:' + docente.id + '&fields=TerceroId')
        .subscribe(
          (res: any) => {
            if (res != null && res[0] != null) {
              resolve(res[0]["TerceroId"]);
            } else {
              resolve(this.crearTercero(docente));
            }
          },
          (error: any) => {
            reject(error);
          }
        )
      }
    );
  }

  async crearTercero(docente: any): Promise<any> {
    let nuevoTercero = {
      NombreCompleto: docente.nombre,
      Activo: true,
      TipoContribuyenteId: {
        Id: 2
      }
    }
    return new Promise((resolve, reject) => {
      this.tercerosService.post('tercero', nuevoTercero)
        .subscribe(
          (terceroCreado: any) => {
            if (terceroCreado != null) {
              this.asociarIdentificacionTercero(terceroCreado, docente.id);
              resolve(terceroCreado);
            }
          },
          (error: any) => {
            reject(error);
          }
        );
    });
  }

  async asociarIdentificacionTercero(tercero: any, documento: string): Promise<any> {
    let datosIdentificacion = {
      TipoDocumentoId: {
        Id: 7
      },
      TerceroId: tercero,
      Numero: documento,
      Activo: true
    }
    return new Promise((resolve, reject) => {
      this.tercerosService.post('datos_identificacion', datosIdentificacion)
      .subscribe(
        (res: any) => {
          if (res != null) {
            resolve(res);
          }
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  async consultarProyectos(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.academicaService.get('carreras/PREGRADO')
      .subscribe(
        (res: any) => {
          if (res != null) {
            if (res["carrerasCollection"] != null && res["carrerasCollection"].carrera != null) {
              const carreras = res["carrerasCollection"].carrera.map(({ codigo, nombre }: any) => ({
                id: codigo,
                nombre: codigo + "-" + nombre
              }));
              resolve(carreras);
            } else {
              reject([]);
            }
          }
        },
        (error: any) => {
          reject(error);
        }
      )
    });
  }

  async consultarDocentesPorProyecto(idProyecto: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.academicaService.get('docentes_por_proyecto/' + idProyecto)
      .subscribe(
        (res: any) => {
          if (res != null) {
            if (res["docentesCollection"] != null && res["docentesCollection"].docentes != null) {
              const docentes = res["docentesCollection"].docentes.map(({ identificacion, nombres, apellidos }: any) => ({
                id: identificacion,
                nombre: nombres + " " + apellidos
              }));
              resolve(docentes);
            } else {
              reject([]);
            }
          }
        },
        (error: any) => {
          reject(error);
        }
      )
    });
  }

  continuar(form: FormGroup): void {
    if (form.valid) {
      Swal.fire({
        title: this.translate.instant("GLOBAL.confirmacion"),
        text: this.translate.instant(this.selectedEvaluation + ".mensaje_confirmacion", {
          nombre_proyecto: this.nombreProyecto,
          nombre_docente: this.nombreDocente,
          nombre_asignatura: this.nombreEspacio,
          grupo: this.grupos
        }),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
        cancelButtonText: this.translate.instant("GLOBAL.cancelar"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.mostrarEvaluacion = true;
        }
      });
    } else {
      form.markAllAsTouched();
      this.markInvalidFields(form);
      Swal.fire({
        icon: "error",
        title: this.translate.instant("GLOBAL.formulario_incompleto_titulo"),
        text: this.translate.instant("GLOBAL.formulario_incompleto_descripcion"),
      });
    }
  }

  markInvalidFields(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control?.invalid) {
        console.log(`El campo ${field} es inválido.`);
      }
    });
  }

  openSnackBar(mensaje: string) {
    this._snackBar.open(mensaje, this.translate.instant('GLOBAL.cerrar'), {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
