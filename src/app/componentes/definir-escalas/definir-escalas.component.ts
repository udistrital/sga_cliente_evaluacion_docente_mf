import { Component } from '@angular/core';

@Component({
  selector: 'app-definir-escalas',
  templateUrl: './definir-escalas.component.html',
  styleUrls: ['./definir-escalas.component.scss']
})
export class DefinirEscalasComponent {
  tipoEscala: string = '';
  descripcion: string = '';
  escalas: any[] = [];

  cualitativaEscalas = [
    { label: 'INSUFICIENTE', descripcion: 'No sucede y no se demuestra el criterio' },
    { label: 'NECESITA MEJORAR', descripcion: 'Sucede parcialmente pero no se demuestra el criterio' },
    { label: 'BUENO', descripcion: 'Sucede con frecuencia y se demuestra el criterio en un nivel básico' },
    { label: 'SOBRESALIENTE', descripcion: 'Sucede la mayor parte del tiempo y se demuestra el criterio de forma adecuada' },
    { label: 'EXCELENTE', descripcion: 'Sucede siempre y se demuestra el criterio completamente' }
  ];

  cuantitativaEscalas = [
    { label: 'INSUFICIENTE', descripcion: '1' },
    { label: 'NECESITA MEJORAR', descripcion: '2' },
    { label: 'BUENO', descripcion: '3' },
    { label: 'SOBRESALIENTE', descripcion: '4' },
    { label: 'EXCELENTE', descripcion: '5' }
  ];

  onChangeTipoEscala() {
    if (this.tipoEscala === 'cualitativa') {
      this.descripcion = 'Escala cualitativa del SEUD';
      this.escalas = [...this.cualitativaEscalas];
    } else if (this.tipoEscala === 'cuantitativa') {
      this.descripcion = 'Escala cuantitativa del SEUD';
      this.escalas = [...this.cuantitativaEscalas];
    }
  }

  agregarEscala() {
    this.escalas.push({ label: 'Nuevo', descripcion: 'Un dato más' });
  }
}
