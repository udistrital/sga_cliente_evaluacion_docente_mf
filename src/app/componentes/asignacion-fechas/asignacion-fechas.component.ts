import { Component } from '@angular/core';

@Component({
  selector: 'app-asignacion-fechas',
  templateUrl: './asignacion-fechas.component.html',
  styleUrls: ['./asignacion-fechas.component.scss']
})
export class AsignacionFechasComponent {
  nivelFormacion: string = '';  // Inicializando con un valor por defecto
  niveles: string[] = ['Pregrado', 'Postgrado'];
  procesos: any[] = [
    { nombre: 'Heteroevaluación', fechaInicio: '', fechaFin: '' },
    { nombre: 'Autoevaluación estudiantes', fechaInicio: '', fechaFin: '' },
    { nombre: 'Coevaluación I', fechaInicio: '', fechaFin: '' },
    { nombre: 'Autoevaluación docente', fechaInicio: '', fechaFin: '' },
    { nombre: 'Coevaluación II', fechaInicio: '', fechaFin: '' }
  ];

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
}
