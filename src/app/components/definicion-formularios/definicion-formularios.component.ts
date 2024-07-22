import { Component } from '@angular/core';

@Component({
  selector: 'app-definicion-formularios',
  templateUrl: './definicion-formularios.component.html',
  styleUrls: ['./definicion-formularios.component.scss']
})
export class DefinicionFormulariosComponent {
  selectedProcess: string = '';
  procesos: any[] = [
    { nombre: 'Heteroevaluación', icon: 'assessment' },
    { nombre: 'Autoevaluación estudiantes', icon: 'self_improvement' },
    { nombre: 'Coevaluación I', icon: 'people' },
    { nombre: 'Autoevaluación docente', icon: 'school' },
    { nombre: 'Coevaluación II', icon: 'group' }
  ];

  selectProcess(proceso: string) {
    this.selectedProcess = proceso;
  }

  guardar() {
    console.log('Los ajustes fueron aplicados');
  }
}
