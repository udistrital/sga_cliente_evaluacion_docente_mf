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
    tipoReporte: ['', Validators.required],
    periodo: ['', Validators.required] // Campo independiente
  });
  secondFormGroupNivel = this._formBuilder.group({
    nivel: ['', Validators.required]
  });

  // Variables
  isLinear = true;
  showSecondCard = false;
  showChartCard = false;
  single: any[];
  view: [number, number] = [700, 400];
  selectedTipoReporte: string = '';

  // Opciones del gráfico
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: Color = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'], name: '', selectable: true, group: ScaleType.Ordinal };

  periodos = ['2020-1', '2020-2', '2021-1', '2021-2']; 
  proyectos = ['Proyecto 1', 'Proyecto 2', 'Proyecto 3']; 

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
    const tipoReporte = this.firstFormGroup.get('tipoReporte')!.value;
    this.secondFormGroupNivel.reset();
    this.showSecondCard = false;
    this.showChartCard = false;
  }

  continueToSecondCard() {
    if (this.firstFormGroup.valid) {
      this.selectedTipoReporte = this.firstFormGroup.get('tipoReporte')!.value ?? '';
      this.showSecondCard = true;
      this.showChartCard = false;
    }
  }

  generateChart() {
    if (this.secondFormGroupNivel.valid) {
      this.showChartCard = true;
    }
  }
}
