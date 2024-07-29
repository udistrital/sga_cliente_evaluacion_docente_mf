import { Component } from '@angular/core';

@Component({
  selector: 'app-coevaluacion-i',
  templateUrl: './coevaluacion-i.component.html',
  styleUrls: ['./coevaluacion-i.component.scss']
})
export class CoevaluacionIComponent {
  showModal = false;

  onContinuar() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirm() {
    // Lógica para confirmar la coevaluación
    this.closeModal();
  }

  onGenerarSoporte() {
    // Lógica para generar soporte de realización del proceso
  }

  onGuardar() {
    // Lógica para guardar el formulario
  }
}
