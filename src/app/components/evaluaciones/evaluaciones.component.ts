import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';
import { MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html',
  styleUrls: ['./evaluaciones.component.scss']
})
export class EvaluacionesComponent implements OnInit {
  showTerms = false;
  selectedEvaluation = '';
  showModal = false;
  userRoles: string[] = [];
  ROLES = ROLES;
  showDynamicForm = false;
  formData: any = {}; 
  heteroForm: FormGroup;
  coevaluacionIIForm: FormGroup;
  coevaluacionIForm: FormGroup;
  autoevaluacionIIForm: FormGroup;
  autoevaluacionIForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.heteroForm = this.fb.group({});
    this.coevaluacionIIForm = this.fb.group({});
    this.coevaluacionIForm = this.fb.group({});
    this.autoevaluacionIIForm = this.fb.group({});
    this.autoevaluacionIForm = this.fb.group({});
  }

  ngOnInit(): void {
    console.log('DynamicFormComponent initialized with formData:', this.formData);
    this.initializeForms();

    // Obtener los roles del usuario
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
    });
  }

  initializeForms(): void {
    this.heteroForm = this.fb.group({
      inicioFecha: ['', Validators.required],
      finFecha: ['', Validators.required],
      estudianteNombre: ['', Validators.required],
      estudianteIdentificacion: ['', Validators.required],
      proyectoCurricular: ['', Validators.required],
      docenteNombre: ['', Validators.required],
      descripcionProceso: ['', Validators.required]
    });

    this.coevaluacionIIForm = this.fb.group({
      inicioFecha: ['', Validators.required],
      finFecha: ['', Validators.required],
      proyectoCurricular: ['', Validators.required],
      docenteNombre: ['', Validators.required],
      descripcionProceso: ['', Validators.required]
    });

    this.coevaluacionIForm = this.fb.group({
      inicioFecha: ['', Validators.required],
      finFecha: ['', Validators.required],
      proyectoCurricular: ['', Validators.required],
      espacioAcademico: ['', Validators.required],
      docenteNombre: ['', Validators.required],
      grupoSeleccionado: ['', Validators.required],
      descripcionProceso: ['', Validators.required]
    });

    this.autoevaluacionIIForm = this.fb.group({
      inicioFecha: ['', Validators.required],
      finFecha: ['', Validators.required],
      docenteNombre: ['', Validators.required],
      docenteIdentificacion: ['', Validators.required],
      proyectoCurricular: ['', Validators.required],
      proyectoCurricular2: ['', Validators.required],
      proyectoCurricularN: ['', Validators.required],
      espacioAcademico: ['', Validators.required],
      espacioAcademico2: ['', Validators.required],
      espacioAcademicoN: ['', Validators.required],
      descripcionProceso: ['', Validators.required]
    });

    this.autoevaluacionIForm = this.fb.group({
      inicioFecha: ['', Validators.required],
      finFecha: ['', Validators.required],
      estudianteNombre: ['', Validators.required],
      estudianteIdentificacion: ['', Validators.required],
      proyectoCurricular: ['', Validators.required],
      proyectoCurricular2: ['', Validators.required],
      descripcionProceso: ['', Validators.required],
      formularioProceso: ['', Validators.required]
    });
  }

  onSelectChange(event: MatSelectChange) {
    console.log('Selected evaluation:', this.selectedEvaluation);
    this.selectedEvaluation = event.value;
    this.showDynamicForm = true;

    if (this.selectedEvaluation === 'heteroevaluacion') {
        this.formData = {
            tipo_formulario: 'mini',
            titulo: 'Evaluación de Heteroevaluación',
            formato: 'Código SIGUD por asignar',
            actor: 'Estudiantes',
            cronograma: 'Semana 4 a 7 del calendario académico',
            rubricas: 'Selección múltiple',
            instruccion: 'Estimado estudiante: Por favor evalúe formativamente a su docente utilizando el formato dispuesto para ello. Los ítems 01 a 20 de selección múltiple con única respuesta son obligatorios. Puede realizar anotaciones de felicitación o de sugerencias respetuosas en los espacios destinados para tal fin. Utilice como referencia la siguiente escala para medir el grado de desempeño a evaluar:',
            escalas: [
                { label: 'INSUFICIENTE', descripcion: 'No sucede y no se demuestra el criterio' },
                { label: 'NECESITA MEJORAR', descripcion: 'Sucede parcialmente pero no se demuestra el criterio' },
                { label: 'BUENO', descripcion: 'Sucede con frecuencia y se demuestra el criterio en un nivel básico' },
                { label: 'SOBRESALIENTE', descripcion: 'Sucede la mayor parte del tiempo y se demuestra el criterio de forma adecuada' },
                { label: 'EXCELENTE', descripcion: 'Sucede siempre y se demuestra el criterio completamente' }
            ],
            comentariosLabel: 'Dado los ítems anteriores, quisiera felicitarlo o sugerirle respetuosamente lo siguiente:',
            comentariosControl: 'comentarios',
            comentariosPlaceholder: 'Ingrese sus comentarios aquí...',
            campos: [
                { nombre: 'item1', label: '01. Demuestra conocimiento de los contenidos que se van a enseñar en mi espacio curricular' },
                { nombre: 'item2', label: '02. Demuestra habilidades para conducir procesos de enseñanza-aprendizaje según los contenidos de mi espacio curricular' },
                { nombre: 'item3', label: '03. Demuestra comprensión de ritmos de aprendizaje diferenciados y adapta el aula de clase a estas necesidades' },
                { nombre: 'item4', label: '04. Demuestra habilidades para organizar y explicar ideas' },
                { nombre: 'item5', label: '05. Demuestra habilidades para observar su aula, diagnosticar necesidades y adaptarse al contexto' }
            ],
            btn: 'Guardar',
            btnLimpiar: 'Limpiar'
        };
    }

    console.log('formData:', this.formData);
}

  handleFormResult(result: any) {
    console.log('Resultados del formulario dinámico:', result);
    // Aquí puedes manejar los datos resultantes del formulario dinámico
  }

  setHeteroevaluacionData() {
    this.heteroForm.patchValue({
      inicioFecha: moment('2024-01-15', 'YYYY-MM-DD').format('DD/MM/YYYY'),
      finFecha: moment('2024-05-30', 'YYYY-MM-DD').format('DD/MM/YYYY'),
      estudianteNombre: 'Estudiante Heteroevaluación',
      estudianteIdentificacion: '123456789H',
      proyectoCurricular: 'proyecto1',
      docenteNombre: 'Docente Heteroevaluación',
      descripcionProceso: 'Descripción del proceso de Heteroevaluación.'
    });
  }

  setCoevaluacionIData() {
    this.coevaluacionIForm.patchValue({
      inicioFecha: moment('2024-02-01', 'YYYY-MM-DD').format('DD/MM/YYYY'),
      finFecha: moment('2024-06-15', 'YYYY-MM-DD').format('DD/MM/YYYY'),
      proyectoCurricular: 'proyecto2',
      docenteNombre: 'Docente Coevaluación I',
      descripcionProceso: 'Descripción del proceso de Coevaluación I.',
      espacioAcademico: 'Espacio Académico Coevaluación I',
      grupoSeleccionado: 'grupo2'
    });
  }

  setCoevaluacionIIData() {
    this.coevaluacionIIForm.patchValue({
      inicioFecha: moment('2024-03-01', 'YYYY-MM-DD').format('DD/MM/YYYY'),
      finFecha: moment('2024-07-01', 'YYYY-MM-DD').format('DD/MM/YYYY'),
      proyectoCurricular: 'proyecto1',
      docenteNombre: 'Docente Coevaluación II',
      descripcionProceso: 'Descripción del proceso de Coevaluación II.',
      espacioAcademico: 'Espacio Académico Coevaluación II'
    });
  }

  setAutoevaluacionIData() {
    this.autoevaluacionIForm.patchValue({
      inicioFecha: moment('2024-04-01', 'YYYY-MM-DD').format('DD/MM/YYYY'),
      finFecha: moment('2024-08-01', 'YYYY-MM-DD').format('DD/MM/YYYY'),
      estudianteNombre: 'Estudiante Autoevaluación I',
      estudianteIdentificacion: '123456789A',
      proyectoCurricular: 'proyecto1',
      descripcionProceso: 'Descripción del proceso de Autoevaluación I.'
    });
  }

  setAutoevaluacionIIData() {
    this.autoevaluacionIIForm.patchValue({
      inicioFecha: moment('2024-05-01', 'YYYY-MM-DD').format('DD/MM/YYYY'),
      finFecha: moment('2024-09-01', 'YYYY-MM-DD').format('DD/MM/YYYY'),
      docenteNombre: 'Docente Autoevaluación II',
      docenteIdentificacion: '987654321A',
      proyectoCurricular: 'proyecto2',
      descripcionProceso: 'Descripción del proceso de Autoevaluación II.'
    });
  }

  onGuardar() {
    let formValues;

    switch (this.selectedEvaluation) {
      case 'heteroevaluacion':
        if (this.heteroForm.valid) {
          formValues = {
            ...this.heteroForm.value,
            inicioFecha: moment(this.heteroForm.value.inicioFecha, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            finFecha: moment(this.heteroForm.value.finFecha, 'DD/MM/YYYY').format('YYYY-MM-DD')
          };
          console.log(`Guardando Heteroevaluación`);
        }
        break;
      // Similar para los otros casos
    }
  
    if (formValues) {
      console.log(`Datos a guardar:`, formValues);
      // Aquí podrías agregar la lógica para enviar los datos al servidor o realizar otras acciones necesarias
    } else {
      console.log('El formulario no es válido. Por favor, completa todos los campos requeridos.');
    }
  }

  onGenerarSoporte() {
    console.log(`Generando soporte para ${this.selectedEvaluation}`);
  }

  onContinuar() {
    console.log(`Continuando con ${this.selectedEvaluation}`);
  }

  confirm() {
    console.log(`Confirmando ${this.selectedEvaluation}`);
    this.closeModal();
  }

  closeDynamicForm() {
    this.showDynamicForm = false;
  }  

  closeModal() {
    this.showModal = false;
  }

  openModal() {
    this.showModal = true;
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.userRoles.includes(role));
  }
}
