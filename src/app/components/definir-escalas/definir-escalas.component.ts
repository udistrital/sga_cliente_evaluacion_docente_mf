import { Component, OnInit, ViewChild } from '@angular/core';
import { ROLES } from 'src/app/models/diccionario';
import { UserService } from 'src/app/services/user.service';
import { DateService } from 'src/app/services/date.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-definir-escalas',
  templateUrl: './definir-escalas.component.html',
  styleUrls: ['./definir-escalas.component.scss']
})
export class DefinirEscalasComponent implements OnInit {
  tipoEscala: string = '';
  descripcion: string = '';
  escalas: any[] = [];
  userRoles: string[] = [];
  ROLES = ROLES;
  isCreating: boolean = false;
  activeTab = 0;  // Por defecto se inicializa en la pestaña de "Lista"

  // Formulario Reactivo
  formularioEscala!: FormGroup;

  // Definir los tipos de campo
  tipoCampos = [
    { id: 1, label: 'Cuantitativo' },
    { id: 2, label: 'Texto' },
    { id: 3, label: 'Radio' },
    { id: 4, label: 'Archivos' }
  ];

  // Columnas de la tabla incluyendo "Estado"
  displayedColumns: string[] = ['Tipo', 'Descripcion', 'TipoInput', 'Estado', 'Acciones'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.cargarEscalas();
    this.dataSource = new MatTableDataSource(this.escalas);
    this.dataSource.paginator = this.paginator;

    // Inicialización del formulario
    this.formularioEscala = this.fb.group({
      label: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipoCampo: ['', Validators.required]
    });
  }

  cargarEscalas() {
    this.escalas = [
      { label: 'Cuantitativa 1', descripcion: 'Escala cuantitativa', tipoCampo: 'Cuantitativo', activo: true },
      { label: 'Texto 1', descripcion: 'Escala de texto', tipoCampo: 'Texto', activo: true }
    ];
  }

  applyFilterEscalas(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Activar el modo de creación de escala al hacer clic en el botón o pestaña de Formulario
  activarModoCreacion() {
    this.isCreating = true;
    this.activeTab = 1;  // Cambiar a la pestaña de Formulario
  }

  // Esta función se llamará cuando se cambie a la pestaña de Formulario directamente
  tabChanged(event: any) {
    if (event.index === 1) {
      this.activarModoCreacion();
    }
  }

  agregarEscala() {
    if (this.formularioEscala.valid) {
      const nuevaEscala = this.formularioEscala.value;
      this.escalas.push(nuevaEscala);
      this.dataSource.data = this.escalas;
      this.isCreating = false;  // Desactivar el modo de creación después de agregar la escala
    }
  }

  cancelarCreacion() {
    this.isCreating = false;
    this.formularioEscala.reset();  // Limpiar el formulario
  }

  // Función para inactivar una escala
  inactivarEscala(escala: any) {
    escala.activo = false;
    this.dataSource.data = this.escalas;
  }

  // Vista general de la escala
  vistaGeneral(escala: any) {
    console.log('Vista general de la escala:', escala);
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.userRoles.includes(role));
  }
}