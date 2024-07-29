import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html',
  styleUrls: ['./evaluaciones.component.scss']
})
export class EvaluacionesComponent {
  showTerms = false;
  selectedEvaluation = '';

  toggleTerms() {
    this.showTerms = !this.showTerms;
  }

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedEvaluation = selectElement.value;
  }
}
