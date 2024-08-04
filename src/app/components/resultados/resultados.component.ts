import { Component } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})
export class ResultadosComponent {
  periodos = ['Periodo 1', 'Periodo 2', 'Periodo 3'];
  facultades = ['Facultad 1', 'Facultad 2', 'Facultad 3'];
  proyectos = ['Proyecto 1', 'Proyecto 2', 'Proyecto 3'];
  espaciosAcademicos = ['Espacio 1', 'Espacio 2', 'Espacio 3'];

  multi = [
    {
      name: "Germany",
      series: [
        { name: "2010", value: 7300000 },
        { name: "2011", value: 8940000 }
      ]
    },
    {
      name: "USA",
      series: [
        { name: "2010", value: 7870000 },
        { name: "2011", value: 8270000 }
      ]
    },
    {
      name: "France",
      series: [
        { name: "2010", value: 5000002 },
        { name: "2011", value: 5800000 }
      ]
    }
  ];

  view: [number, number] = [700, 400];

  // Options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Population';
  legendTitle: string = 'Years';

  colorScheme: Color = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'], name: '', selectable: true, group: ScaleType.Ordinal };

  constructor() {}

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
