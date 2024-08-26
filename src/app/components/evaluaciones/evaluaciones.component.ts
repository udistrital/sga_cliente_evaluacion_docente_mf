
import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';

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

  // Propiedades para manejar los valores por defecto e interacción
  inicioFecha: string = '2024-01-01';  // Fecha predeterminada
  finFecha: string = '2024-12-31';     // Fecha predeterminada

  estudianteNombre: string = 'Estudiante Predeterminado';
  estudianteIdentificacion: string = '123456789';

  proyectoCurricular: string = 'proyecto1';
  proyectoCurricular2: string = 'proyecto2';
  proyectoCurricularN: string = 'proyectoN';

  docenteNombre: string = 'docente1';
  docenteIdentificacion: string = '987654321';

  espacioAcademico: string = 'Espacio Académico 1';
  espacioAcademico2: string = 'Espacio Académico 2';
  espacioAcademicoN: string = 'Espacio Académico N';

  descripcionProceso: string = 'Descripción predeterminada del proceso.';
  formularioProceso: string = 'Formulario predeterminado.';

  grupoSeleccionado: string = 'grupo1';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
    });
  }

  toggleTerms() {
    this.showTerms = !this.showTerms;
  }

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedEvaluation = selectElement.value;

    // Ajustar valores relacionados según la evaluación seleccionada
    if (this.selectedEvaluation === 'heteroevaluacion') {
      this.setHeteroevaluacionData();
    } else if (this.selectedEvaluation === 'coevaluacion-i') {
      this.setCoevaluacionIData();
    } else if (this.selectedEvaluation === 'coevaluacion-ii') {
      this.setCoevaluacionIIData();
    } else if (this.selectedEvaluation === 'autoevaluacion-i') {
      this.setAutoevaluacionIData();
    } else if (this.selectedEvaluation === 'autoevaluacion-ii') {
      this.setAutoevaluacionIIData();
    }
  }

  setHeteroevaluacionData() {
    this.inicioFecha = '2024-01-15';
    this.finFecha = '2024-05-30';
    this.estudianteNombre = 'Estudiante Heteroevaluación';
    this.estudianteIdentificacion = '123456789H';
    this.proyectoCurricular = 'proyecto1';
    this.docenteNombre = 'Docente Heteroevaluación';
    this.descripcionProceso = 'Descripción del proceso de Heteroevaluación.';
    this.formularioProceso = 'Formulario de Heteroevaluación.';
  }

  setCoevaluacionIData() {
    this.inicioFecha = '2024-02-01';
    this.finFecha = '2024-06-15';
    this.proyectoCurricular = 'proyecto2';
    this.espacioAcademico = 'Espacio Académico Coevaluación I';
    this.docenteNombre = 'Docente Coevaluación I';
    this.grupoSeleccionado = 'grupo2';
    this.descripcionProceso = 'Descripción del proceso de Coevaluación I.';
    this.formularioProceso = 'Formulario de Coevaluación I.';
  }

  setCoevaluacionIIData() {
    this.inicioFecha = '2024-03-01';
    this.finFecha = '2024-07-01';
    this.proyectoCurricular = 'proyecto1';
    this.docenteNombre = 'Docente Coevaluación II';
    this.espacioAcademico = 'Espacio Académico Coevaluación II';
    this.descripcionProceso = 'Descripción del proceso de Coevaluación II.';
    this.formularioProceso = 'Formulario de Coevaluación II.';
  }

  setAutoevaluacionIData() {
    this.inicioFecha = '2024-04-01';
    this.finFecha = '2024-08-01';
    this.estudianteNombre = 'Estudiante Autoevaluación I';
    this.estudianteIdentificacion = '123456789A';
    this.proyectoCurricular = 'proyecto1';
    this.descripcionProceso = 'Descripción del proceso de Autoevaluación I.';
    this.formularioProceso = 'Formulario de Autoevaluación I.';
  }

  setAutoevaluacionIIData() {
    this.inicioFecha = '2024-05-01';
    this.finFecha = '2024-09-01';
    this.docenteNombre = 'Docente Autoevaluación II';
    this.docenteIdentificacion = '987654321A';
    this.proyectoCurricular = 'proyecto2';
    this.espacioAcademico = 'Espacio Académico Autoevaluación II';
    this.descripcionProceso = 'Descripción del proceso de Autoevaluación II.';
    this.formularioProceso = 'Formulario de Autoevaluación II.';
  }

  onGuardar() {
    console.log(`Guardando ${this.selectedEvaluation}`);
    console.log(`Datos a guardar: 
    Fecha Inicio: ${this.inicioFecha}, 
    Fecha Fin: ${this.finFecha}, 
    Estudiante: ${this.estudianteNombre}, 
    Identificación: ${this.estudianteIdentificacion},
    Proyecto: ${this.proyectoCurricular}, 
    Docente: ${this.docenteNombre},
    Descripción: ${this.descripcionProceso}, 
    Formulario: ${this.formularioProceso}`);
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
