import { Component, OnInit, Input, SimpleChanges, ViewChild } from "@angular/core";
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
import { ParametrosService } from "src/app/services/parametros.service";
import { environment } from '../../../environments/environment';
import { ROLES, ROLES_HETEROEVALUACION, ROLES_AUTOEVALUACION_UNO, ROLES_AUTOEVALUACION_DOS, ROLES_COEVALUACION_UNO, ROLES_COEVALUACION_DOS } from "src/app/models/diccionario";
import { EvaluacionDocenteService } from "src/app/services/evaluacion-docente-crud.service";
import { OikosService } from "src/app/services/oikos.service";
import { HomologacionDependenciasService } from "src/app/services/homologacion_dependencias.service";
import { firstValueFrom } from 'rxjs';
import { ProcesosService } from "src/app/services/procesos.service";

@Component({
  selector: "app-evaluaciones",
  templateUrl: "./evaluaciones.component.html",
  styleUrls: ["./evaluaciones.component.scss"],
})
export class EvaluacionesComponent implements OnInit {
  showTerms = false;
  selectedEvaluation: string = "";
  selectedEvaluationId: string = "";
  showModal = false;
  userRoles: string[] = [];
  ROLES = ROLES;
  ROLES_HETEROEVALUACION = ROLES_HETEROEVALUACION;
  ROLES_AUTOEVALUACION_UNO = ROLES_AUTOEVALUACION_UNO;
  ROLES_AUTOEVALUACION_DOS = ROLES_AUTOEVALUACION_DOS;
  ROLES_COEVALUACION_UNO = ROLES_COEVALUACION_UNO;
  ROLES_COEVALUACION_DOS = ROLES_COEVALUACION_DOS;
  heteroForm: FormGroup;
  coevaluacionIIForm: FormGroup;
  coevaluacionIForm: FormGroup;
  autoevaluacionIIForm: FormGroup;
  autoevaluacionIIDosForm: FormGroup;
  autoevaluacionIITresForm: FormGroup;
  autoevaluacionIForm: FormGroup;
  dateHeader: string | undefined;
  proyectos: { select: any, opciones: any[] } = { select: undefined, opciones: [] };
  docentes: { select: any, opciones: any[] } = { select: undefined, opciones: [] };
  espacios: { select: any, opciones: any[] } = { select: undefined, opciones: [] };
  facultad = [];
  displayedColumns: string[] = ['nombre', 'codigo', 'estado'];
  espacios_academicos: any[] = [];
  grupos: any[] = [];
  grupo: any = null;
  dataSource!: MatTableDataSource<any>;
  evaluador!: number;
  evaluado!: number;
  nombreDocente!: string;
  proyecto!: number;
  proyectoEspacio!: number;
  nombreProyecto!: string;
  espacio!: string;
  nombreEspacio!: string;
  periodoActual!: number;
  mostrarEvaluacion: boolean = false;
  mostrarReporCoevaII: boolean = false;
  showPdfComponent: boolean = false;
  procesosEvaluacion: any[] = [];
  conversionNombreProceso: { [key: string]: string } = {
    "Heteroevaluación": "heteroevaluacion",
    "Autoevaluación I": "autoevaluacion_i",
    "Coevaluación I": "coevaluacion_i",
    "Autoevaluación II 1": "autoevaluacion_ii",
    "Autoevaluación II 2": "autoevaluacion_ii_dos",
    "Autoevaluación II 3": "autoevaluacion_ii_tres",
    "Coevaluación 2 (Consejo)": "coevaluacion_ii"
  };
  procesosParametro: any = [];

  auxEspaciosHetero: any[] = [];
  fechas: any = null; // Campo para guardar las fechas de inicio y fin para todos los tipos de evaluacion
  formularioHabilitado: boolean = false; // Campo para habilitado e inhanilitar formulario (rango de fechas)
  base64Document!: string;

  //selectedEvaluation: string = ""
  //periodoActual!: number;
  userEmail!: string;
  userDocument!: string;
  fechaFormateada!: string;
  horaFormateada!: string;

  @Input() formtype: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly proyectoAcademicoService: ProyectoAcademicoService,
    private readonly _snackBar: MatSnackBar,
    private readonly espaciosAcademicosService: EspaciosAcademicosService,
    private readonly popUpManager: PopUpManager,
    private readonly dateService: DateService,
    private readonly evaluacionDocenteMidService: SgaEvaluacionDocenteMidService,
    private readonly evaluacionDocenteService: EvaluacionDocenteService,
    private readonly tercerosService: TercerosCrudService,
    private readonly academicaService: AcademicaService,
    private readonly parametrosService: ParametrosService,
    public translate: TranslateService,
    private readonly oikosService: OikosService,
    private readonly homologacionDependenciasService: HomologacionDependenciasService,
    private readonly procesosService: ProcesosService,
  ) {
    this.heteroForm = this.fb.group({});
    this.coevaluacionIIForm = this.fb.group({});
    this.coevaluacionIForm = this.fb.group({});
    this.autoevaluacionIIForm = this.fb.group({});
    this.autoevaluacionIIDosForm = this.fb.group({});
    this.autoevaluacionIITresForm = this.fb.group({});
    this.autoevaluacionIForm = this.fb.group({});
  }

  async ngOnInit(): Promise<void> {
    this.procesosParametro = this.procesosService.getProcesosParametro();
    this.obtenerPeriodoActual();
    this.initializeForms();
    this.consultaIniciaParametrosForm();

    // Obtener roles del usuario
    this.userService.getUserRoles().then((roles) => {
      this.userRoles = roles;
    }).catch(error => console.error('Error al obtener los roles de usuario:', error));

    this.dateService.getDateHeader().subscribe(
      (date: string) => {
        this.dateHeader = date;
      },
      (error: any) => console.error('Error al obtener el encabezado de fecha:', error)
    );

    this.userService.getPersonaId()
      .then(
        (personaId) => {
          this.evaluador = personaId;
        }
      ).catch(error => {
        this.evaluador = 1;
        console.error('Error:', error.message);
      });

    this.userService.getUserEmail()
      .then(
        (userEmail) => {
          this.userEmail = userEmail;
          console.log("userEmail :", userEmail);
        }
      ).catch(error => {
        this.userDocument = "Error obteniendo";
        console.error('Error:', error.message);
      });

    this.userService.getUserDocument()
      .then(
        (userDocument) => {
          this.userDocument = userDocument;
          console.log("userDocument :", userDocument);
        }
      ).catch(error => {
        this.userDocument = "Error obteniendo";
        console.error('Error:', error.message);
      });
  }

  obtenerPeriodoActual(): void {
    let anioActual = new Date().getFullYear().toString();
    this.parametrosService.get('periodo?query=year:' + anioActual + ',activo:true,codigo_abreviacion:PA').subscribe(
      (responsePeriodo: any) => {
        if (responsePeriodo?.Data?.length) {
          this.periodoActual = responsePeriodo.Data[0].Id;
          localStorage.setItem('periodo_actual', JSON.stringify(this.periodoActual));
        } else {
          this.periodoActual = 0;
          localStorage.setItem('periodo_actual', JSON.stringify(this.periodoActual));
          console.error('Error al obtener el periodo actual:', responsePeriodo.Message);
        }
      },
      (error) => {
        this.periodoActual = 0;
        localStorage.setItem('periodo_actual', JSON.stringify(this.periodoActual));
        console.error('Error al obtener el periodo actual:', error);
      }
    );
  }

  // Inicializar formularios
  initializeForms(): void {
    this.heteroForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      estudianteNombre: ["", Validators.required],
      estudianteIdentificacion: ["", Validators.required],
      // proyectoCurricular: ["", Validators.required],
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
      // espacioAcademico: ["", Validators.required],
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

    this.autoevaluacionIIDosForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      docenteIdentificacion: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: [`Estimado cuerpo docente: Por favor autoevalúe con plan de mejoramiento su desempeño docente utilizando el formato dispuesto para ello. Los items 01 a 15 con única respuesta son obligatorios en cada dimensión.`, Validators.required],
    });

    this.autoevaluacionIITresForm = this.fb.group({
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
      // proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: [`Estimado estudiantado: Por favor autoevalúe su desempeño como estudiante en este espacio curricular. Los ítems 01 a 05 de selección múltiple con única respuesta son obligatorios. Puede realizar anotaciones de mejoramiento para conseguir sus resultados de aprendizaje en los espacios destinados para tal fin.`, Validators.required],
    });
  }

  consultaIniciaParametrosForm(): void {
    this.parametrosService.get('parametro?query=tipo_parametro_id:' + environment.TIPO_PARAMETRO_ID.PROCESO_EVALUACION_ID).subscribe(
      (responseParametro: any) => {
        if (responseParametro?.Data?.length) {
          this.procesosEvaluacion = responseParametro.Data
            .filter((item: any) => this.validarRol(item.Nombre))
            .map((item: any) => ({
              Id: item.Id,
              Nombre: item.Nombre
            }));
        } else {
          this.popUpManager.showErrorAlert(`No se encontraron parámetros.`);
        }
      },
      (error) => {
        this.popUpManager.showErrorAlert(`Error al obtener los parámetros.`);
      }
    );
  }

  validarRol(nombreProceso: string): boolean {
    const rolesEvaluacion: { [key: string]: string[] } = {
      'Heteroevaluación': Object.values(this.ROLES_HETEROEVALUACION),
      'Autoevaluación I': Object.values(this.ROLES_AUTOEVALUACION_UNO),
      'Autoevaluación II 1': Object.values(this.ROLES_AUTOEVALUACION_DOS),
      'Autoevaluación II 2': Object.values(this.ROLES_AUTOEVALUACION_DOS),
      'Autoevaluación II 3': Object.values(this.ROLES_AUTOEVALUACION_DOS),
      'Coevaluación I': Object.values(this.ROLES_COEVALUACION_UNO),
      'Coevaluación II': Object.values(this.ROLES_COEVALUACION_DOS)
    };

    return rolesEvaluacion[nombreProceso]?.some(rol => this.hasRole([rol])) ?? false;
  }

  // Método que maneja la selección del menú desplegable
  onSelectChange(event: MatSelectChange) {
    const procesoSeleccionado = this.procesosEvaluacion.find(proceso => proceso.Id === event.value);
    if (procesoSeleccionado) {
      this.selectedEvaluation = procesoSeleccionado.Nombre;
      this.selectedEvaluationId = procesoSeleccionado.Id;
    } else {
      console.log("No selecciono procesoSeleccionado.")
    }
    this.mostrarEvaluacion = false;
    this.getFechas(this.selectedEvaluationId);
  }


  async consultarDatos() {
    const selectedId = String(this.selectedEvaluationId);
    if (this.procesosParametro.ESTUDIANTE.includes(selectedId)) {
      await this.consultarDatosEstudiante();
    } else if (this.procesosParametro.DOCENTE.includes(selectedId)) {
      await this.consultarDatosDocente();
    } else if (this.procesosParametro.CONCEJO.includes(selectedId)) {
      await this.consultarDatosCoordinadorODecano();
    }
  }

  private async consultarDatosEstudiante() {
    try {
      const documento = await this.userService.getUserDocument();
      if (!documento) return;

      const response: any = await this.consultarCargaAcademica(documento);
      this.evaluador = response.cod_estudiante;
      this.proyecto = response.proyectos[0].id;
      this.proyectos.opciones = response.proyectosEspc;
      const espacios = this.mapearEspacios(response.proyectosEspc);
      this.espacios.opciones = espacios;
      this.auxEspaciosHetero = espacios;

      switch (this.selectedEvaluation) {
        case "Heteroevaluación":
          this.configurarFormularioHeteroevaluacion(response);
          break;
        case "Autoevaluación I":
          this.evaluado = response.cod_estudiante;
          this.configurarFormularioAutoevaluacionI(response);
          break;
      }
    } catch (error) {
      console.error("Error al consultar datos del estudiante:", error);
    }
  }

  private async consultarDatosDocente() {
    try {
      const documento = await this.userService.getUserDocument();
      const response: any = await this.consultarEspaciosAcademicos(documento);
      localStorage.setItem('evaluacion_docente', JSON.stringify(response));
      this.evaluador = response.identificacion;
      this.evaluado = response.identificacion;
      this.proyectos.opciones = response.proyectos;
      switch (this.selectedEvaluation) {
        case "Autoevaluación II 1":
          this.configurarFormularioAutoevaluacionII(this.autoevaluacionIIForm, response);
          break;
        case "Autoevaluación II 2":
          this.configurarFormularioAutoevaluacionII(this.autoevaluacionIIDosForm, response);
          break;
        case "Autoevaluación II 3":
          this.configurarFormularioAutoevaluacionII(this.autoevaluacionIITresForm, response);
          break;
        case "Coevaluación I":
          this.proyectos.opciones = response.proyectosCoevI;
          this.configurarFormularioCoevaluacionI(response);
          break;
      }
    } catch (error) {
      console.error("Error al consultar datos del docente:", error);
    }
  }

  private async consultarDatosCoordinadorODecano() {
    if (this.selectedEvaluation !== "Coevaluación II") return;
    this.configurarFechas(this.coevaluacionIIForm);

    try {
      const documento = await this.userService.getUserDocument();
      this.evaluador = Number(documento);

      if (this.hasRole([ROLES.COORDINADOR])) {
        const carreras = await this.consultarProyectos(documento);
        this.proyectos.opciones = carreras;
      } else if (this.hasRole([ROLES.DECANO])) {
        const personaId = documento;
        // consultamos decano con la cedula
        const url = `decano/${personaId}`;
        const responseFacultad: any = await firstValueFrom(this.academicaService.get(url));
        if (responseFacultad) {
          let id_gedep = responseFacultad.facultad.decano[0].codigo_facultad;
          // se homologa dependencia "facultad"
          const url2 = `facultad_oikos_gedep/${id_gedep}`;
          const responseHomologacion: any = await firstValueFrom(this.homologacionDependenciasService.get(url2));
          if (responseHomologacion) {
            let id_oikos = responseHomologacion.homologacion.id_oikos;
            // se obtienen proyectos curriculares desde oikos
            const url3 = `proyecto_curricular/get_all_proyectos_by_facultad_id/${id_oikos}`;
            const responseProyectos = await firstValueFrom(this.oikosService.get(url3));
            this.proyectos.opciones = responseProyectos.Body[0].Opciones.map(({ Id, Nombre }: any) => ({
              id: Id,
              nombre: Id + "-" + Nombre
            }));
          }
        }
      }
    } catch (error) {
      this.evaluador = 1;
      console.error("Error al consultar datos del coordinador o decano:", error);
    }
  }

  private mapearEspacios(proyectosEspc: any[]): any[] {
    const espaciosMap = new Map<string, any>();

    proyectosEspc.forEach((proyecto: any) => {
      const proyectoId = proyecto.id;
      const proyectoNombre = proyecto.nombre;
      const docentesProyecto = proyecto.docentes || [];

      proyecto.asignaturas?.forEach((asignatura: any) => {
        const key = `${proyectoId}-${asignatura.id}`;
        const docente = docentesProyecto.find((d: any) => d.id === asignatura.docente);
        if (!espaciosMap.has(key)) {
          espaciosMap.set(key, {
            id: asignatura.id,
            nombre: asignatura.nombre,
            id_grupo: asignatura.id_grupo,
            grupos: asignatura.grupos,
            proyectoId,
            proyectoNombre,
            docentes: docente ? [docente] : []
          });
        } else {
          const espacio = espaciosMap.get(key);
          if (docente && !espacio.docentes.some((d: any) => d.id === docente.id)) {
            espacio.docentes.push(docente);
          }
        }
      });
    });

    return Array.from(espaciosMap.values());
  }

  private configurarFechas(formulario: FormGroup) {
    formulario.patchValue({
      inicioFecha: this.convertirFechaSinZonaHoraria(this.fechas[this.selectedEvaluationId].fechaInicio),
      finFecha: this.convertirFechaSinZonaHoraria(this.fechas[this.selectedEvaluationId].fechaFin),
    });
  }

  private configurarFormularioHeteroevaluacion(response: any) {
    this.heteroForm.patchValue({
      estudianteNombre: response.nombre,
      estudianteIdentificacion: response.identificacion,
      inicioFecha: this.convertirFechaSinZonaHoraria(this.fechas[this.selectedEvaluationId].fechaInicio),
      finFecha: this.convertirFechaSinZonaHoraria(this.fechas[this.selectedEvaluationId].fechaFin),
    });
  }

  private configurarFormularioAutoevaluacionI(response: any) {
    this.autoevaluacionIForm.patchValue({
      estudianteNombre: response.nombre,
      estudianteIdentificacion: response.identificacion,
      inicioFecha: this.convertirFechaSinZonaHoraria(this.fechas[this.selectedEvaluationId].fechaInicio),
      finFecha: this.convertirFechaSinZonaHoraria(this.fechas[this.selectedEvaluationId].fechaFin),
    });
  }

  private configurarFormularioAutoevaluacionII(formulario: FormGroup, response: any) {
    formulario.patchValue({
      docenteIdentificacion: response.identificacion,
      docenteNombre: response.nombre,
      inicioFecha: this.convertirFechaSinZonaHoraria(this.fechas[this.selectedEvaluationId].fechaInicio),
      finFecha: this.convertirFechaSinZonaHoraria(this.fechas[this.selectedEvaluationId].fechaFin),
    });
  }

  private configurarFormularioCoevaluacionI(response: any) {
    this.coevaluacionIForm.patchValue({
      docenteNombre: response.nombre,
      inicioFecha: this.convertirFechaSinZonaHoraria(this.fechas[this.selectedEvaluationId].fechaInicio),
      finFecha: this.convertirFechaSinZonaHoraria(this.fechas[this.selectedEvaluationId].fechaFin),
    });
  }

  // Método para cargar espacios académicos
  async loadEspaciosAcademicos() {
    try {
      await this.cargarEspaciosAcademicos();
      this.dataSource = new MatTableDataSource<any>(this.espacios_academicos);
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      this.popUpManager.showErrorToast(`${error}` || 'Error desconocido al cargar los espacios académicos.');
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
            reject(new Error(`Error al obtener espacios académicos: ${error?.message || error}`));
          }
        );
    });
  }

  async consultarCargaAcademica(documento: string) {
    let parametros = {
      parametros: {
        identificacion: documento
      }
    }
    let storedConsultaEstudiante = localStorage.getItem('data_evaluacion_estudiante');
    if (storedConsultaEstudiante !== null) {
      const dataParsed = JSON.parse(storedConsultaEstudiante);
      return {
        cod_estudiante: dataParsed.Data.estudiante.espacios[0].cod_estudiante, //Valor necesario para el evaluador
        identificacion: dataParsed.Data.estudiante.espacios[0].doc_estudiante,
        nombre: dataParsed.Data.estudiante.espacios[0].nom_estudiante,
        proyectos: this.transformarDatosEstudiante(dataParsed.Data.estudiante.espacios),
        proyectosEspc: this.transformarDatosEstudianteEsp(dataParsed.Data.estudiante.espacios)
      };
    }
    else {
      return new Promise((resolve, reject) => {
        this.evaluacionDocenteMidService
          .post('carga_academica', parametros)
          .subscribe(
            (response: any) => {
              if (response.Data != null) {
                localStorage.setItem('data_evaluacion_estudiante', JSON.stringify(response));
                resolve({
                  cod_estudiante: response.Data.estudiante.espacios[0].cod_estudiante, //Valor necesario para el evaluador
                  identificacion: response.Data.estudiante.espacios[0].doc_estudiante,
                  nombre: response.Data.estudiante.espacios[0].nom_estudiante,
                  proyectos: this.transformarDatosEstudiante(response.Data.estudiante.espacios),
                  proyectosEspc: this.transformarDatosEstudianteEsp(response.Data.estudiante.espacios)
                });
              } else {
                resolve(response);
              }
            },
            (error) => {
              reject(new Error(`Error al consultar la carga academica: ${error?.message || error}`));
            }
          );
      });
    }
  }

  transformarDatosEstudiante(lista: any[]): any[] {
    const proyectosMap = new Map<number, any>();

    lista.forEach((elemento) => {

      const { cod_proyecto, nom_docente, doc_docente, nom_proyecto, cod_espacio, espacio_academico, grupo } = elemento;

      if (!proyectosMap.has(cod_proyecto)) {
        proyectosMap.set(cod_proyecto, {
          id: cod_proyecto,
          nombre: nom_proyecto,
          docentes: [],
          asignaturas: []
        });
      }

      const proyecto = proyectosMap.get(cod_proyecto);
      if (proyecto) {
        const docenteExistente = proyecto.docentes.some((docente: any) => docente.id === doc_docente);
        if (!docenteExistente) {
          proyecto.docentes.push({
            id: doc_docente,
            nombre: nom_docente
          });
        }

        const asignaturaExistente = proyecto.asignaturas.some((asignatura: any) => asignatura.id === String(cod_espacio));
        if (!asignaturaExistente) {
          proyecto.asignaturas.push({
            id: String(cod_espacio),
            nombre: espacio_academico,
            grupos: grupo,
            docente: doc_docente
          });
        }
      }
    });

    return Array.from(proyectosMap.values());
  }

  transformarDatosEstudianteEsp(lista: any[]): any[] {
    const proyectosMap = new Map<number, any>();

    lista.forEach((elemento) => {

      const { nom_docente, doc_docente, proyecto, cod_espacio, espacio_academico, grupo, cra_curso, id_grupo } = elemento;

      if (!proyectosMap.has(cra_curso)) {
        proyectosMap.set(cra_curso, {
          id: cra_curso,
          nombre: proyecto,
          docentes: [],
          asignaturas: []
        });
      }

      const proyectoGeneral = proyectosMap.get(cra_curso);
      if (proyectoGeneral) {
        const docenteExistente = proyectoGeneral.docentes.some((docente: any) => docente.id === doc_docente);
        if (!docenteExistente) {
          proyectoGeneral.docentes.push({
            id: doc_docente,
            nombre: nom_docente
          });
        }

        const asignaturaExistente = proyectoGeneral.asignaturas.some((asignatura: any) => asignatura.id === String(cod_espacio));
        if (!asignaturaExistente) {
          proyectoGeneral.asignaturas.push({
            id: String(cod_espacio),
            nombre: espacio_academico,
            id_grupo,
            grupos: grupo,
            docente: doc_docente
          });
        }
      }
    });

    return Array.from(proyectosMap.values());
  }


  filtrarEspaciosPorProyecto(data: any, codProyecto: Number) {
    const espaciosMap = new Map<string, any>();

    for (let i = 0; i < data.docente.carga.length; i++) {
      let item = data.docente.carga[i];

      if (item.cod_proyecto == codProyecto) {
        let clave = item.cod_proyecto + "-" + item.cod_espacio + "-" + item.espacio;

        if (!espaciosMap.has(clave)) {
          // Crear la estructura base con los grupos en un array
          espaciosMap.set(clave, {
            id: item.cod_espacio,
            nombre: item.espacio,
            grupos: []
          });
        }

        // Obtener la referencia del objeto en el mapa y agregar el grupo si aún no está
        let entry = espaciosMap.get(clave);
        if (!entry.grupos.some((g: any) => g.id_grupo === item.id_grupo)) {
          entry.grupos.push({
            id_grupo: item.id_grupo,
            grupo: item.grupo
          });
        }
      }
    }

    return Array.from(espaciosMap.values());
  }

  /* -- -- INICIO FORMULARIO DE AUTOEVALUACION II -- -- */

  async consultarEspaciosAcademicos(documento: string) {
    let parametros = {
      parametros: {
        identificacion: documento
      }
    }
    let storedConsultaEspaciosAcademicos = localStorage.getItem('data_consulta_espacios_academicos');
    if (storedConsultaEspaciosAcademicos !== null) {
      const dataParsed = JSON.parse(storedConsultaEspaciosAcademicos);
      return {
        identificacion: dataParsed.Data.docente.carga[0].doc_docente,
        nombre: dataParsed.Data.docente.carga[0].docente,
        proyectos: this.transformarDatosDocente(dataParsed.Data.docente.carga),
        proyectosCoevI: this.transformarDatosDocenteCoevI(dataParsed.Data.docente.carga)
      };
    }
    else {
      return new Promise((resolve, reject) => {
        this.evaluacionDocenteMidService
          .post('espacios_academicos', parametros)
          .subscribe(
            (response: any) => {
              if (response.Data != null) {
                localStorage.setItem('data_consulta_espacios_academicos', JSON.stringify(response));
                resolve({
                  identificacion: response.Data.docente.carga[0].doc_docente,
                  nombre: response.Data.docente.carga[0].docente,
                  proyectos: this.transformarDatosDocente(response.Data.docente.carga),
                  proyectosCoevI: this.transformarDatosDocenteCoevI(response.Data.docente.carga)
                });
              } else {
                resolve(response);
              }
            },
            (error) => {
              reject(new Error(`Error al consultar los espacios académicos: ${error?.message || error}`));
            }
          );
      });
    }
  }

  transformarDatosDocente(lista: any[]): any[] {
    const proyectosMap = new Map<number, any>();

    lista.forEach((elemento) => {
      const { cod_proyecto, proyecto, cod_espacio, espacio, id_grupo, grupo } = elemento;

      if (!proyectosMap.has(cod_proyecto
      )) {
        proyectosMap.set(cod_proyecto
          , {
            id: cod_proyecto,
            nombre: proyecto,
            asignaturas: []
          });
      }

      const proy = proyectosMap.get(cod_proyecto);
      if (proy) {
        const asignaturaExistente = proy.asignaturas.find((asignatura: any) => asignatura.nombre === espacio);
        if (asignaturaExistente) {
          const grupoExistente = asignaturaExistente.grupos.some((grupo: any) => grupo.id_grupo === id_grupo);
          if (!grupoExistente) {
            asignaturaExistente.grupos.push({
              id_grupo: id_grupo,
              grupo: grupo
            });
          }
        } else {
          proy.asignaturas.push({
            id: String(cod_espacio),
            nombre: espacio,
            grupos: [
              {
                id_grupo: id_grupo,
                grupo: grupo
              }
            ]
          });
        }
      }
    });

    return Array.from(proyectosMap.values());
  }

  /* -- -- FIN FORMULARIO DE AUTOEVALUACION II -- -- */

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

  // Tranformar fechas para obtener las fechas por Id del tipo de evaluación
  // Ejemplo: [ 1234: { fechainicio: '2021-01-01', fechafin: '2021-01-15' }... ]
  transformarFechas = (arr: any[]) => {
    return arr.reduce((acc, item) => {
      acc[item.ProcesoId] = {
        fechaInicio: item.FechaInicio,
        fechaFin: item.FechaFin,
      };
      return acc;
    }, {} as Record<number, { fechainicio: string; fechafin: string }>);
  };

  // Petición para obtener fechas de inicio y fin de los procesos de evaluación
  getFechas(idEvaluacion: string) {
    this.evaluacionDocenteService
      .get(`proceso_parametro?query=ProcesoId:${idEvaluacion}`)
      .subscribe(
        (response: any) => {
          if (response.Data != null) {
            this.fechas = this.transformarFechas(response.Data);
            const fechaInicio = new Date(this.convertirFechaSinZonaHoraria(this.fechas[idEvaluacion].fechaInicio));
            const fechaFin = new Date(this.convertirFechaSinZonaHoraria(this.fechas[idEvaluacion].fechaFin));
            this.validarFechas(fechaInicio, fechaFin);
          }
        },
        (error) => {
          this.popUpManager.showErrorToast('Error al obtener las fechas del proceso seleccionado.');
        }
      );
  }

  // Validr las fechas, habilitar formulario y consultar datos iniciales
  // o mostrar mensaje de error si la fecha actual no está en el rango
  validarFechas(fechaInicio: Date, fechaFin: Date) {
    const fechaActual = new Date();

    this.fechaFormateada = this.formatearFecha(fechaActual);
    this.horaFormateada = this.formatearHora(fechaActual);

    fechaActual.setHours(0, 0, 0, 0);
    if (fechaActual >= fechaInicio && fechaActual <= fechaFin) {
      this.formularioHabilitado = true;
      this.consultarDatos();
    } else {
      this.formularioHabilitado = false;
      Swal.fire({
        icon: "error",
        title: this.translate.instant("GLOBAL.error"),
        text: this.translate.instant("asignacion_fechas.fuera_rango"),
      });
    }
  }

  formatearFecha(fecha: Date): string {
    const dia = fecha.getDate();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
    const anio = fecha.getFullYear();

    return `${dia} del mes ${mes} de ${anio}`;
  }

  formatearHora(fecha: Date): string {
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'pm' : 'am';

    horas = horas % 12;
    horas = horas ? horas : 12; 

    return `${horas}:${minutos} ${ampm}`;
  }

  convertirFechaSinZonaHoraria(fechaString: string): Date {
    const partes = fechaString.split(/[- :]/);
    return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]), Number(partes[3]), Number(partes[4]), Number(partes[5]));
  }

  // Detecta cambios en el valor de formtype y actualiza el formulario mostrado
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formtype']) {
      this.selectForm(this.formtype);
    }
  }

  onGuardar(formValues?: any): void {
    if (formValues) {
      if (this.validateForm(formValues)) {
        const formattedValues = {
          ...formValues,
          inicioFecha: moment(formValues.inicioFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
          finFecha: moment(formValues.finFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
        };
        console.log('Valores formateados:', formattedValues);
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

    if (this.selectedEvaluation === "Coevaluación II") {
      this.consultarDocentesPorProyecto(proyectoSeleccionado.id).then((docentes) => {
        this.docentes.opciones = docentes;
        this.proyecto = proyectoSeleccionado.id;
        this.nombreProyecto = proyectoSeleccionado.nombre;
      });
    } else if (proyectoSeleccionado) {
      this.proyectoEspacio = proyectoSeleccionado.id;
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
            grupos: espacio.grupos,
            docente: espacio.docente
          });
        });
      }

      this.grupos = [];

      this.openSnackBar(`Proyecto seleccionado: ${proyectoSeleccionado.nombre}`);
    }

    this.mostrarEvaluacion = false;
  }

  // --------------------- INICIO HETEROEVALUACION ---------------------
  onProyectoHetero(event: MatSelectChange): void {
    const proyectoSeleccionado = event.value;

    // Limpiar grupos y espacios
    this.grupos = [];
    this.espacios.opciones = [];

    // Asignar valores
    this.proyectoEspacio = proyectoSeleccionado.id;
    this.nombreProyecto = proyectoSeleccionado.nombre;
    this.docentes.opciones = proyectoSeleccionado.docentes;
    this.auxEspaciosHetero = proyectoSeleccionado.asignaturas; // Auxiliar de asignaturas del estudiante
    this.openSnackBar(`Proyecto seleccionado: ${proyectoSeleccionado.nombre}`);
    this.mostrarEvaluacion = false;
  }

  onDocenteHetero(event: MatSelectChange): void {
    const docenteSeleccionado = event.value;
    this.evaluado = docenteSeleccionado.id;
    this.nombreDocente = docenteSeleccionado.nombre;
    this.mostrarEvaluacion = false;
  }

  onEspacioHetero(event: MatSelectChange): void {
    const espacioSeleccionado = event.value;
    this.espacio = espacioSeleccionado.id;
    this.nombreEspacio = espacioSeleccionado.nombre;
    this.proyectoEspacio = espacioSeleccionado.proyectoId;
    this.grupo = {
      id_grupo: espacioSeleccionado.id_grupo,
      grupo: espacioSeleccionado.grupos
    };
    const docentesAsociados = espacioSeleccionado.docentes || [];
    this.docentes.opciones = docentesAsociados;
    this.openSnackBar(`Espacio seleccionado: ${espacioSeleccionado.nombre}`);
    this.mostrarEvaluacion = false;
  }
  // --------------------- FIN HETEROEVALUACION ---------------------



  // ---------------------- INICIO AUTOEVALUACION I ----------------------
  onProyectoAutI(event: MatSelectChange): void {
    const proyectoSeleccionado = event.value;

    // Limpiar grupos y espacios
    this.grupos = [];
    this.espacios.opciones = [];

    // Asignar valores
    this.proyectoEspacio = proyectoSeleccionado.id;
    this.nombreProyecto = proyectoSeleccionado.nombre;
    this.docentes.opciones = proyectoSeleccionado.docentes;
    this.espacios.opciones = proyectoSeleccionado.asignaturas; // Auxiliar de asignaturas del estudiante
    this.openSnackBar(`Proyecto seleccionado: ${proyectoSeleccionado.nombre}`);
    this.mostrarEvaluacion = false;
  }

  onEspacioAutI(event: MatSelectChange): void {
    const espacioSeleccionado = event.value;

    // Limpiar grupos
    this.grupos = [];

    // Asignar valores
    this.espacio = espacioSeleccionado.id;
    this.proyectoEspacio = espacioSeleccionado.proyectoId;
    this.nombreEspacio = espacioSeleccionado.nombre;
    this.grupo = { id_grupo: espacioSeleccionado.id_grupo, grupo: espacioSeleccionado.grupos };
    // this.evaluado = espacioSeleccionado.docente;
    this.openSnackBar(`Espacio seleccionado: ${espacioSeleccionado.nombre}`);
    this.mostrarEvaluacion = false;
  }
  // ---------------------- FIN AUTOEVALUACION I ----------------------

  onEspacioSelection(event: MatSelectChange): void {
    this.grupos = [];
    const espacioSeleccionado = event.value;

    if (Array.isArray(espacioSeleccionado)) {
      let idsEspacios: string = "";
      let nombresEspacios: string = "";
      let grupos: any[] = [];
      espacioSeleccionado.forEach((esp) => {
        idsEspacios += esp.id + ",";
        nombresEspacios += esp.nombre + ",";
        if (Array.isArray(esp.grupos)) {
          this.grupos.push(...esp.grupos);
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

    this.mostrarEvaluacion = false;
  }

  onGrupoSelection(event: MatSelectChange): void {
    this.grupo = event.value;
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

    let parametros = {
      parametros: {
        identificacion: docenteSeleccionado.id
      }
    }
    this.evaluacionDocenteMidService
      .post('espacios_academicos', parametros)
      .subscribe({
        next: (response) => {
          if (response.Data != null) {
            let espaciosUnicos
            espaciosUnicos = this.filtrarEspaciosPorProyecto(response.Data, this.proyecto);
            this.espacios.opciones = espaciosUnicos;
          }
        },
        error: (err) => {
          console.error('Error al cargar proyectos:', err);
        }
      }
      );

    this.espacios.opciones = this.espacios_academicos.filter((espacio) => espacio.docente === docenteSeleccionado.id);

    this.consultarTercero(docenteSeleccionado).then(
      (res) => {
        if (res != null) {
          this.evaluado = res.Id;
          this.nombreDocente = res.NombreCompleto;

          this.mostrarEvaluacion = false;
        }
      }
    )
  }

  async consultarTercero(docente: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tercerosService.get('datos_identificacion?query=Numero:' + docente.id + '&fields=TerceroId')
        .subscribe(
          (res: any) => {
            if (res?.[0] != null) {
              resolve(res[0]["TerceroId"]);
            } else {
              resolve(this.crearTercero(docente));
            }
          },
          (error: any) => {
            reject(new Error(`Error al consultar tercero: ${error?.message || error}`));
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
            reject(new Error(`Error al crear tercero: ${error?.message || error}`));
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
            reject(new Error(`Error al asociar identificacion tercero: ${error?.message || error}`));
          }
        );
    });
  }

  async consultarProyectos(idCoordinador: any): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.academicaService.get('coordinador_carrera_snies/' + idCoordinador)
        .subscribe(
          (res: any) => {
            if (res != null) {
              if (res["coordinadorCollection"]?.coordinador != null) {
                const proyectos = res["coordinadorCollection"].coordinador.map(({ codigo_condor, nombre_proyecto_condor }: any) => ({
                  id: codigo_condor,
                  nombre: codigo_condor + "-" + nombre_proyecto_condor
                }));
                resolve(proyectos);
              } else {
                resolve([]);
              }
            }
          },
          (error: any) => {
            reject(new Error(`Error al consultar proyectos: ${error?.message || error}`));
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
              if (res["docentesCollection"]?.docentes != null) {
                const docentes = res["docentesCollection"].docentes.map(({ identificacion, nombres, apellidos }: any) => ({
                  id: identificacion,
                  nombre: nombres + " " + apellidos
                }));
                resolve(docentes);
              } else {
                resolve([]);
              }
            }
          },
          (error: any) => {
            reject(new Error(`Error al consultar docentes por proyecto: ${error?.message || error}`));
          }
        )
    });
  }

  continuar(form: FormGroup): void {
    if (form.valid) {
      const keyBase = this.conversionNombreProceso[this.selectedEvaluation];
      const mensajeKey = `${keyBase}.mensaje_confirmacion`;

      console.log("this.selectedEvaluation this.selectedEvaluation: ", this.selectedEvaluation);

      this.translate.get(mensajeKey, {
        nombre_proyecto: this.nombreProyecto,
        nombre_docente: this.nombreDocente,
        nombre_asignatura: this.nombreEspacio,
        grupo: this.grupos,
      }).subscribe((mensaje) => {
        this.popUpManager.showConfirmAlert(mensaje).then((result) => {
          if (result.isConfirmed) {
              const datosGenerales = {
                nombreEvaluacion: this.selectedEvaluation,
                periodo: this.periodoActual,
                correo: this.userEmail,
                documento: this.userDocument,
                fecha: this.fechaFormateada,
                hora: this.horaFormateada
              };

              let datosEvaluacion: any = {};

              switch (this.selectedEvaluation) {
                case 'Coevaluación II':
                  datosEvaluacion = {
                    proyectoCurricular: this.coevaluacionIIForm.get('proyectoCurricular')?.value?.nombre,
                    docente: this.coevaluacionIIForm.get('docenteNombre')?.value?.nombre,
                    nombreConsejoCurricular: localStorage.getItem('nombre_consejo'),
                  };
                  break;

                case 'Coevaluación I':
                  datosEvaluacion = {
                    docente: form.get('docenteNombre')?.value,
                    espacioAcademico: form.get('espacioAcademico')?.value?.nombre,
                    grupo: this.coevaluacionIForm.get('grupoSeleccionado')?.value?.nombre || ''
                  };
                  break;

                case 'Autoevaluación II 1':
                case 'Autoevaluación II 2':
                case 'Autoevaluación II 3':
                  datosEvaluacion = {
                    docente: form.get('docenteNombre')?.value,
                    espacioAcademico: form.get('espacioAcademico')?.value?.nombre,
                    grupo: ''
                  };
                  break;

                case 'Autoevaluación I':
                case 'Heteroevaluación':
                  datosEvaluacion = {
                    estudiante: form.get('estudianteNombre')?.value,
                    espacioAcademico: form.get('espacioAcademico')?.value?.nombre || ''
                  };
                  break;

                default:
                  console.warn('Evaluación no reconocida:', this.selectedEvaluation);
                  break;
              }

              const datosCompletos = {
                ...datosGenerales,
                datosEvaluacion
              };

              console.log("datosCompletos: ", datosCompletos);

              localStorage.setItem('datos_usuario', JSON.stringify(datosCompletos));

            if (this.selectedEvaluation === "Coevaluación II") {
              this.mostrarReporCoevaII = true;
              this.consultarDocumentos();
            }
            this.mostrarEvaluacion = true;
          }
        });
      });

    } else {
      form.markAllAsTouched();
      this.markInvalidFields(form);

      this.translate.get("GLOBAL.formulario_incompleto_descripcion").subscribe((mensajeError) => {
        this.popUpManager.showErrorAlert(mensajeError);
      });
    }
  }


  markInvalidFields(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control?.invalid) {
        console.error(`El campo ${field} es inválido.`);
      }
    });
  }

  ocultarEvaluacion() {
    this.mostrarEvaluacion = false;
  }

  openSnackBar(mensaje: string) {
    this._snackBar.open(mensaje, this.translate.instant('GLOBAL.cerrar'), {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  /* -------------------------------------------------------------------------- */
  /*               Funciones para el formulario de Coevaluación I               */
  /* -------------------------------------------------------------------------- */
  transformarDatosDocenteCoevI(lista: any[]): any[] {
    const proyectosMap = new Map<number, any>();

    lista.forEach((elemento) => {
      const { cod_proyecto, proyecto, cod_espacio, espacio, id_grupo, grupo } = elemento;

      if (!proyectosMap.has(cod_proyecto
      )) {
        proyectosMap.set(cod_proyecto
          , {
            id: cod_proyecto,
            nombre: proyecto,
            asignaturas: []
          });
      }

      const proy = proyectosMap.get(cod_proyecto);
      if (proy) {
        const asignaturaExistente = proy.asignaturas.find((asignatura: any) => asignatura.nombre === espacio);
        if (asignaturaExistente) {
          const grupoExistente = asignaturaExistente.grupos.some((grupo: any) => grupo.id === id_grupo);
          if (!grupoExistente) {
            asignaturaExistente.grupos.push({
              id: id_grupo,
              nombre: grupo
            });
          }
        } else {
          proy.asignaturas.push({
            id: String(cod_espacio),
            nombre: espacio,
            grupos: [
              {
                id: id_grupo,
                nombre: grupo
              }
            ]
          });
        }
      }
    });

    return Array.from(proyectosMap.values());
  }

  onProyectoCoevI(event: MatSelectChange): void {
    const proyectoSeleccionado = event.value;
    this.proyectoEspacio = proyectoSeleccionado.id;
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
          grupos: espacio.grupos,
          docente: espacio.docente
        });
      });
    }
  }

  onEspacioCoevI(event: MatSelectChange): void {
    const espacioSeleccionado = event.value;
    this.espacio = espacioSeleccionado.id;
    this.nombreEspacio = espacioSeleccionado.nombre;
    this.grupos = espacioSeleccionado.grupos;
    this.openSnackBar(`Espacio seleccionado: ${espacioSeleccionado.nombre}`);
  }

  onGrupoCoevI(event: MatSelectChange): void {
    this.grupo = {
      "id_grupo": event.value.id,
      "grupo": event.value.nombre
    };
  }


  /* -------------------------------------------------------------------------- */
  /*                      Fin formulario de Coevaluación I                      */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*               Funciones para el formulario de Coevaluación II              */
  /* -------------------------------------------------------------------------- */
  onProyectoCoevII(event: MatSelectChange): void {
    this.mostrarEvaluacion = false;
    this.mostrarReporCoevaII = false;
    const proyectoSeleccionado = event.value;
    if ((this.hasRole([ROLES.DECANO]))) {
      // couslta del coordinador del proyecto seleccionado
      // 1. se obtiene informacion del proyecto
      let url = `/proyecto_curricular_oikos/${proyectoSeleccionado.id}`
      this.homologacionDependenciasService.get(url)
        .subscribe({
          next: (resProyecto: any) => {
            if (resProyecto != null) {
              this.proyectoEspacio = resProyecto.homologacion.codigo_proyecto;
              this.proyecto = resProyecto.homologacion.codigo_proyecto;
              let id_snies = resProyecto.homologacion.id_snies;
              let url2 = `carrera_snies/${id_snies}`
              // 2. se obtiene el coordinador del proyecto 
              this.academicaService.get(url2)
                .subscribe({
                  next: (resCoordinador: any) => {
                    if (resCoordinador != null) {
                      const docentes = [{
                        id: resCoordinador.carreraSniesCollection.carreraSnies[0].numero_documento_coordinador,
                        nombre: resCoordinador.carreraSniesCollection.carreraSnies[0].nombre_coordinador
                      }]
                      this.docentes.opciones = docentes;
                      this.nombreProyecto = proyectoSeleccionado.nombre;
                    }
                  },
                  error: (err) => {
                    console.error('Error al obtener coordinador:', err);
                  }
                })
            }
          },
          error: (err) => {
            console.error('Error al cargar proyectos:', err);
          }
        }
        );
    } else {
      this.consultarDocentesPorProyecto(proyectoSeleccionado.id).then((docentes) => {
        this.docentes.opciones = docentes;
        this.proyectoEspacio = proyectoSeleccionado.id;
        this.proyecto = proyectoSeleccionado.id;
        this.nombreProyecto = proyectoSeleccionado.nombre;
      });
    }

  }

  onDocenteCoevII(event: MatSelectChange): void {
    this.mostrarEvaluacion = false;
    this.mostrarReporCoevaII = false;
    const docenteSeleccionado = event.value;

    const datosCombinados = {
      ...docenteSeleccionado,
      evaluacionId: this.selectedEvaluationId
    };

    localStorage.setItem('datos_docente_coevII', JSON.stringify(datosCombinados));

    this.userService.getUserDocument().then((documento) => {
      if (documento == docenteSeleccionado.id) {
        Swal.fire({
          icon: "warning",
          title: this.translate.instant("GLOBAL.atencion"),
          text: this.translate.instant("coevaluacion_ii.validacion_coordinador"),
        })
      }
      else {
        this.evaluado = docenteSeleccionado.id;
        let parametros = {
          parametros: {
            identificacion: docenteSeleccionado.id
          }
        }
        this.evaluacionDocenteMidService
          .post('espacios_academicos', parametros)
          .subscribe({
            next: (response) => {
              if (response.Data != null) {
                this.espacios_academicos = this.filtrarEspaciosPorProyecto(response.Data, this.proyecto);
              }
            },
            error: (err) => {
              Swal.fire({
                icon: "error",
                title: this.translate.instant("GLOBAL.atencion"),
                text: this.translate.instant("coevaluacion_ii.validacion_espacios"),
              })
            }
          }
          );
      }
    });
  }

  onEspacioCoevII(event: MatSelectChange): void {
    this.grupos = [];
    const espacioSeleccionado = event.value;

    if (Array.isArray(espacioSeleccionado)) {
      let idsEspacios: string = "";
      let nombresEspacios: string = "";
      espacioSeleccionado.forEach((esp) => {
        idsEspacios += esp.id + ",";
        nombresEspacios += esp.nombre + ",";
        if (Array.isArray(esp.grupos)) {
          this.grupos.push(...esp.grupos);
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
    this.mostrarEvaluacion = false;
  }

  async consultarProyectosFacultad(idDependencia: any): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.academicaService.get('coordinador_carrera_snies/' + idDependencia)
        .subscribe(
          (res: any) => {
            if (res != null) {
              if (res["coordinadorCollection"]?.coordinador != null) {
                const proyectos = res["coordinadorCollection"].coordinador.map(({ codigo_condor, nombre_proyecto_condor }: any) => ({
                  id: codigo_condor,
                  nombre: codigo_condor + "-" + nombre_proyecto_condor
                }));
                resolve(proyectos);
              } else {
                resolve([]);
              }
            }
          },
          (error: any) => {
            reject(new Error(`Error al consultar proyectos por facultad: ${error?.message || error}`));
          }
        )
    });
  }
  /* -------------------------------------------------------------------------- */
  /*                      Fin formulario de Coevaluación II                     */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*            Inicio reportes para el formulario de Coevaluación II           */
  /* -------------------------------------------------------------------------- */

  consultarDocumentos() {
    this.base64Document = '';
    let storedDatosDocenteCoevII = localStorage.getItem('datos_docente_coevII');
    let storedPeriodoActual = localStorage.getItem('periodo_actual');
    if (storedDatosDocenteCoevII !== null && storedPeriodoActual !== null) {
      let evaluadoId = "";
      let periodoId = "";
      const dataParsedDocenteCoevII = JSON.parse(storedDatosDocenteCoevII);
      const dataParsedPeriodoActual = JSON.parse(storedPeriodoActual);
      evaluadoId = dataParsedDocenteCoevII.id;
      periodoId = dataParsedPeriodoActual;

      let url = `documento/documentos_concatenados/${periodoId}/${evaluadoId}`
      this.evaluacionDocenteMidService.get(url).subscribe(
        (res: any) => {
          if (res != null) {
            this.base64Document = res["Data"];
            this.showPdfComponent = true;
          } else {
            this.showPdfComponent = false;
            this.popUpManager.showAlert("Atencion", "No se encontraron documentos para el docente seleccionado.");
          }
        },
        (error: any) => {
          this.popUpManager.showErrorAlert("Error al obtener los documentos del docente.");
          console.error("Error al obtener los documentos:", error);
        }
      )
    } else {
      this.popUpManager.showErrorAlert("Los datos necesarios del docente no se lograron obtener del local storage.");
      throw new Error("Datos del local storage no disponibles.");
    }
  }

  crearReporteCSV(nombreEvaluacion: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._crearReporteCSV(nombreEvaluacion)
        .then(resolve)
        .catch(reject);
    });
  }
  

  private async _crearReporteCSV(nombreEvaluacion: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let evaluadoId = "";
        let nombreEvaluado = "";
        let periodoId = "";
        //let procesoId = "";

        let storedDatosDocenteCoevII = localStorage.getItem('datos_docente_coevII');
        let storedPeriodoActual = localStorage.getItem('periodo_actual');
        if (storedDatosDocenteCoevII !== null && storedPeriodoActual !== null) {
          const dataParsedDocenteCoevII = JSON.parse(storedDatosDocenteCoevII);
          const dataParsedPeriodoActual = JSON.parse(storedPeriodoActual);

          evaluadoId = dataParsedDocenteCoevII.id;
          nombreEvaluado = dataParsedDocenteCoevII.nombre;
          periodoId = dataParsedPeriodoActual;
          //procesoId = dataParsedDocenteCoevII.evaluacionId;
        } else {
          this.popUpManager.showErrorAlert("Los datos necesarios del docente no se lograron obtener del local storage.");
          throw new Error("Datos del local storage no disponibles.");
        }

        const nombreHeteroevaluacion = this.translate.instant('reportes.nombre_reporte_heteroevaluacion');
        const nombreAutoevaluacion = this.translate.instant('reportes.nombre_reporte_autoevaluacion_ii_tres');
        const nombreCoevaluacion = this.translate.instant('reportes.nombre_reporte_coevaluacion_i');

        switch (nombreEvaluacion) {
          case nombreHeteroevaluacion:{
            const url = `reporte_heteroevaluacion_consejo?evaluado_id=${evaluadoId}&periodo_id=${periodoId}&proceso_id=6999`;
            const response = await this.evaluacionDocenteMidService.get(url).toPromise();

            if (response?.Success && response?.Data?.RespuestasEvaluacion) {
              const respuestas = response.Data.RespuestasEvaluacion;
              let contenido = 'CEDULA,ID ESPACIO ACADEMICO,ESPACIO ACADEMICO,AMBITO 1,AMBITO 2,AMBITO 3,PROMEDIO FINAL\n';
              respuestas.forEach((respuesta: any) => {
                contenido += `${evaluadoId},${respuesta.EspacioAcademicoId},"${respuesta.NombreEspacio}",${respuesta.Ambito1},${respuesta.Ambito2},${respuesta.Ambito3},${respuesta.PromedioFinal}\n`;
              });

              try {
                const { success, message } = await this.descargarCSV(contenido, `reporte_heteroevaluacion_${evaluadoId}.csv`);

                if (success) {
                  this.popUpManager.showSuccessAlert(message);
                  resolve({
                    Success: true,
                    Message: message
                  });
                } else {
                  this.popUpManager.showErrorAlert(message);
                  reject(new Error('No se pudo descargar el archivo CSV.'));
                }
              } catch (error: any) {
                this.popUpManager.showErrorAlert(`Error al intentar descargar el CSV: ${error.message}`);
                reject(new Error(`Error al intentar descargar el CSV: ${error.message}`));
              }

            } else {
              this.translate.get("GLOBAL.operacion_sin_datos").subscribe((titulo) => {
                this.popUpManager.showAlert(titulo, `No se encontraron datos para generar el reporte, del profesor/a con cédula ${evaluadoId}`);
              });
              resolve(response);
            }

            break;
          }  
          case nombreAutoevaluacion: {
            const urlAutoevaluacion = `reporte_autoevaluacion_ii_tres_consejo?evaluador_id=${evaluadoId}&periodo_id=${periodoId}&proceso_id=6995&nombre_evaluador=${nombreEvaluado}`;
            const responseAutoevaluacion = await this.evaluacionDocenteMidService.get(urlAutoevaluacion).toPromise();

            if (responseAutoevaluacion?.Success && responseAutoevaluacion?.Data?.RespuestasEvaluacion) {
              const respuestas = responseAutoevaluacion.Data.RespuestasEvaluacion;
              let contenido = 'CEDULA,Nombre,ID ESPACIO ACADEMICO,ESPACIO ACADEMICO,PROMEDIO,RESPUESTA 1,RESPUESTA 2,RESPUESTA 3,ENLACE\n';
              respuestas.forEach((respuesta: any) => {
                contenido += `${respuesta.Documento},"${responseAutoevaluacion.Data.NombreEvaluador}",${respuesta.EspacioAcademicoId},"${respuesta.NombreEspacio}",${respuesta.Promedio},"${respuesta.RespuestaPregunta1}","${respuesta.RespuestaPregunta2}","${respuesta.RespuestaPregunta3}","${respuesta.Enlace}"\n`;
              });

              try {
                const { success, message } = await this.descargarCSV(contenido, `reporte_autoevaluacion_ii_3_${evaluadoId}.csv`);

                if (success) {
                  this.popUpManager.showSuccessAlert(message);
                  resolve({
                    Success: true,
                    Message: message
                  });
                } else {
                  this.popUpManager.showErrorAlert(message);
                  reject(new Error('No se pudo descargar el archivo CSV.'));
                }
              } catch (error: any) {
                this.popUpManager.showErrorAlert(`Error al intentar descargar el CSV: ${error.message}`);
                reject(new Error(`Error al intentar descargar el CSV: ${error.message}`));
              }

            } else {
              this.translate.get("GLOBAL.operacion_sin_datos").subscribe((titulo) => {
                this.popUpManager.showAlert(titulo, `No se encontraron datos para generar el reporte, del profesor/a con cédula ${evaluadoId}`);
              });
              resolve(responseAutoevaluacion);
            }

            break;
          }  
          case nombreCoevaluacion: {
            const urlCoevaluacion = `reporte_coevaluacion_i_consejo?evaluador_id=${evaluadoId}&periodo_id=${periodoId}&proceso_id=6994`;
            const responseCoevaluacion = await this.evaluacionDocenteMidService.get(urlCoevaluacion).toPromise();

            if (responseCoevaluacion?.Success && responseCoevaluacion?.Data?.RespuestasEvaluacion) {
              const respuestas = responseCoevaluacion.Data.RespuestasEvaluacion;
              let contenido = 'ID ESPACIO ACADEMICO,ESPACIO ACADEMICO,ID GRUPO,GRUPO,RESPUESTA 1,RESPUESTA 2,RESPUESTA 3,ENLACE\n';
              respuestas.forEach((respuesta: any) => {
                contenido += `${respuesta.EspacioAcademicoId},"${respuesta.NombreEspacio}",${respuesta.IdGrupo},"${respuesta.Grupo}","${respuesta.RespuestaPregunta1}","${respuesta.RespuestaPregunta2}","${respuesta.RespuestaPregunta3}","${respuesta.Enlace}"\n`;
              });

              try {
                const { success, message } = await this.descargarCSV(contenido, `reporte_coevaluacion_i_${evaluadoId}.csv`);

                if (success) {
                  this.popUpManager.showSuccessAlert(message);
                  resolve({
                    Success: true,
                    Message: message
                  });
                } else {
                  this.popUpManager.showErrorAlert(message);
                  reject(new Error('No se pudo descargar el archivo CSV.'));
                }
              } catch (error: any) {
                this.popUpManager.showErrorAlert(`Error al intentar descargar el CSV: ${error.message}`);
                reject(new Error(`Error al intentar descargar el CSV: ${error.message}`));
              }

            } else {
              this.translate.get("GLOBAL.operacion_sin_datos").subscribe((titulo) => {
                this.popUpManager.showAlert(titulo, `No se encontraron datos para generar el reporte, del profesor/a con cédula ${evaluadoId}`);
              });
              resolve(responseCoevaluacion);
            }

            break;
          }
          default:
            console.log('No se reconoce el reporte.');
        }
      } catch (error: any) {
        reject(new Error(`Error al crear el reporte csv: ${error?.message || error}`));
      }
    });
  }

  descargarCSV(contenido: string, nombreArchivo: string): Promise<{ success: boolean, message: string }> {
    return new Promise((resolve, reject) => {
      try {
        const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = nombreArchivo;
        a.click();
        window.URL.revokeObjectURL(urlBlob);
        resolve({ success: true, message: `El reporte con nombre ${nombreArchivo} se ha descargado correctamente.` });
      } catch (error: any) {
        console.error('Error al generar o descargar el archivo CSV:', error);
        resolve({ success: false, message: error.message });
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /*              Fin reportes para el formulario de Coevaluación II            */
  /* -------------------------------------------------------------------------- */

}
