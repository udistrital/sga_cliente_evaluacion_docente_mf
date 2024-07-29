import { Component } from '@angular/core';

@Component({
  selector: 'app-autoevaluacion-ii',
  templateUrl: './autoevaluacion-ii.component.html',
  styleUrls: ['./autoevaluacion-ii.component.scss']
})
export class AutoevaluacionIIComponent {
  showModal = false;

  onContinuar() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirm() {
    // Lógica para confirmar la autoevaluación
    this.closeModal();
  }

  onGenerarSoporte() {
    // Lógica para generar soporte de realización del proceso
  }

  onGuardar() {
    // Lógica para guardar el formulario
  }
}
