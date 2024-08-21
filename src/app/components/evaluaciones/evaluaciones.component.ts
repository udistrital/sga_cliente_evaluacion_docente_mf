import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';
import { MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    // Inicialización en el constructor
    this.heteroForm = this.fb.group({});
    this.coevaluacionIIForm = this.fb.group({});
    this.coevaluacionIForm = this.fb.group({});
    this.autoevaluacionIIForm = this.fb.group({});
    this.autoevaluacionIForm = this.fb.group({});
  }
  ngOnInit(): void {
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

  toggleTerms() {
    this.showTerms = !this.showTerms;
  }

  onSelectChange(event: MatSelectChange) {
    this.selectedEvaluation = event.value;
  
    // Ajustar valores relacionados según la evaluación seleccionada
    switch (this.selectedEvaluation) {
      case 'heteroevaluacion':
        this.setHeteroevaluacionData();
        break;
      case 'coevaluacion-i':
        this.setCoevaluacionIData();
        break;
      case 'coevaluacion-ii':
        this.setCoevaluacionIIData();
        break;
      case 'autoevaluacion-i':
        this.setAutoevaluacionIData();
        break;
      case 'autoevaluacion-ii':
        this.setAutoevaluacionIIData();
        break;
    }
  }

  onVisualizar() {
    switch (this.selectedEvaluation) {
      case 'heteroevaluacion':
        this.formData = this.heteroForm.value;
        break;
      case 'coevaluacion-i':
        this.formData = this.coevaluacionIForm.value;
        break;
      case 'coevaluacion-ii':
        this.formData = this.coevaluacionIIForm.value;
        break;
      case 'autoevaluacion-i':
        this.formData = this.autoevaluacionIForm.value;
        break;
      case 'autoevaluacion-ii':
        this.formData = this.autoevaluacionIIForm.value;
        break;
    }
    this.showDynamicForm = true;
  }

  setHeteroevaluacionData() {
    this.heteroForm.patchValue({
      inicioFecha: '2024-01-15',
      finFecha: '2024-05-30',
      estudianteNombre: 'Estudiante Heteroevaluación',
      estudianteIdentificacion: '123456789H',
      proyectoCurricular: 'proyecto1',
      docenteNombre: 'Docente Heteroevaluación',
      descripcionProceso: 'Descripción del proceso de Heteroevaluación.'
    });
  }

  setCoevaluacionIData() {
    this.coevaluacionIForm.patchValue({
      inicioFecha: '2024-02-01',
      finFecha: '2024-06-15',
      proyectoCurricular: 'proyecto2',
      docenteNombre: 'Docente Coevaluación I',
      descripcionProceso: 'Descripción del proceso de Coevaluación I.',
      espacioAcademico: 'Espacio Académico Coevaluación I',
      grupoSeleccionado: 'grupo2'
    });
  }

  setCoevaluacionIIData() {
    this.coevaluacionIIForm.patchValue({
      inicioFecha: '2024-03-01',
      finFecha: '2024-07-01',
      proyectoCurricular: 'proyecto1',
      docenteNombre: 'Docente Coevaluación II',
      descripcionProceso: 'Descripción del proceso de Coevaluación II.',
      espacioAcademico: 'Espacio Académico Coevaluación II'
    });
  }

  setAutoevaluacionIData() {
    this.autoevaluacionIForm.patchValue({
      inicioFecha: '2024-04-01',
      finFecha: '2024-08-01',
      estudianteNombre: 'Estudiante Autoevaluación I',
      estudianteIdentificacion: '123456789A',
      proyectoCurricular: 'proyecto1',
      descripcionProceso: 'Descripción del proceso de Autoevaluación I.'
    });
  }

  setAutoevaluacionIIData() {
    this.autoevaluacionIIForm.patchValue({
      inicioFecha: '2024-05-01',
      finFecha: '2024-09-01',
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
          formValues = this.heteroForm.value;
          console.log(`Guardando Heteroevaluación`);
        }
        break;
      case 'coevaluacion-i':
        if (this.coevaluacionIForm.valid) {
          formValues = this.coevaluacionIForm.value;
          console.log(`Guardando Coevaluación I`);
        }
        break;
      case 'coevaluacion-ii':
        if (this.coevaluacionIIForm.valid) {
          formValues = this.coevaluacionIIForm.value;
          console.log(`Guardando Coevaluación II`);
        }
        break;
      case 'autoevaluacion-i':
        if (this.autoevaluacionIForm.valid) {
          formValues = this.autoevaluacionIForm.value;
          console.log(`Guardando Autoevaluación I`);
        }
        break;
      case 'autoevaluacion-ii':
        if (this.autoevaluacionIIForm.valid) {
          formValues = this.autoevaluacionIIForm.value;
          console.log(`Guardando Autoevaluación II`);
        }
        break;
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
