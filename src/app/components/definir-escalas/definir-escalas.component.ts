import { Component, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';
import { DateService } from 'src/app/services/date.service';


@Component({
  selector: 'app-definir-escalas',
  templateUrl: './definir-escalas.component.html',
  styleUrls: ['./definir-escalas.component.scss']
})
export class DefinirEscalasComponent implements OnInit {
  tipoEscala: string = '';
  descripcion: string = '';
  tipoEscalaTitulo: string = '';
  escalas: any[] = [];
  visualizacionesCualitativas: any[] = [];
  visualizacionesCuantitativas: any[] = [];
  userRoles: string[] = [];
  ROLES = ROLES;
  dateHeader: string | undefined;

  cualitativaEscalas = [
    { label: 'INSUFICIENTE', descripcion: 'No sucede y no se demuestra el criterio' },
    { label: 'NECESITA MEJORAR', descripcion: 'Sucede parcialmente pero no se demuestra el criterio' },
    { label: 'BUENO', descripcion: 'Sucede con frecuencia y se demuestra el criterio en un nivel básico' },
    { label: 'SOBRESALIENTE', descripcion: 'Sucede la mayor parte del tiempo y se demuestra el criterio de forma adecuada' },
    { label: 'EXCELENTE', descripcion: 'Sucede siempre y se demuestra el criterio completamente' }
  ];

  cuantitativaEscalas = [
    { label: 'INSUFICIENTE', descripcion: '1' },
    { label: 'NECESITA MEJORAR', descripcion: '2' },
    { label: 'BUENO', descripcion: '3' },
    { label: 'SOBRESALIENTE', descripcion: '4' },
    { label: 'EXCELENTE', descripcion: '5' }
  ];

  constructor(private userService: UserService, private dateService: DateService) {}

  ngOnInit(): void {
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
      this.dateService.getDateHeader().subscribe(
        (date: string) => {
          this.dateHeader = date;
          console.log('DateHeader:', this.dateHeader);
        },
        (error: any) => console.error('Error al obtener el encabezado de fecha:', error)
      );              
    }).catch(error => console.error('Error al obtener los roles de usuario:', error));
  }

  onChangeTipoEscala() {
    if (this.tipoEscala === 'cualitativa') {
      this.descripcion = 'Escala cualitativa del SEUD';
      this.tipoEscalaTitulo = 'Escala cualitativa del SEUD';
      this.escalas = [...this.cualitativaEscalas];
    } else if (this.tipoEscala === 'cuantitativa') {
      this.descripcion = 'Escala cuantitativa del SEUD';
      this.tipoEscalaTitulo = 'Escala cuantitativa del SEUD';
      this.escalas = [...this.cuantitativaEscalas];
    }
  }

  agregarEscala() {
    if (this.tipoEscala === 'cualitativa') {
      this.escalas.push({ label: '', descripcion: 'Escribe una descripcion aqui' });
    } else if (this.tipoEscala === 'cuantitativa') {
      this.escalas.push({ label: '', descripcion: '' });
    }
  }

  visualizarEscalas() {
    const visualizacion = {
      tipoEscala: this.tipoEscalaTitulo,
      descripcion: this.descripcion,
      escalas: [...this.escalas],
      selected: false
    };

    if (this.tipoEscala === 'cualitativa') {
      this.visualizacionesCualitativas.push(visualizacion);
    } else if (this.tipoEscala === 'cuantitativa') {
      this.visualizacionesCuantitativas.push(visualizacion);
    }
  }

  seleccionarTabla(visualizacion: any) {
    visualizacion.selected = !visualizacion.selected;
  }

  eliminarVisualizacion(visualizacion: any, tipo: string) {
    if (tipo === 'cualitativa') {
      const index = this.visualizacionesCualitativas.indexOf(visualizacion);
      if (index > -1) {
        this.visualizacionesCualitativas.splice(index, 1);
      }
    } else if (tipo === 'cuantitativa') {
      const index = this.visualizacionesCuantitativas.indexOf(visualizacion);
      if (index > -1) {
        this.visualizacionesCuantitativas.splice(index, 1);
      }
    }
  }

  tablasElegidas() {
    const elegidas = [
      ...this.visualizacionesCualitativas.filter(v => v.selected),
      ...this.visualizacionesCuantitativas.filter(v => v.selected)
    ];
    console.log('Tablas elegidas:', elegidas);
  }

  restrictNumeric(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }

    if (input.value.length >= 3) {
      event.preventDefault();
    }
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.userRoles.includes(role));
  }
}
