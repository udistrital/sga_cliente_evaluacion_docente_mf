import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.scss']
})
export class MetricasComponent {
  
  // Formularios
  firstFormGroup = this._formBuilder.group({
    tipoReporte: ['', Validators.required] // Añadido el campo 'tipoReporte'
  });
  secondFormGroupPeriodo = this._formBuilder.group({
    periodo: ['', Validators.required]
  });
  secondFormGroupProyecto = this._formBuilder.group({
    proyecto: ['', Validators.required]
  });
  
  // Variables
  isLinear = true;
  showSecondCard = false;
  showChartCard = false;
  single: any[];
  view: [number, number] = [700, 400]; // Asegurarse de que sea una tupla de dos números
  selectedTipoReporte: string = ''; // Inicializado como una cadena vacía

  // Opciones del gráfico
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: Color = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'], name: '', selectable: true, group: ScaleType.Ordinal };

  periodos = ['2020-1', '2020-2', '2021-1', '2021-2']; // Ejemplo de periodos
  proyectos = ['Proyecto 1', 'Proyecto 2', 'Proyecto 3']; // Ejemplo de proyectos

  constructor(private _formBuilder: FormBuilder) {
    this.single = [
      {
        "name": "Germany",
        "value": 8940000
      },
      {
        "name": "USA",
        "value": 5000000
      },
      {
        "name": "France",
        "value": 7200000
      },
      {
        "name": "UK",
        "value": 6200000
      }
    ];
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onTipoReporteChange() {
    this.showSecondCard = false;
    this.showChartCard = false;
    this.secondFormGroupPeriodo.reset();
    this.secondFormGroupProyecto.reset();
  }

  continueToSecondCard() {
    if (this.firstFormGroup.valid) {
      this.selectedTipoReporte = this.firstFormGroup.get('tipoReporte')!.value ?? ''; // Uso del operador de coalescencia nula
      this.showSecondCard = true;
      this.showChartCard = false; // Resetear la tercera tarjeta al cambiar la segunda
    }
  }

  generateChart() {
    if ((this.selectedTipoReporte === 'periodo' && this.secondFormGroupPeriodo.valid) ||
        (this.selectedTipoReporte === 'proyecto' && this.secondFormGroupProyecto.valid)) {
      this.showChartCard = true;
    }
  }
}
