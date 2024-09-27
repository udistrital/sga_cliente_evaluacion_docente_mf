import { Component, OnInit, ViewChild } from "@angular/core";
import { ROLES } from "src/app/models/diccionario";
import { UserService } from "src/app/services/user.service";
import { DateService } from "src/app/services/date.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

@Component({
  selector: "app-definir-escalas",
  templateUrl: "./definir-escalas.component.html",
  styleUrls: ["./definir-escalas.component.scss"],
})
export class DefinirEscalasComponent implements OnInit {
  tipoEscala: string = "";
  descripcion: string = "";
  escalas: any[] = [];
  userRoles: string[] = [];
  ROLES = ROLES;
  isCreating: boolean = false;
  activeTab = 0;
  isViewingScale: boolean = false;
  escalaSeleccionada: any = {};

  // Formulario Reactivo
  formularioEscala!: FormGroup;
  showMultipleOptions: boolean = false;

  // Definir los tipos de campo
  tipoCampos = [
    { id: 1, label: "Texto" },
    { id: 2, label: "Selección Múltiple" },
    { id: 3, label: "Cargar Archivos" },
    { id: 4, label: "Descargar Archivos" },
  ];

  // Columnas de la tabla incluyendo "Estado"
  displayedColumns: string[] = [
    "Pregunta",
    "Descripcion",
    "TipoInput",
    "Estado",
    "Acciones",
  ];
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
      label: ["", Validators.required],
      descripcion: ["", Validators.required],
      tipoCampo: ["", Validators.required],
      opciones: this.fb.array([]), // Agregamos el FormArray para las opciones de selección múltiple
    });
  }

  // Devuelve el FormArray de opciones
  get opciones(): FormArray {
    return this.formularioEscala.get("opciones") as FormArray;
  }

  cargarEscalas() {
    this.escalas = [
      {
        label: "Texto 1",
        descripcion: "Escala de texto",
        tipoCampo: "Texto",
        activo: true,
        fechaCreacion: new Date(),
      },
      {
        label: "Selección Múltiple 1",
        descripcion: "Escala de selección múltiple",
        tipoCampo: "Selección Múltiple",
        activo: true,
        opciones: ["Opción 1", "Opción 2"],
        fechaCreacion: new Date(),
      },
    ];
  }

  applyFilterEscalas(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  activarModoCreacion() {
    this.isCreating = true;
    this.activeTab = 1; // Cambiar a la pestaña de Formulario
  }

  tabChanged(event: any) {
    if (event.index === 1) {
      this.activarModoCreacion();
    }
  }

  onTipoCampoChange(event: any) {
    if (event.value === "Selección Múltiple") {
      this.showMultipleOptions = true;
      this.opciones.clear();
      // Añadimos tres opciones iniciales por defecto
      this.opciones.push(this.fb.control("Opción 1"));
      this.opciones.push(this.fb.control("Opción 2"));
      this.opciones.push(this.fb.control("Opción 3"));
    } else {
      this.showMultipleOptions = false;
      this.opciones.clear(); // Limpiar opciones si no es 'Selección Múltiple'
    }
  }

  agregarEscala() {
    if (this.formularioEscala.valid) {
      const nuevaEscala = {
        ...this.formularioEscala.value,
        activo: true,
        fechaCreacion: new Date(),
      };
      this.escalas.push(nuevaEscala);
      this.dataSource.data = this.escalas;
      this.isCreating = false;
      this.formularioEscala.reset(); // Reiniciar el formulario
      this.activeTab = 0; // Regresar a la lista
    }
  }

  // Agregar una nueva opción al FormArray
  agregarOpcion() {
    const nuevaOpcion = this.fb.control(""); // Creamos un nuevo FormControl vacío
    this.opciones.push(nuevaOpcion); // Añadimos el nuevo control al FormArray
  }

  // Quitar la última opción del FormArray
  quitarOpcion() {
    if (this.opciones.length > 1) {
      this.opciones.removeAt(this.opciones.length - 1); // Eliminar la última opción
    }
  }

  cancelarCreacion() {
    this.isCreating = false;
    this.formularioEscala.reset();
    this.activeTab = 0; // Regresar a la lista
  }

  vistaGeneral(escala: any) {
    this.escalaSeleccionada = escala;
    this.isViewingScale = true;
    this.activeTab = 2; // Cambiar a la pestaña de vista de escala
  }

  regresarLista() {
    this.isViewingScale = false;
    this.activeTab = 0; // Regresar a la lista
  }

  inactivarEscala(escala: any) {
    escala.activo = false;
    this.dataSource.data = this.escalas;
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some((role) => this.userRoles.includes(role));
  }
}
