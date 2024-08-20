import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-definicion-formularios',
  templateUrl: './definicion-formularios.component.html',
  styleUrls: ['./definicion-formularios.component.scss']
})
export class DefinicionFormulariosComponent implements OnInit {
  selectedProcess: string = '';
  procesos: any[] = [
    { nombre: 'Heteroevaluación', icon: 'assessment' },
    { nombre: 'Autoevaluación estudiantes', icon: 'self_improvement' },
    { nombre: 'Coevaluación I', icon: 'people' },
    { nombre: 'Autoevaluación docente', icon: 'school' },
    { nombre: 'Coevaluación II', icon: 'group' }
  ];
  userRoles: string[] = [];
  ROLES = ROLES;
  modalVisible: boolean = false;
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

  selectProcess(proceso: string) {
    this.selectedProcess = proceso;
  }

  guardar() {
    console.log('Los ajustes fueron aplicados');
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.userRoles.includes(role));
  }

  openModal() {
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }
}
