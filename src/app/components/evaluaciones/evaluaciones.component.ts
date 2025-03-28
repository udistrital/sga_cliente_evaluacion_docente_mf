import { Component, OnInit, Input, SimpleChanges, ViewChild } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { MatSelectChange } from "@angular/material/select";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
//import { DateService } from 'src/app/services/date.service';
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
import { CoreService } from "src/app/services/core.service";
import { OikosService } from "src/app/services/oikos.service";
import { CumplidosDveService } from "src/app/services/cumplidos_dve.service";
import { HomologacionDependenciasService } from "src/app/services/homologacion_dependencias.service";
import { firstValueFrom } from 'rxjs';


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
  mostrarEvaluacion: boolean = false;
  procesosEvaluacion: any[] = [];
  nombresGeneralesProcesos: string[]  = [
    'Heteroevaluación',
    'Autoevaluación I',
    'Autoevaluación II 1',
    'Autoevaluación II 2',
    'Autoevaluación II 3',
    'Coevaluación I',
    'Coevaluación II'
  ];

  auxEspaciosHetero: any[] = [];
  fechas: any = null; // Campo para guardar las fechas de inicio y fin para todos los tipos de evaluacion
  formularioHabilitado: boolean = false; // Campo para habilitado e inhanilitar formulario (rango de fechas)

  @Input() formtype: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private proyectoAcademicoService: ProyectoAcademicoService,
    private _snackBar: MatSnackBar,
    private espaciosAcademicosService: EspaciosAcademicosService,
    private popUpManager: PopUpManager,
    //private dateService: DateService,
    private evaluacionDocenteMidService: SgaEvaluacionDocenteMidService,
    private evaluacionDocenteService: EvaluacionDocenteService,
    private tercerosService: TercerosCrudService,
    private academicaService: AcademicaService,
    private parametrosService: ParametrosService,
    private translate: TranslateService,
    private coreService: CoreService,
    private oikosService: OikosService,
    private cumplidosDveService: CumplidosDveService,
    private homologacionDependenciasService: HomologacionDependenciasService
  ) {
    this.heteroForm = this.fb.group({});
    this.coevaluacionIIForm = this.fb.group({});
    this.coevaluacionIForm = this.fb.group({});
    this.autoevaluacionIIForm = this.fb.group({});
    this.autoevaluacionIIDosForm = this.fb.group({});
    this.autoevaluacionIITresForm = this.fb.group({});
    this.autoevaluacionIForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForms();

    this.userService.getPersonaId()
      .then(
        (personaId) => {
          this.evaluador = personaId;
        }
      ).catch(error => {
        this.evaluador = 1;
        console.error('Error:', error.message);
      });

    this.userService.getUserRoles().then((roles) => {
      this.userRoles = roles;
      console.log("Roles obtenidos:", this.userRoles);
      this.consultaIniciaParametrosForm().then(() => {
        console.log("Parámetros cargados correctamente");
        this.encuentraForm();
      });
    }).catch(error => console.error('Error al obtener los roles de usuario:', error));

    /*this.dateService.getDateHeader().subscribe(
      (date: string) => {
        this.dateHeader = date;
      },
      (error: any) => console.error('Error al obtener el encabezado de fecha:', error)
    );*/

  }

  encuentraForm(): void {
    console.log("this.procesosEvaluacion : ", this.procesosEvaluacion );
    if (this.userRoles.includes(this.ROLES.DOCENTE)) {
        console.log('El usuario es DOCENTE');

    } else if (this.userRoles.includes(this.ROLES.ESTUDIANTE)) {
      const procesoAutoevaluacion = this.procesosEvaluacion.find(p => p.Nombre === this.nombresGeneralesProcesos[1]);

      if (procesoAutoevaluacion) {
        const fakeEvent: MatSelectChange = { value: procesoAutoevaluacion.Id } as MatSelectChange;
        this.onSelectProceso(fakeEvent);
      } else {
        console.warn("El estudiante no tiene acceso a 'Autoevaluación I'.");
      }
    } else if (this.userRoles.includes(this.ROLES.CONSEJO_CURRICULAR)) {
      console.log('El usuario es CONSEJO_CURRICULAR');

    } else if (this.userRoles.includes(this.ROLES.DECANO) || this.userRoles.includes(this.ROLES.COORDINADOR)){
      console.log('El usuario es DECANO o COORDINADOR');

    } else if (this.userRoles.includes(this.ROLES.ADMIN_SGA)) {
      console.log('El usuario es ADMIN');

    } else {
        this.popUpManager.showErrorAlert(`El usuario tiene un rol no parametrizado: ${this.userRoles}`);
    }
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
      espacioAcademico: ["", Validators.required],
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

  consultaIniciaParametrosForm(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.parametrosService.get('parametro?query=tipo_parametro_id:' + environment.TIPO_PARAMETRO_ID.PROCESO_EVALUACION_ID).subscribe(
        (responseParametro: any) => {
          if (responseParametro && responseParametro.Data && responseParametro.Data.length) {
            this.procesosEvaluacion = responseParametro.Data
            .filter((item: any) => this.validarRol(item.Nombre)) 
            .map((item: any) => ({
              Id: item.Id,
              Nombre: item.Nombre
            })); 
            resolve();
          } else {
            this.popUpManager.showErrorAlert(`No se encontraron parámetros.`);
            reject("No se encontraron parámetros.");
          }
        },
        (error) => {
          this.popUpManager.showErrorAlert(`Error al obtener los parámetros.`);
          reject(error);
        }
      );
    });
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
  /*onSelectChange(event: MatSelectChange) {
    const procesoSeleccionado = this.procesosEvaluacion.find(proceso => proceso.Id === event.value);
    console.log("procesoSeleccionado: ", procesoSeleccionado);
    if (procesoSeleccionado) {
      this.selectedEvaluation = procesoSeleccionado.Nombre;
      this.selectedEvaluationId = procesoSeleccionado.Id;
    } else {
      console.log("No selecciono procesoSeleccionado.")
    }
    this.mostrarEvaluacion = false;
    this.getFechas(this.selectedEvaluationId);
  }*/

  onSelectProceso(event: MatSelectChange) {
    const procesoSeleccionado = this.procesosEvaluacion.find(proceso => proceso.Id === event.value);
    console.log("procesoSeleccionado: ", procesoSeleccionado);
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
    if (this.hasRole([ROLES.ESTUDIANTE])) {
      await this.consultarDatosEstudiante();
    } else if (this.hasRole([ROLES.DOCENTE])) {
      await this.consultarDatosDocente();
    } else if (this.hasRole([ROLES.COORDINADOR, ROLES.DECANO])) {
      await this.consultarDatosCoordinadorODecano();
    }
  }
  
  private async consultarDatosEstudiante() {
    try {
      const documento = await this.userService.getUserDocument();
      if (!documento) return;
  
      const response:any = await this.consultarCargaAcademica(documento);
      console.log("response: ", response);
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
      const response:any = await this.consultarEspaciosAcademicos(documento);
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
        const fecha = '2024-06-06';
        const url = `jefe_dependencia?query=FechaFin__gte:${fecha},FechaInicio__lte:${fecha},TerceroId:${personaId}`;
        const responseFacultad:any = await firstValueFrom(this.coreService.get(url));
  
        if (responseFacultad?.[0]?.DependenciaId) {
          const url2 = `proyecto_curricular/get_all_proyectos_by_facultad_id/${responseFacultad[0].DependenciaId}`;
          const responseProyectos = await firstValueFrom(this.oikosService.get(url2));
  
          this.proyectos.opciones = responseProyectos.Body[0].Opciones.map(({ Id, Nombre }: any) => ({
            id: Id,
            nombre: Id + "-" + Nombre
          }));
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

  // -- POSIBLE CAMBIO PARA QUE GUARDE EN LOCALSTORAGE LA CONSULTA, FALTA PROBAR -- //
  /*async cargarEspaciosAcademicos() {
    var storedConsulEspaciosAcade = localStorage.getItem('data_espacios_academicos');
    if (storedConsulEspaciosAcade !== null) {
      const dataParsed = JSON.parse(storedConsulEspaciosAcade);
      console.log('consulta grande que guardo en storage: ', dataParsed);
      return {
        identificacion: dataParsed.Data.estudiante.espacios[0].doc_estudiante,
        nombre: dataParsed.Data.estudiante.espacios[0].nom_estudiante,
        proyectos: this.transformarDatosEstudiante(dataParsed.Data.estudiante.espacios)
      };
    } else {
      return new Promise((resolve, reject) => {
        this.espaciosAcademicosService
          .get('espacio-academico?query=espacio_academico_padre,activo:true&limit=0')
          .subscribe(
            (response: any) => {
              if (response.Data != null) {
                console.log('Guardo en storage: ', JSON.stringify(response));
                localStorage.setItem('data_espacios_academicos', JSON.stringify(response));
                resolve(this.espacios_academicos = response['Data']);
              } else {
                console.log('LLEGO AL ELSE: ');
                this.espacios_academicos = response['Data'];
                resolve(true);
              }
            },
            (error) => {
              reject(error);
            }
          );
      });
    }
  }*/

  async consultarCargaAcademica(documento: string) {
    let parametros = {
      parametros: {
        identificacion: documento
      }
    }
    var storedConsultaEstudiante = localStorage.getItem('data_evaluacion_estudiante');
    if (storedConsultaEstudiante !== null) {
      const dataParsed = JSON.parse(storedConsultaEstudiante);
      console.log('consulta grande que guardo en storage: ', dataParsed);
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
              reject(error);
            }
          );
      });
    }
  }

  transformarDatosEstudiante(lista: any[]): any[] {
    const proyectosMap = new Map<number, any>();

    console.log(lista)


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

    console.log(lista)


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
    var storedConsultaEspaciosAcademicos = localStorage.getItem('data_consulta_espacios_academicos');
    if (storedConsultaEspaciosAcademicos !== null) {
      const dataParsed = JSON.parse(storedConsultaEspaciosAcademicos);
      console.log('CONSULTA grande que consulta en storage: ', dataParsed);
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
                console.log('guardo en storage data_consulta_espacios_academicos: ', JSON.stringify(response));
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
              reject(error);
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
    // Si ya se realizo una primera consulta 
    // (aplica cuando se va a seleccionar otro tipo de evaluacion despues de haber seleccionado uno anteriormente)
    if (this.fechas) {
      const fechaInicio = new Date(this.fechas[idEvaluacion].fechaInicio);
      const fechaFin = new Date(this.fechas[idEvaluacion].fechaFin);
      this.validarFechas(fechaInicio, fechaFin);
    } else { // Al seleccionar por primera vez un tipo de evaluacion
      this.evaluacionDocenteService
        .get(`proceso_parametro?query=Activo:true&limit=0`)
        .subscribe(
          (response: any) => {
            if (response.Data != null) {
              this.fechas = this.transformarFechas(response.Data );
              const fechaInicio = new Date(this.fechas[idEvaluacion].fechaInicio);
              const fechaFin = new Date(this.fechas[idEvaluacion].fechaFin);
              this.validarFechas(fechaInicio, fechaFin);
            } 
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  // Validr las fechas, habilitar formulario y consultar datos iniciales
  // o mostrar mensaje de error si la fecha actual no está en el rango
  validarFechas(fechaInicio: Date, fechaFin: Date) {
    const fechaActual = new Date();
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
      console.log("entra ptyecto seleccionado")
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
    console.log("onProyectoHetero", proyectoSeleccionado);

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
    console.log("onDocenteHetero", docenteSeleccionado);
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
    console.log("onProyectoAutI", proyectoSeleccionado);

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
    console.log("onEspacioAutI", espacioSeleccionado);

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
      var idsEspacios: string = "";
      var nombresEspacios: string = "";
      var grupos: any[] = [];
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
    if (this.selectedEvaluation === "Heteroevaluación") {


    }
    else {
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
              console.log(espaciosUnicos);
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

  }

  async consultarTercero(docente: any): Promise<any> {
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

  async consultarProyectos(idCoordinador: any): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.academicaService.get('coordinador_carrera_snies/' + idCoordinador)
        .subscribe(
          (res: any) => {
            if (res != null) {
              if (res["coordinadorCollection"] != null && res["coordinadorCollection"].coordinador != null) {
                console.log(res["coordinadorCollection"].coordinador);

                const proyectos = res["coordinadorCollection"].coordinador.map(({ codigo_condor, nombre_proyecto_condor }: any) => ({
                  id: codigo_condor,
                  nombre: codigo_condor + "-" + nombre_proyecto_condor
                }));
                resolve(proyectos);
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
          grupo: this.grupos,
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
    console.log("onProyectoCoevI", proyectoSeleccionado);
    // this.proyecto = proyectoSeleccionado.id;
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
    const proyectoSeleccionado = event.value;
    if ((this.hasRole([ROLES.DECANO]))) {
      // consulta coordinador del proyecto seleccionado
      let url = `informacion_academica/informacion_coordinador/${proyectoSeleccionado.id}`
      this.cumplidosDveService.get(url)
        .subscribe({
          next: (resCoordinador: any) => {
            if (resCoordinador != null) {
              console.log(resCoordinador.Data.carreraSniesCollection.carreraSnies[0]);
              const docentes = [{
                id: resCoordinador.Data.carreraSniesCollection.carreraSnies[0].numero_documento_coordinador,
                nombre: resCoordinador.Data.carreraSniesCollection.carreraSnies[0].nombre_coordinador
              }]
              this.docentes.opciones = docentes;
              this.nombreProyecto = proyectoSeleccionado.nombre;
              // se homologa proyecto seleccionado
              let url2 = `proyecto_curricular_oikos/${proyectoSeleccionado.id}`
              this.homologacionDependenciasService.get(url2)
                .subscribe({
                  next: (resHomologacion: any) => {
                    if (resHomologacion != null) {
                      this.proyectoEspacio = resHomologacion.homologacion.codigo_proyecto;
                      this.proyecto = resHomologacion.homologacion.codigo_proyecto;
                    }
                  },
                  error: (err) => {
                    console.error('Error al cargar proyectos:', err);
                  }
                }
                );

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
    console.log("Selecciona docente")
    console.log(this.proyecto);

    const docenteSeleccionado = event.value;
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
        console.log("docenteSeleccionado", docenteSeleccionado);
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
                console.log(espaciosUnicos);
              }
            },
            error: (err) => {
              console.error('Error al cargar proyectos:', err);
            }
          }
          );
        this.espacios.opciones = this.espacios_academicos.filter((espacio) => espacio.docente === docenteSeleccionado.id);
        // this.consultarDocenteTercero(docenteSeleccionado).then(
        //   (res) => {
        //     if (res != null) {
        //       this.evaluado = res.Id;
        //       this.nombreDocente = res.NombreCompleto;
        //       this.mostrarEvaluacion = false;
        //     }
        //   }
        // )
      }
    });
  }

  onEspacioCoevII(event: MatSelectChange): void {
    this.grupos = [];
    const espacioSeleccionado = event.value;

    if (Array.isArray(espacioSeleccionado)) {
      var idsEspacios: string = "";
      var nombresEspacios: string = "";
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
              if (res["coordinadorCollection"] != null && res["coordinadorCollection"].coordinador != null) {
                console.log(res["coordinadorCollection"].coordinador);
                const proyectos = res["coordinadorCollection"].coordinador.map(({ codigo_condor, nombre_proyecto_condor }: any) => ({
                  id: codigo_condor,
                  nombre: codigo_condor + "-" + nombre_proyecto_condor
                }));
                resolve(proyectos);
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
  /* -------------------------------------------------------------------------- */
  /*                      Fin formulario de Coevaluación II                     */
  /* -------------------------------------------------------------------------- */

}
