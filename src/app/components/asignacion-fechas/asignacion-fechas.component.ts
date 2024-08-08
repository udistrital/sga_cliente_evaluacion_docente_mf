import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-asignacion-fechas',
  templateUrl: './asignacion-fechas.component.html',
  styleUrls: ['./asignacion-fechas.component.scss']
})
export class AsignacionFechasComponent implements OnInit {
  nivelFormacion: string = '';
  periodoFormacion: string = '';
  niveles: string[] = ['Pregrado', 'Postgrado'];
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

  constructor(private userService: UserService, private eventosService: EventosService) {}

  ngOnInit(): void {
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
    });
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
      alert('La fecha de inicio y la fecha de fin no pueden ser iguales');
      proceso.fechaFin = '';
      return;
    }

    if (fechaInicio > fechaFin) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin');
      proceso.fechaFin = '';
      return;
    }

    if (fechaFin < fechaInicio) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio');
      proceso.fechaFin = '';
      return;
    }
  }

  guardar() {
    if (!this.nivelFormacion || !this.periodoFormacion) {
      this.mensajeError = 'Debe seleccionar el nivel de formación y el período antes de guardar.';
      return;
    }

    this.guardado = false;
    this.evaluacionesGuardadas = [];

    for (let proceso of this.procesos) {
      if (proceso.fechaInicio && proceso.fechaFin) {
        const calendarioEventoTipoPublico = {
          FechaInicio: new Date(proceso.fechaInicio).toISOString(),
          FechaFin: new Date(proceso.fechaFin).toISOString(),
          Nombre: proceso.nombre,
          CalendarioEventoId: {
            Id: 291,
            Nombre: "Evaluación Docente 2024",
            Descripcion: "Evaluaciones de docentes para el año 2024",
            FechaCreacion: "2000-01-01T00:00:00Z",
            FechaModificacion: "2000-01-01T00:00:00Z",
            FechaInicio: "2000-01-01T00:00:00Z",
            FechaFin: "2000-12-31T23:59:59Z",
            Activo: true,
            DependenciaId: "{}",
            EventoPadreId: null,
            TipoEventoId: {
              Id: 202,
              Nombre: "Evaluaciones Docente",
              Descripcion: "Evaluaciones realizadas por los docentes",
              CodigoAbreviacion: "EVAL_DOC",
              Activo: true,
              FechaCreacion: "2024-08-05 07:11:43.173984 +0000 +0000",
              FechaModificacion: "2024-08-05 07:11:43.174154 +0000 +0000",
              TipoRecurrenciaId: {
                Id: 7,
                Nombre: "Semestral",
                Descripcion: "Evaluaciones semestrales",
                CodigoAbreviacion: "ANUAL",
                Activo: true,
                FechaCreacion: null,
                FechaModificacion: null
              },
              CalendarioID: {
                Id: 120,
                Nombre: "Calendario Evaluaciones Docente 2024",
                Descripcion: "Calendario de Evaluaciones Docente 2024",
                DependenciaId: "{}",
                DocumentoId: 146529,
                PeriodoId: 6,
                AplicacionId: 0,
                Nivel: 1,
                Activo: true,
                FechaCreacion: "2024-08-05 06:53:01.546904 +0000 +0000",
                FechaModificacion: "2024-08-05 06:53:01.547005 +0000 +0000",
                CalendarioPadreId: {
                  Id: 30,
                  Nombre: "Calendario Académico 2019-3 Pregrado",
                  Descripcion: "",
                  DependenciaId: "{\"proyectos\": [24, 23, 8]}",
                  DocumentoId: 146529,
                  PeriodoId: 6,
                  AplicacionId: 0,
                  Nivel: 1,
                  Activo: false,
                  FechaCreacion: "2022-06-20 00:02:17.078301 +0000 +0000",
                  FechaModificacion: "2023-10-17 21:05:43.155863 +0000 +0000",
                  CalendarioPadreId: {
                    Id: 15,
                    Nombre: "Calendario Académico 2019-3 Pregrado",
                    Descripcion: "",
                    DependenciaId: "{}",
                    DocumentoId: 145095,
                    PeriodoId: 6,
                    AplicacionId: 0,
                    Nivel: 1,
                    Activo: false,
                    FechaCreacion: "2022-04-29 12:30:13.825713 +0000 +0000",
                    FechaModificacion: "2024-03-11 08:13:08.848756 +0000 +0000",
                    CalendarioPadreId: null,
                    DocumentoExtensionId: 0,
                    AplicaExtension: false,
                    DependenciaParticularId: "{}",
                    MultiplePeriodoId: ""
                  },
                  DocumentoExtensionId: 0,
                  AplicaExtension: false,
                  DependenciaParticularId: "{}",
                  MultiplePeriodoId: ""
                },
                DocumentoExtensionId: 146537,
                AplicaExtension: true,
                DependenciaParticularId: "{\"proyectos\":[24,8]}",
                MultiplePeriodoId: ""
              }
            },
            UbicacionId: 128056,
            AplicaEdicionActividades: false,
            PosterUrl: "https://example.com/poster.jpg"
          },
          TipoPublicoId: {
            Id: 1,
            Nombre: "Estudiantes",
            CodigoAbreviacion: "EST",
            Activo: false,
            NumeroOrden: 1,
            FechaCreacion: "2020-11-14 00:00:00 +0000 +0000",
            FechaModificacion: "2023-10-17 21:08:08.225441 +0000 +0000"
          }
        };

        this.eventosService.post('calendario_evento_tipo_publico', calendarioEventoTipoPublico).subscribe(response => {
          this.evaluacionesGuardadas.push(proceso.nombre);
          this.guardado = true;
        }, error => {
          console.error('Error guardando el evento:', error);
          this.mensajeError = 'Error guardando el evento: ' + error.message;
        });
      }
    }
  }

  editarNombre(proceso: any) {
    proceso.editando = !proceso.editando;
  }

  cerrarConfirmacion() {
    this.guardado = false;
  }
}
