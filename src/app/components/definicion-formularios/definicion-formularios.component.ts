import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-definicion-formularios',
  templateUrl: './definicion-formularios.component.html',
  styleUrls: ['./definicion-formularios.component.scss']
})
export class DefinicionFormulariosComponent implements OnInit {
  form: FormGroup;
  selectedProcess: string = '';
  procesos = [
    { nombre: 'Heteroevaluación', icon: 'assessment' },
    { nombre: 'Autoevaluación estudiantes', icon: 'self_improvement' },
    { nombre: 'Coevaluación I', icon: 'people' },
    { nombre: 'Autoevaluación docente', icon: 'school' },
    { nombre: 'Coevaluación II', icon: 'group' }
  ];
  userRoles: string[] = [];
  ROLES = ROLES;
  titles = [
    { title: 'definicion_formularios.titulo_roles', subtitle: 'definicion_formularios.sub_titulo_roles' },
    { title: 'definicion_formularios.titulo_visualizador', subtitle: 'definicion_formularios.sub_titulo_visualizador' }
  ];
  roleOptions = [
    { value: 'administradores', label: 'definicion_formularios.administradores' },
    { value: 'docentes', label: 'definicion_formularios.docentes' },
    { value: 'estudiantes', label: 'definicion_formularios.estudiantes' },
    { value: 'docconcejos_curricularesentes', label: 'definicion_formularios.concejos_curriculares' }
  ];

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.form = this.fb.group({
      roles: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
    });
  }

  selectProcess(proceso: string) {
    this.selectedProcess = proceso;
  }

  guardar() {
    if (this.form.valid) {
      console.log('Los ajustes fueron aplicados');
    } else {
      console.log('El formulario es inválido');
    }
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.userRoles.includes(role));
  }
}
