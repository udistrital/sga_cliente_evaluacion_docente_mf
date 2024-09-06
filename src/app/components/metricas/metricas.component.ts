import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.scss'],
})
export class MetricasComponent implements OnInit {

  // Formularios
  firstFormGroup: FormGroup;
  secondFormGroupNivel: FormGroup;

  // Variables
  isLinear = false;
  showSecondCard = false;
  showChartCard = false;
  single: any[];
  view: [number, number] = [700, 400];
  selectedTipoReporte: string = '';
  showGlobal: boolean = false;
  showFacultad: boolean = false;
  showTipoVinculacionSelect: boolean = false;
  showTipoComponenteSelect: boolean = false;
  showTipoProyectoSelect: boolean = false;
  showTipoDocenteSelect: boolean = false;

  // Opciones del gráfico
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: Color = { domain: ['#4f95b1', '#03678f', '#90c9ff', '#062e67', '#013960'], name: '', selectable: true, group: ScaleType.Ordinal };

  periodos = ['2020-1', '2020-2', '2021-1', '2021-2'];
  tiposVinculacion = ['Tipo 1', 'Tipo 2', 'Tipo 3'];
  tiposProyectos = ['Proyecto 1', 'Proyecto 2', 'Proyecto 3'];
  tiposDocentes = ['Docente 1', 'Docente 2', 'Docente 3'];
  tiposComponentes = ['Componente 1', 'Componente 2', 'Componente 3'];
  facultades = ['Facultad 1', 'Facultad 2', 'Facultad 3'];

  // Opciones de Roles
  roleOptions = [
    { value: 'administradores', label: 'definicion_formularios.administradores' },
    { value: 'docentes', label: 'definicion_formularios.docentes' },
    { value: 'estudiantes', label: 'definicion_formularios.estudiantes' },
    { value: 'docconcejos_curricularesentes', label: 'definicion_formularios.concejos_curriculares' }
  ];

  constructor(private _formBuilder: FormBuilder) {
    // Datos de ejemplo para una evaluación docente
    this.single = [
      { name: 'Satisfacción general', value: 85 },
      { name: 'Claridad en la enseñanza', value: 78 },
      { name: 'Dominio del tema', value: 92 },
      { name: 'Accesibilidad del docente', value: 75 },
      { name: 'Material de apoyo', value: 80 }
    ];

    this.firstFormGroup = this._formBuilder.group({
      periodo: ['', Validators.required],
      tipoReporte: ['', Validators.required]
    });

    this.secondFormGroupNivel = this._formBuilder.group({
      facultad: [''],
      optionProyecto: [false],
      optionVinculacion: [false],
      optionDocente: [false],
      optionComponente: [false],
      tipoProyecto: [{ value: '', disabled: true }],
      tipoVinculacion: [{ value: '', disabled: true }],
      tipoDocente: [{ value: '', disabled: true }],
      tipoComponente: [{ value: '', disabled: true }],
      roles: ['', Validators.required] 
    });

    // Suscripciones a cambios en los campos
    this.secondFormGroupNivel.get('optionProyecto')!.valueChanges.subscribe((checked) => {
      this.showTipoProyectoSelect = checked;
      if (checked) {
        this.secondFormGroupNivel.get('tipoProyecto')!.enable();
      } else {
        this.secondFormGroupNivel.get('tipoProyecto')!.disable();
      }
    });

    this.secondFormGroupNivel.get('optionVinculacion')!.valueChanges.subscribe((checked) => {
      this.showTipoVinculacionSelect = checked;
      if (checked) {
        this.secondFormGroupNivel.get('tipoVinculacion')!.enable();
      } else {
        this.secondFormGroupNivel.get('tipoVinculacion')!.disable();
      }
    });

    this.secondFormGroupNivel.get('optionDocente')!.valueChanges.subscribe((checked) => {
      this.showTipoDocenteSelect = checked;
      if (checked) {
        this.secondFormGroupNivel.get('tipoDocente')!.enable();
      } else {
        this.secondFormGroupNivel.get('tipoDocente')!.disable();
      }
    });

    this.secondFormGroupNivel.get('optionComponente')!.valueChanges.subscribe((checked) => {
      this.showTipoComponenteSelect = checked;
      if (checked) {
        this.secondFormGroupNivel.get('tipoComponente')!.enable();
      } else {
        this.secondFormGroupNivel.get('tipoComponente')!.disable();
      }
    });
  }

  ngOnInit() {}

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
    this.secondFormGroupNivel.reset();
    this.showSecondCard = false;
    this.showChartCard = false;
    this.selectedTipoReporte = this.firstFormGroup.get('tipoReporte')!.value ?? '';
    this.showGlobal = this.selectedTipoReporte === 'global';
    this.showFacultad = this.selectedTipoReporte === 'facultad';
  }

  continueToSecondCard() {
    if (this.firstFormGroup.valid) {
      this.showSecondCard = true;
      this.showChartCard = false;
    }
  }

  generateChart() {
    this.showChartCard = true;
  }

  selectAll(checked: boolean) {
    this.secondFormGroupNivel.patchValue({
      optionProyecto: checked,
      optionVinculacion: checked,
      optionDocente: checked,
      optionComponente: checked
    });
  }
}
