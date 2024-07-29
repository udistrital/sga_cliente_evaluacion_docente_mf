import { Component } from '@angular/core';

@Component({
  selector: 'app-autoevaluacion-i',
  templateUrl: './autoevaluacion-i.component.html',
  styleUrls: ['./autoevaluacion-i.component.scss']
})
export class AutoevaluacionIComponent {

  onGuardar() {
    // Lógica para guardar el formulario
    console.log("Formulario guardado");
  }
}
