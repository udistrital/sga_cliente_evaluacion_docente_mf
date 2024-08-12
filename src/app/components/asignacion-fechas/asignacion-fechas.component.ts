import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';
import { EventosService } from 'src/app/services/eventos.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import { PopUpManager } from 'src/app/managers/popUpManager';

@Component({
  selector: 'app-asignacion-fechas',
  templateUrl: './asignacion-fechas.component.html',
  styleUrls: ['./asignacion-fechas.component.scss']
})
export class AsignacionFechasComponent implements OnInit {
  nivelFormacion: string = '';
  periodoFormacion: string = '';
  niveles: string[] = ['Pregrado', 'Postgrado'];
  periodos: any[] = [
    { Id: '1', Nombre: 'Semestre 1 - 2024' },
    { Id: '2', Nombre: 'Semestre 2 - 2024' }
  ];

  procesos: any[] = [
    { nombre: 'Heteroevaluación', fechaInicio: '', fechaFin: '', editando: false, showIcon: false },
    { nombre: 'Autoevaluación estudiantes', fechaInicio: '', fechaFin: '', editando: false, showIcon: false },
    { nombre: 'Coevaluación I', fechaInicio: '', fechaFin: '', editando: false, showIcon: false },
    { nombre: 'Autoevaluación docente', fechaInicio: '', fechaFin: '', editando: false, showIcon: false },
    { nombre: 'Coevaluación II', fechaInicio: '', fechaFin: '', editando: false, showIcon: false }
  ];

  userRoles: string[] = [];
  ROLES = ROLES;
  guardado: boolean = false;
  evaluacionesGuardadas: string[] = [];
  mensajeError: string = '';
  evaluaciones: any[] = [];

  constructor(
    private userService: UserService,
    private eventosService: EventosService,
    private parametrosService: ParametrosService,
    private popUpManager: PopUpManager
  ) {}

  ngOnInit(): void {
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
    });
    this.obtenerPeriodosActivos();
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.userRoles.includes(role));
  }

  validarFechas(proceso: any) {
    const fechaInicio = new Date(proceso.fechaInicio);
    const fechaFin = new Date(proceso.fechaFin);

    if (proceso.fechaInicio === '' || proceso.fechaFin === '') {
      return;
    }

    if (fechaInicio.getTime() === fechaFin.getTime()) {
      this.popUpManager.showErrorAlert('La fecha de inicio y la fecha de fin no pueden ser iguales');
      proceso.fechaFin = '';
      return;
    }

    if (fechaInicio > fechaFin) {
      this.popUpManager.showErrorAlert('La fecha de inicio no puede ser posterior a la fecha de fin');
      proceso.fechaFin = '';
      return;
    }

    if (fechaFin < fechaInicio) {
      this.popUpManager.showErrorAlert('La fecha de fin no puede ser anterior a la fecha de inicio');
      proceso.fechaFin = '';
      return;
    }
  }

  obtenerPeriodosActivos() {
    this.parametrosService.get('periodo?activo=true').subscribe(
      response => {
        this.periodos = response.length ? response : this.periodos;
      },
      error => {
        console.error('Error obteniendo periodos activos:', error);
        this.mensajeError = 'Error obteniendo periodos activos: ' + error.message;
      }
    );
  }

  // Se comenta la validación de existencia de evaluación
  /* 
  validarExistenciaEvaluacion(proceso: any, descripcion: string, callback: (exists: boolean, data?: any) => void) {
    this.eventosService.get(`calendario_evento?query=Descripcion:${descripcion},Activo:true`)
      .subscribe(response => {
        if (response && response.length > 0) {
          callback(true, response[0]);
        } else {
          callback(false);
        }
      }, error => {
        console.error('Error validando la existencia de la evaluación:', error);
        this.mensajeError = 'Error validando la existencia de la evaluación: ' + error.message;
        callback(false);
      });
  }
  */

  guardar() {
    if (!this.nivelFormacion || !this.periodoFormacion) {
      this.mensajeError = 'Debe seleccionar el nivel de formación y el período antes de guardar.';
      return;
    }

    this.guardado = false;
    this.evaluacionesGuardadas = [];

    let descripcionIndex = 1;

    for (let proceso of this.procesos) {
      if (proceso.fechaInicio && proceso.fechaFin) {
        // Se comenta la parte del GET y PUT
        /*
        const descripcion = `Evaluación ${descripcionIndex}`;

        this.validarExistenciaEvaluacion(proceso, descripcion, (exists, data) => {
          if (exists) {
            this.popUpManager.showConfirmAlert(
              `La evaluación "${proceso.nombre}" ya fue creada con la descripción "${descripcion}".\n` +
              `Fecha de Inicio: ${new Date(data.FechaInicio).toLocaleDateString()}\n` +
              `Fecha de Fin: ${new Date(data.FechaFin).toLocaleDateString()}\n` +
              `¿Desea continuar con el cambio de fechas?`
            ).then((result) => {
              if (result.isConfirmed) {
                this.actualizarEvaluacion(proceso, data.Id);
              } else {
                this.mensajeError = `El proceso de actualización fue cancelado para la evaluación "${proceso.nombre}".`;
              }
            });
          } else {
            this.crearNuevaEvaluacion(proceso, descripcionIndex);
          }
        });
        */

        // Se realiza solo el POST
        this.crearNuevaEvaluacion(proceso, descripcionIndex);

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
              Nombre: "",
              Descripcion: "",
              CodigoAbreviacion: "",
              Activo: false,
              FechaCreacion: "",
              FechaModificacion: ""
          },
          CalendarioID: {
              Id: 120,
              Nombre: "",
              Descripcion: "",
              DependenciaId: "",
              DocumentoId: 0,
              PeriodoId: 0,
              AplicacionId: 0,
              Nivel: 0,
              Activo: false,
              FechaCreacion: "",
              FechaModificacion: "",
              CalendarioPadreId: null,
              DocumentoExtensionId: 0,
              AplicaExtension: false,
              DependenciaParticularId: "",
              MultiplePeriodoId: ""
          }
      },
      UbicacionId: 0, 
      AplicaEdicionActividades: false,
      PosterUrl: "https://example.com/poster.jpg"
    };

    this.eventosService.post('calendario_evento', calendarioEvento).subscribe(response => {
      this.evaluacionesGuardadas.push(proceso.nombre);
      this.guardado = true;
      this.popUpManager.showSuccessAlert(`Evaluación "${proceso.nombre}" creada con éxito.`);
    }, error => {
      console.error('Error guardando el evento:', error);
      this.mensajeError = 'Error guardando el evento: ' + error.message;
    });
  }

  // Se comenta el método de actualización de evaluación
  /*
  actualizarEvaluacion(proceso: any, id: number) {
    const calendarioEvento = {
      Id: id,
      Nombre: proceso.nombre,
      Descripcion: `Evaluación Actualizada`,
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
          Nombre: "",
          Descripcion: "",
          CodigoAbreviacion: "",
          Activo: false,
          FechaCreacion: "",
          FechaModificacion: ""
        },
        CalendarioID: {
          Id: 120,
          Nombre: "",
          Descripcion: "",
          DependenciaId: "",
          DocumentoId: 0,
          PeriodoId: 0,
          AplicacionId: 0,
          Nivel: 0,
          Activo: false,
          FechaCreacion: "",
          FechaModificacion: "",
          CalendarioPadreId: null,
          DocumentoExtensionId: 0,
          AplicaExtension: false,
          DependenciaParticularId: "",
          MultiplePeriodoId: ""
        }
      },
      UbicacionId: null,
      AplicaEdicionActividades: false,
      PosterUrl: "https://example.com/poster.jpg"
    };

    this.eventosService.put(`calendario_evento/${id}`, calendarioEvento).subscribe(response => {
      this.evaluacionesGuardadas.push(proceso.nombre);
      this.guardado = true;
      this.popUpManager.showSuccessAlert(`Evaluación "${proceso.nombre}" actualizada con éxito.`);
    }, error => {
      console.error('Error actualizando el evento:', error);
      this.mensajeError = 'Error actualizando el evento: ' + error.message;
    });
  }
  */

  editarNombre(proceso: any) {
    proceso.editando = !proceso.editando;
  }

  cerrarConfirmacion() {
    this.guardado = false;
  }
}
