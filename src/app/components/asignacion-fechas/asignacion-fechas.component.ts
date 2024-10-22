import { Component, OnInit } from "@angular/core";
import { ROLES } from "src/app/models/diccionario";
import { UserService } from "src/app/services/user.service";
import { EventosService } from "src/app/services/eventos.service";
import { ParametrosService } from "src/app/services/parametros.service";
import { PopUpManager } from "src/app/managers/popUpManager";
import { DateService } from "src/app/services/date.service";

@Component({
  selector: "app-asignacion-fechas",
  templateUrl: "./asignacion-fechas.component.html",
  styleUrls: ["./asignacion-fechas.component.scss"],
})
export class AsignacionFechasComponent implements OnInit {
  nivelFormacion: string = "";
  evaluacionExistente: any = null;
  periodoFormacion: string = "";
  niveles: string[] = ["Pregrado", "Postgrado"];
  periodos: any[] = [
    { Id: "1", Nombre: "Semestre 1 - 2024" },
    { Id: "2", Nombre: "Semestre 2 - 2024" },
  ];

  procesos: any[] = [
    {
      nombre: "Heteroevaluación",
      fechaInicio: "",
      fechaFin: "",
      editando: false,
      showIcon: false,
    },
    {
      nombre: "Autoevaluación estudiantes",
      fechaInicio: "",
      fechaFin: "",
      editando: false,
      showIcon: false,
    },
    {
      nombre: "Coevaluación I",
      fechaInicio: "",
      fechaFin: "",
      editando: false,
      showIcon: false,
    },
    {
      nombre: "Autoevaluación docente",
      fechaInicio: "",
      fechaFin: "",
      editando: false,
      showIcon: false,
    },
    {
      nombre: "Coevaluación II",
      fechaInicio: "",
      fechaFin: "",
      editando: false,
      showIcon: false,
    },
  ];

  userRoles: string[] = [];
  ROLES = ROLES;
  guardado: boolean = false;
  evaluacionesGuardadas: string[] = [];
  mensajeError: string = "";
  evaluaciones: any[] = [];
  errorPut: boolean = false;
  dateHeader: string | undefined;

  constructor(
    private userService: UserService,
    private eventosService: EventosService,
    private parametrosService: ParametrosService,
    private popUpManager: PopUpManager,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
      this.parametrosService.get('periodo?query=CodigoAbreviacion:PA,Activo:true&sortby=Id&order=desc&limit=5').subscribe(
        (response) => {
          if (response && response.Data && response.Data.length) {
            const descripciones = response.Data.map((periodo: any) => periodo.Descripcion);
            
          } else {
            console.error('No se encontraron periodos activos o la estructura de datos no es la esperada.');
          }
        },
        (error) => {
          console.error('Error al obtener los periodos activos:', error);
        }
      );
      this.obtenerPeriodosActivos();  
    }).catch(error => console.error('Error al obtener los roles de usuario:', error));
  }
  
  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some((role) => this.userRoles.includes(role));
  }

  validarFechas(proceso: any) {
    const fechaInicio = new Date(proceso.fechaInicio);
    const fechaFin = new Date(proceso.fechaFin);

    if (proceso.fechaInicio === "" || proceso.fechaFin === "") {
      return;
    }

    if (fechaInicio.getTime() === fechaFin.getTime()) {
      this.popUpManager.showErrorAlert(
        "La fecha de inicio y la fecha de fin no pueden ser iguales"
      );
      proceso.fechaFin = "";
      return;
    }

    if (fechaInicio > fechaFin) {
      this.popUpManager.showErrorAlert(
        "La fecha de inicio no puede ser posterior a la fecha de fin"
      );
      proceso.fechaFin = "";
      return;
    }

    if (fechaFin < fechaInicio) {
      this.popUpManager.showErrorAlert(
        "La fecha de fin no puede ser anterior a la fecha de inicio"
      );
      proceso.fechaFin = "";
      return;
    }
  }

  obtenerPeriodosActivos() {
    this.parametrosService.get("periodo?activo=true").subscribe(
      (response) => {
        this.periodos = response.length ? response : this.periodos;
      },
      (error) => {
        console.error("Error obteniendo periodos activos:", error);
        this.mensajeError =
          "Error obteniendo periodos activos: " + error.message;
      }
    );
  }

  guardar() {
    if (!this.nivelFormacion || !this.periodoFormacion) {
      this.mensajeError =
        "Debe seleccionar el nivel de formación y el período antes de guardar.";
      return;
    }

    this.guardado = false;
    this.evaluacionesGuardadas = [];

    let descripcionIndex = 1;

    for (let proceso of this.procesos) {
      if (proceso.fechaInicio && proceso.fechaFin) {
        const descripcion = `Evaluación ${descripcionIndex}`;
        const fechaInicio = new Date(proceso.fechaInicio).toISOString();

        // Validar existencia basado en descripción, fecha de inicio y nombre
        this.validarExistenciaEvaluacion(
          proceso,
          descripcion,
          fechaInicio,
          (exists, data) => {
            if (exists) {
              // Mostrar datos y mensaje para confirmar actualización
              this.mostrarDatosEvaluacionExistente(data);
              this.popUpManager
                .showConfirmAlert(
                  `Ya existe una evaluación con la Descripción "${descripcion}" y la Fecha de Inicio ${new Date(
                    data.FechaInicio
                  ).toLocaleDateString()}.\n` +
                    `Nombre: ${data.Nombre}\nFecha de Fin: ${new Date(
                      data.FechaFin
                    ).toLocaleDateString()}\nFecha de Creación: ${new Date(
                      data.FechaCreacion
                    ).toLocaleDateString()}\n\n` +
                    `¿Desea actualizar esta evaluación?`
                )
                .then((result) => {
                  if (result.isConfirmed) {
                    this.actualizarEvaluacion(data.Id, proceso);
                  } else {
                    this.mensajeError = `El proceso de actualización fue cancelado para la evaluación "${proceso.nombre}".`;
                  }
                });
            } else {
              // Si no existe, proceder con el POST
              this.crearNuevaEvaluacion(proceso, descripcionIndex);
            }
          }
        );

        descripcionIndex++;
      }
    }
  }

  crearNuevaEvaluacion(proceso: any, descripcionIndex: number) {
    const calendarioEvento = {
      Nombre: proceso.nombre,
      Descripcion: `Evaluación ${descripcionIndex}`,
      FechaCreacion: new Date().toISOString(),
      FechaModificacion: new Date().toISOString(),
      FechaInicio: new Date(proceso.fechaInicio).toISOString(),
      FechaFin: new Date(proceso.fechaFin).toISOString(),
      Activo: true,
      DependenciaId: "{}",
      EventoPadreId: null,
      TipoEventoId: {
        Id: 202,
        Nombre: "Evaluaciones Docente",
        Descripcion: "Evaluaciones realizadas por los docentes",
        CodigoAbreviacion: "EVAL_DOC",
        Activo: true,
        FechaCreacion: "2024-08-05T07:11:43.173984Z",
        FechaModificacion: "2024-08-05T07:11:43.174154Z",
        TipoRecurrenciaId: {
          Id: 7,
          Nombre: "Semestral",
          Descripcion: "Semestral",
          CodigoAbreviacion: "SEM",
          Activo: true,
          FechaCreacion: "2019-12-18T02:10:05Z",
          FechaModificacion: "2019-12-18T02:10:05Z",
        },
        CalendarioID: {
          Id: 120,
          Nombre: "Evaluaciones Docentes 2024",
          Descripcion:
            "Calendario de Evaluaciones para los docentes del año 2023",
          DependenciaId: '{"proyectos": [24, 23, 8]}',
          DocumentoId: 146529,
          PeriodoId: 6,
          AplicacionId: 0,
          Nivel: 1,
          Activo: true,
          FechaCreacion: "2024-08-05T06:53:01Z",
          FechaModificacion: "2024-08-05T06:53:01Z",
          CalendarioPadreId: null,
          DocumentoExtensionId: 146537,
          AplicaExtension: true,
          DependenciaParticularId: '{"proyectos":[24,8]}',
          MultiplePeriodoId: "",
        },
      },
      UbicacionId: 0,
      AplicaEdicionActividades: false,
      PosterUrl: "https://example.com/poster.jpg",
    };

    this.eventosService.post("calendario_evento", calendarioEvento).subscribe(
      (response) => {
        this.evaluacionesGuardadas.push(proceso.nombre);
        this.guardado = true;
        this.popUpManager.showSuccessAlert(
          `Evaluación "${proceso.nombre}" creada con éxito.`
        );
      },
      (error) => {
        console.error("Error guardando el evento:", error);
        this.mensajeError = "Error guardando el evento: " + error.message;
      }
    );
  }

  actualizarEvaluacion(id: number, proceso: any) {
    const calendarioEvento = {
      Id: id,
      Nombre: proceso.nombre || this.evaluacionExistente.Nombre,
      Descripcion: `Evaluación Actualizada`,
      FechaCreacion: this.evaluacionExistente.FechaCreacion, // Fecha de creación original
      FechaModificacion: new Date().toISOString(),
      FechaInicio: new Date(
        proceso.fechaInicio || this.evaluacionExistente.FechaInicio
      ).toISOString(),
      FechaFin: new Date(
        proceso.fechaFin || this.evaluacionExistente.FechaFin
      ).toISOString(),
      Activo: true,
      DependenciaId: "{}",
      EventoPadreId: null,
      TipoEventoId: {
        Id: 202,
        Nombre: "Evaluaciones Docente",
        Descripcion: "Evaluaciones realizadas por los docentes",
        CodigoAbreviacion: "EVAL_DOC",
        Activo: true,
        FechaCreacion: "2024-08-05T07:11:43Z",
        FechaModificacion: "2024-08-05T07:11:43Z",
        TipoRecurrenciaId: {
          Id: 7,
          Nombre: "Semestral",
          Descripcion: "Semestral",
          CodigoAbreviacion: "SEM",
          Activo: true,
          FechaCreacion: "2019-12-18T02:10:05Z",
          FechaModificacion: "2019-12-18T02:10:05Z",
        },
        CalendarioID: {
          Id: 120,
          Nombre: "Evaluaciones Docentes 2024",
          Descripcion:
            "Calendario de Evaluaciones para los docentes del año 2023",
          DependenciaId: '{"proyectos": [24, 23, 8]}',
          DocumentoId: 146529,
          PeriodoId: 6,
          AplicacionId: 0,
          Nivel: 1,
          Activo: true,
          FechaCreacion: "2024-08-05T06:53:01Z",
          FechaModificacion: "2024-08-05T06:53:01Z",
          CalendarioPadreId: null,
          DocumentoExtensionId: 146537,
          AplicaExtension: true,
          DependenciaParticularId: '{"proyectos":[24,8]}',
          MultiplePeriodoId: "",
        },
      },
      UbicacionId: 0,
      AplicaEdicionActividades: false,
      PosterUrl: "https://example.com/poster.jpg",
    };

    this.eventosService
      .put("calendario_evento", id, calendarioEvento)
      .subscribe(
        (response) => {
          this.popUpManager.showSuccessAlert(
            `Evaluación actualizada con éxito.`
          );
          this.errorPut = false; // Indica que no hubo error
        },
        (error) => {
          console.error("Error actualizando la evaluación:", error);
          this.errorPut = true; // Indica que hubo un error
          this.mensajeError =
            "Error actualizando la evaluación: " + error.message;
        }
      );
  }

  validarExistenciaEvaluacion(
    proceso: any,
    descripcion: string,
    fechaInicio: string,
    callback: (exists: boolean, data?: any) => void
  ) {
    this.eventosService
      .get(
        `calendario_evento?query=Descripcion:${descripcion},FechaInicio:${fechaInicio},Activo:true`
      )
      .subscribe(
        (response) => {
          if (response && response.length > 0) {
            const evaluacionEncontrada = response.find(
              (evalItem: any) => evalItem.Nombre === proceso.nombre
            );
            if (evaluacionEncontrada) {
              callback(true, evaluacionEncontrada);
            } else {
              callback(false);
            }
          } else {
            callback(false);
          }
        },
        (error) => {
          console.error(
            "Error validando la existencia de la evaluación:",
            error
          );
          this.mensajeError =
            "Error validando la existencia de la evaluación: " + error.message;
          callback(false);
        }
      );
  }

  mostrarDatosEvaluacionExistente(data: any) {
    this.evaluacionExistente = data; // Asignar la evaluación existente
    this.evaluacionesGuardadas = [
      `Nombre: ${data.Nombre}`,
      `Fecha de Inicio: ${new Date(data.FechaInicio).toLocaleDateString()}`,
      `Fecha de Fin: ${new Date(data.FechaFin).toLocaleDateString()}`,
      `Fecha de Creación: ${new Date(data.FechaCreacion).toLocaleDateString()}`,
    ];
    this.guardado = true;
  }

  editarNombre(proceso: any) {
    proceso.editando = !proceso.editando;
  }

  cerrarConfirmacion() {
    this.guardado = false;
  }
}
