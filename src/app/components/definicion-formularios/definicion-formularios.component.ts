import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';
import { DateService } from 'src/app/services/date.service';

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
  dateHeader: string | undefined;
  currentPcDate: string | undefined; // Nueva variable para la fecha del PC
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

  constructor(private userService: UserService, private fb: FormBuilder, private dateService: DateService) {
    this.form = this.fb.group({
      roles: ['', Validators.required],
    });
  }

  ngOnInit(): void {    
    this.currentPcDate = new Date().toLocaleString(); 
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
      this.dateService.getDateHeader().subscribe(
        (date: string) => {
          this.dateHeader = date;
          console.log('Fecha del encabezado de la API:', this.dateHeader);
          console.log('Fecha actual del PC:', this.currentPcDate);
        },
        (error: any) => console.error('Error al obtener el encabezado de fecha:', error)
      );               
    }).catch(error => console.error('Error al obtener los roles de usuario:', error));
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
