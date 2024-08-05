import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';


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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
    });
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
}
