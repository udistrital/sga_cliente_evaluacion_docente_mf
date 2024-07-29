import { Component } from '@angular/core';

@Component({
  selector: 'app-coevaluacion-ii',
  templateUrl: './coevaluacion-ii.component.html',
  styleUrls: ['./coevaluacion-ii.component.scss']
})
export class CoevaluacionIIComponent {
  showModal = false;

  onGenerarSoporte() {
    // Lógica para generar soporte de realización del proceso
  }

  onGuardar() {
    // Lógica para guardar el formulario
  }

  closeModal() {
    this.showModal = false;
  }

  confirm() {
    // Lógica para confirmar la coevaluación
    this.closeModal();
  }
}
