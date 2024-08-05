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
        const calendarioEvento = {
          Nombre: proceso.nombre,
          Descripcion: `Proceso de ${proceso.nombre}`,
          FechaCreacion: new Date().toISOString(),
          FechaModificacion: new Date().toISOString(),
          FechaInicio: new Date(proceso.fechaInicio).toISOString(),
          FechaFin: new Date(proceso.fechaFin).toISOString(),
          Activo: true,
          DependenciaId: '{}',
          EventoPadreId: null,
          TipoEventoId: this.getTipoEventoId(proceso.nombre),
          UbicacionId: 128056,
          AplicaEdicionActividades: false,
          PosterUrl: 'https://example.com/poster.jpg'
        };

        this.eventosService.post('calendario_evento', calendarioEvento).subscribe(response => {
          this.evaluacionesGuardadas.push(proceso.nombre);
          this.guardado = true;
        }, error => {
          console.error('Error guardando el evento:', error);
        });
      }
    }
  }

  getTipoEventoId(nombre: string): number {
    switch (nombre) {
      case 'Heteroevaluación':
        return 1; // Id ficticio para heteroevaluación
      case 'Autoevaluación estudiantes':
        return 2; // Id ficticio para autoevaluación estudiantes
      case 'Coevaluación I':
        return 3; // Id ficticio para coevaluación I
      case 'Autoevaluación docente':
        return 4; // Id ficticio para autoevaluación docente
      case 'Coevaluación II':
        return 5; // Id ficticio para coevaluación II
      default:
        return 0; // Default case
    }
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.userRoles.includes(role));
  }

  editarNombre(proceso: any) {
    proceso.editando = !proceso.editando;
  }

  cerrarConfirmacion() {
    this.guardado = false;
  }
}
