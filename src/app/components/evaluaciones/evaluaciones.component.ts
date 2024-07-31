import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html',
  styleUrls: ['./evaluaciones.component.scss']
})
export class EvaluacionesComponent {
  showTerms = false;
  selectedEvaluation = '';
  showModal = false;

  toggleTerms() {
    this.showTerms = !this.showTerms;
  }

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedEvaluation = selectElement.value;
  }

  onGuardar() {
    // Implementa la lógica para guardar la evaluación aquí
    console.log(`Guardando ${this.selectedEvaluation}`);
  }

  onGenerarSoporte() {
    // Implementa la lógica para generar el soporte aquí
    console.log(`Generando soporte para ${this.selectedEvaluation}`);
  }

  onContinuar() {
    // Implementa la lógica para continuar con el proceso aquí
    console.log(`Continuando con ${this.selectedEvaluation}`);
  }

  confirm() {
    // Implementa la lógica para confirmar la acción aquí
    console.log(`Confirmando ${this.selectedEvaluation}`);
    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
  }

  openModal() {
    this.showModal = true;
  }
}
