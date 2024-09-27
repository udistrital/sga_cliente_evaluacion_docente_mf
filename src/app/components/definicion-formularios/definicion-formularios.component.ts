import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';
import { DateService } from 'src/app/services/date.service';
import { ParametrosService } from 'src/app/services/parametros.service';

@Component({
  selector: 'app-definicion-formularios',
  templateUrl: './definicion-formularios.component.html',
  styleUrls: ['./definicion-formularios.component.scss']
})
export class DefinicionFormulariosComponent implements OnInit {
  form: FormGroup;
  periodosActivosDescripciones: string[] = [];
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

  constructor(private userService: UserService, private fb: FormBuilder, private dateService: DateService, private parametrosService: ParametrosService) {
    this.form = this.fb.group({
      roles: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.currentPcDate = new Date().toLocaleString();
    
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
      this.parametrosService.get('periodo?query=CodigoAbreviacion:PA,Activo:true&sortby=Id&order=desc&limit=5').subscribe(
        (response) => {
          if (response && response.Data && response.Data.length) {
            this.periodosActivosDescripciones = response.Data.map((periodo: any) => periodo.Descripcion);
            console.log('Descripciones de los periodos activos:', this.periodosActivosDescripciones);
          } else {
            console.error('No se encontraron periodos activos o la estructura de datos no es la esperada.');
          }
        },
        (error) => {
          console.error('Error al obtener los periodos activos:', error);
        }
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
