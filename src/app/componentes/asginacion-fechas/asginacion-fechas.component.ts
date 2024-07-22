import { Component } from '@angular/core';

@Component({
  selector: 'app-asignacion-fechas',
  templateUrl: './asignacion-fechas.component.html',
  styleUrls: ['./asignacion-fechas.component.scss']
})
export class AsignacionFechasComponent {
  nivelFormacion: string = '';  // Inicializando con un valor por defecto
  niveles: string[] = ['Nivel 1', 'Nivel 2', 'Nivel 3'];
  procesos: any[] = [
    { nombre: 'Heteroevaluación', fechaInicio: '', fechaFin: '' },
    { nombre: 'Autoevaluación I', fechaInicio: '', fechaFin: '' },
    { nombre: 'Coevaluación I', fechaInicio: '', fechaFin: '' },
    { nombre: 'Autoevaluación II', fechaInicio: '', fechaFin: '' },
    { nombre: 'Coevaluación II', fechaInicio: '', fechaFin: '' }
  ];

  validarFechas(proceso: any) {
    const fechaInicio = new Date(proceso.fechaInicio);
    const fechaFin = new Date(proceso.fechaFin);

    if (fechaInicio >= fechaFin) {
      alert('La fecha de inicio no puede ser mayor o igual a la fecha de fin');
      proceso.fechaFin = '';
    }
  }

  guardar() {
    // Lógica para guardar las fechas asignadas
    console.log('Fechas guardadas:', this.procesos);
  }
}
