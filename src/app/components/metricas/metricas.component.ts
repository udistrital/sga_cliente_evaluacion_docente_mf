import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Periodo } from "../../models/periodo";
import { ParametrosService } from 'src/app/services/parametros.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { ProyectoAcademicoService } from '../../services/proyecto_academico.service';
import { checkContent } from 'src/app/utils/verify-response';
import { OikosService } from 'src/app/services/oikos.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  periodos: Periodo[] = []; // Inicializado como un array vacío
  periodo: Periodo = new Periodo({}); // Inicializar el objeto periodo
  periodosAnteriores: Periodo[] = [];
  mostrarSelectsAdicionales: boolean = false;
  facultad = [];
  proyectos: { select: any, opciones: any[] } = { select: undefined, opciones: [] };

  // Opciones del gráfico
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: Color = { domain: ['#4f95b1', '#03678f', '#90c9ff', '#062e67', '#013960'], name: '', selectable: true, group: ScaleType.Ordinal };

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
    { value: 'concejos_curriculares', label: 'definicion_formularios.concejos_curriculares' }
  ];

  // Snack-bar Position Variables
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  translate: any;

  constructor(
    private _formBuilder: FormBuilder,
    private parametrosService: ParametrosService,
    private _snackBar: MatSnackBar,
    private oikosService: OikosService,
    private proyectoAcademicoService: ProyectoAcademicoService) {
    // Datos de ejemplo para una evaluación docente
    this.single = [
      { name: 'Satisfacción general', value: 85 },
      { name: 'Claridad en la enseñanza', value: 78 },
      { name: 'Dominio del tema', value: 92 },
      { name: 'Accesibilidad del docente', value: 75 },
      { name: 'Material de apoyo', value: 80 }
    ];

    this.firstFormGroup = this._formBuilder.group({
      periodos: ['', Validators.required],
      tipoReporte: ['', Validators.required]
    });

    this.secondFormGroupNivel = this._formBuilder.group({
      facultad: ['', Validators.required],
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

    // Suscripciones a cambios en los campos
    this.secondFormGroupNivel.get('facultad')!.valueChanges.subscribe((facultad) => {
      if (facultad) {
        this.loadProyectos();  // Carga proyectos cuando se selecciona una facultad
        this.mostrarSelectsAdicionales = true;
      } else {
        this.mostrarSelectsAdicionales = false;
      }
    });
  }

  ngOnInit() {
    this.loadProyectos(); // Carga inicial de proyectos
    this.loadfacultad();
    this.cargarPeriodos()
      .then((resp) => (this.periodos = resp))
      .catch((err) => {
        console.error("Error al cargar periodos:", err);
        this.periodos = [];
      });

    this.setupDynamicSelectors();  // Agregamos la configuración de los selectores dinámicos
  }

  setupDynamicSelectors() {
    // Aquí suscribimos a los cambios de selección de facultad o algún otro campo relevante
    this.secondFormGroupNivel.get('facultad')!.valueChanges.subscribe((facultad) => {
      if (facultad) {
        this.mostrarSelectsAdicionales = true;  // Muestra los selectores adicionales si hay una facultad seleccionada
      } else {
        this.mostrarSelectsAdicionales = false; // Oculta los selectores adicionales si no hay facultad
      }
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

  onTipoReporteChange() {
    this.secondFormGroupNivel.reset();
    this.showSecondCard = false;
    this.showChartCard = false;
    this.selectedTipoReporte = this.firstFormGroup.get('tipoReporte')!.value ?? '';
    this.showGlobal = this.selectedTipoReporte === 'global';
    this.showFacultad = this.selectedTipoReporte === 'facultad';
  }

  cargarPeriodos(): Promise<Periodo[]> {
    return new Promise((resolve, reject) => {
      this.parametrosService
        .get("periodo?query=CodigoAbreviacion:PA&sortby=Id&order=desc&limit=0")
        .subscribe({
          next: (resp: { Data: Periodo[]; }) => {
            if (resp && resp.Data) {
              resolve(resp.Data as Periodo[]);
            } else {
              reject(new Error("No se encontraron periodos"));
            }
          },
          error: (err: any) => {
            reject(err);
          },
        });
    });
  }

  cargarPeriodosAnteriores(periodo: Periodo) {
    this.periodosAnteriores = this.periodos.filter((porPeriodo) => {
      return porPeriodo.Year <= periodo.Year &&
        porPeriodo.Id < periodo.Id &&
        porPeriodo.Nombre < periodo.Nombre;
    });
  }

  selectPeriodo(event: any) {
    this.periodo = event.value;
    if (this.periodo.Id) {
      this.cargarPeriodosAnteriores(this.periodo);
    } else {
      this.periodosAnteriores = [];
    }
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

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['custom-snackbar'],
      duration: 2000
    });
  }

  onTipoReporteChange2(event: MatSelectChange) {
    if (event.value === 'facultad') {
      this.mostrarSelectsAdicionales = true;
    } else {
      this.mostrarSelectsAdicionales = false;
    }
  }
  
  loadProyectos(): void {
    this.proyectoAcademicoService.get('proyecto_academico_institucion?query=Activo:true&sortby=Nombre&order=asc&limit=0')
      .subscribe({
        next: (resp) => {
          if (checkContent(resp)) {
            this.proyectos.opciones = resp;
          } else {
            console.error('No se encontraron proyectos');
          }
        },
        error: (err) => {
          console.error('Error al cargar proyectos:', err);
        }
      });
  }

  onProyectoSelection(event: MatSelectChange): void {
    const facultadSeleccionada = event.value;
    if (facultadSeleccionada) {
      this.openSnackBar(`Proyecto seleccionado: ${facultadSeleccionada.Nombre}`);
    }
  }

  onFacultadSelection(event: MatSelectChange): void {
    const proyectoSeleccionado = event.value;
    if (proyectoSeleccionado) {
      this.openSnackBar(`Facultad seleccionada: ${proyectoSeleccionado.Nombre}`);
    }
  }

  loadfacultad() {
    this.oikosService.get('dependencia_tipo_dependencia/?query=TipoDependenciaId:2')
      .subscribe((res: any) => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.facultad = res.map((data: any) => (data.DependenciaId));
        }
      },
        (error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: error.status + '',
            text: this.translate.instant('ERROR.' + error.status),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        });
  }




}