import { Component, NgModule } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.scss']
})
export class MetricasComponent {

  // Validadores
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  // Variables
  isLinear = true;

  single: any[] = [
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
  view: [number, number] = [700, 400]; // Asegúrate de que sea [number, number]

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  // Datos quemados temporalmente
  periodos = ['Periodo 1', 'Periodo 2', 'Periodo 3'];
  facultades = ['Facultad 1', 'Facultad 2', 'Facultad 3'];
  proyectos = ['Proyecto 1', 'Proyecto 2', 'Proyecto 3'];

  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      periodo: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      facultad: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      proyecto: ['', Validators.required]
    });
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
  cargarDatos(){
    this.single = [
      {
        "name": "Ingeniería",
        "value": 8940000
      },
      {
        "name": "ASAB",
        "value": 5000000
      },
      {
        "name": "Ciencias",
        "value": 7200000
      },
      {
        "name": "Tecnológica",
        "value": 6200000
      }
    ];
  }
}