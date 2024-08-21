import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';
import { DateService } from 'src/app/services/date.service';

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
  dateHeader: string | undefined;

  constructor(private userService: UserService, private dateService: DateService) { }

  ngOnInit(): void {
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;

      this.dateService.getDateHeader().subscribe(
        (date: string) => {
          this.dateHeader = date;
          console.log('DateHeader:', this.dateHeader);
        },
        (error: any) => console.error('Error:', error),
      );
    }).catch(error => console.error('Error al obtener los roles de usuario:', error));
  }

  toggleTerms() {
    this.showTerms = !this.showTerms;
  }

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedEvaluation = selectElement.value;
  }

  onGuardar() {
    // Implementa la lógica para guardar la evaluación aquí
    console.log(`Guardando ${this.selectedEvaluation}`);
  }

  onGenerarSoporte() {
    // Implementa la lógica para generar el soporte aquí
    console.log(`Generando soporte para ${this.selectedEvaluation}`);
  }

  onContinuar() {
    // Implementa la lógica para continuar con el proceso aquí
    console.log(`Continuando con ${this.selectedEvaluation}`);
  }

  confirm() {
    // Implementa la lógica para confirmar la acción aquí
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
