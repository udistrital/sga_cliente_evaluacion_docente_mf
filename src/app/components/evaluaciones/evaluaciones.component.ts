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
    private evaluacionDocenteMidService: SgaEvaluacionDocenteMidService
  ) {
    this.heteroForm = this.fb.group({});
    this.coevaluacionIIForm = this.fb.group({});
    this.coevaluacionIForm = this.fb.group({});
    this.autoevaluacionIIForm = this.fb.group({});
    this.autoevaluacionIForm = this.fb.group({});
  }


  ngOnInit(): void {
    console.log("EvaluacionesComponent initialized");
    this.initializeForms();

    // Obtener roles del usuario
    this.userService.getUserRoles().then((roles) => {
      this.userRoles = roles;
      this.dateService.getDateHeader().subscribe(
        (date: string) => {
          this.dateHeader = date;
          console.log('DateHeader:', this.dateHeader);
        },
        (error: any) => console.error('Error al obtener el encabezado de fecha:', error)
      );
      if (this.hasRole([ROLES.ESTUDIANTE])) {
        this.userService.getCodigoEstudiante().then((codigo) => {
          if (codigo != null) {
            this.consultarCargaAcademica(codigo).then((response: any) => {
              this.heteroForm.patchValue({
                estudianteNombre: response.nombre,
                estudianteIdentificacion: response.codigo_estudiante
              });

              this.autoevaluacionIForm.patchValue({
                estudianteNombre: response.nombre,
                estudianteIdentificacion: response.codigo_estudiante
              });

              this.proyectos.opciones = response.proyectos;
            });
          }
        });
      } else if (this.hasRole([ROLES.DOCENTE])) {
        this.userService.getUserDocument().then((documento) => {
          this.consultarEspaciosAcademicos(documento).then((response: any) => {
            this.autoevaluacionIIForm.patchValue({
              docenteIdentificacion: response.identificacion,
              docenteNombre: response.nombre
            });

            this.coevaluacionIForm.patchValue({
              docenteNombre: response.nombre
            });

            this.proyectos.opciones = response.proyectos;
          });
        });
      }
    }).catch(error => console.error('Error al obtener los roles de usuario:', error));
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
      descripcionProceso: ["", Validators.required],
    });

    this.coevaluacionIIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: ["", Validators.required],
    });

    this.coevaluacionIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      grupoSeleccionado: ["", Validators.required],
      descripcionProceso: ["", Validators.required],
    });

    this.autoevaluacionIIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      docenteIdentificacion: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: ["", Validators.required],
    });

    this.autoevaluacionIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      estudianteNombre: ["", Validators.required],
      estudianteIdentificacion: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      proyectoCurricular2: ["", Validators.required],
      descripcionProceso: ["", Validators.required],
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
          Nombre: PROYECTO,
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
            Nombre: DOCENTE
          });
        }

        const asignaturaExistente = proyecto.asignaturas.some((asignatura: any) => asignatura.id === COD_ESPACIO);
        if (!asignaturaExistente) {
          proyecto.asignaturas.push({
            id: COD_ESPACIO,
            Nombre: ESPACIO
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
          Nombre: CARRERA,
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
            id: CODIGO_SIGNATURA,
            Nombre: ASIGNATURA,
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

    if (proyectoSeleccionado) {
      this.docentes.opciones = proyectoSeleccionado.docentes;
      this.espacios.opciones = proyectoSeleccionado.asignaturas;
      this.espacios_academicos = [];
      proyectoSeleccionado.asignaturas.forEach((espacio: any) => {
        this.espacios_academicos.push({
          id: espacio.id,
          nombre: espacio.Nombre,
          grupos: espacio.grupos
        });
      })

      this.openSnackBar(`Proyecto seleccionado: ${proyectoSeleccionado.Nombre}`);
    }
  }

  onEspacioSelection(event: MatSelectChange): void {
    const espacioSeleccionado = event.value;

    if (espacioSeleccionado) {
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

  openSnackBar(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}