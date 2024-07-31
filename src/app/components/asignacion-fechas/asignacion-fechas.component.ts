import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-asignacion-fechas',
  templateUrl: './asignacion-fechas.component.html',
  styleUrls: ['./asignacion-fechas.component.scss']
})
export class AsignacionFechasComponent implements OnInit {
  nivelFormacion: string = '';  // Inicializando con un valor por defecto
  niveles: string[] = ['Pregrado', 'Postgrado'];
  procesos: any[] = [
    { nombre: 'Heteroevaluación', fechaInicio: '', fechaFin: '' },
    { nombre: 'Autoevaluación estudiantes', fechaInicio: '', fechaFin: '' },
    { nombre: 'Coevaluación I', fechaInicio: '', fechaFin: '' },
    { nombre: 'Autoevaluación docente', fechaInicio: '', fechaFin: '' },
    { nombre: 'Coevaluación II', fechaInicio: '', fechaFin: '' }
  ];
  userRoles: string[] = [];
  ROLES = ROLES;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
    });
  }

  validarFechas(proceso: any) {
    const fechaInicio = new Date(proceso.fechaInicio);
    const fechaFin = new Date(proceso.fechaFin);

    if (proceso.fechaInicio === '' || proceso.fechaFin === '') {
      return; // Si una de las fechas está vacía, no hacer validación.
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
    // Lógica para guardar las fechas asignadas
    console.log('Fechas guardadas:', this.procesos);
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.userRoles.includes(role));
  }
}
