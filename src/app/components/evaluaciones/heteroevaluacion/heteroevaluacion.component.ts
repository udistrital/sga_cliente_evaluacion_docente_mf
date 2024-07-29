import { Component } from '@angular/core';

@Component({
  selector: 'app-heteroevaluacion',
  templateUrl: './heteroevaluacion.component.html',
  styleUrls: ['./heteroevaluacion.component.scss']
})
export class HeteroevaluacionComponent {
  showModal = false;

  onGuardar() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirm() {
    // Lógica para confirmar la heteroevaluación
    this.closeModal();
  }
}
