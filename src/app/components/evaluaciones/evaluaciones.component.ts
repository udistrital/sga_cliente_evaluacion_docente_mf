import { Component, OnInit, Input, SimpleChanges, ViewChild } from "@angular/core";
import { ROLES } from "src/app/models/diccionario";
import { UserService } from "src/app/services/user.service";
import { MatSelectChange } from "@angular/material/select";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { DateService } from 'src/app/services/date.service';
import { ProyectoAcademicoService } from '../../services/proyecto_academico.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { checkContent } from "src/app/utils/verify-response";
import { EspaciosAcademicosService } from '../../services/espacios_academicos.service';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TercerosCrudService } from "src/app/services/terceros-crud.service";
import { id } from "@swimlane/ngx-charts";

@Component({
  selector: "app-evaluaciones",
  templateUrl: "./evaluaciones.component.html",
  styleUrls: ["./evaluaciones.component.scss"],
})
export class EvaluacionesComponent implements OnInit {
  showTerms = false;
  selectedEvaluation: string = "";
  showModal = false;
  userRoles: string[] = [];
  ROLES = ROLES;
  heteroForm: FormGroup;
  coevaluacionIIForm: FormGroup;
  coevaluacionIForm: FormGroup;
  autoevaluacionIIForm: FormGroup;
  autoevaluacionIForm: FormGroup;
  dateHeader: string | undefined;
  proyectos: { select: any, opciones: any[] } = { select: undefined, opciones: [] };
  facultad = [];
  displayedColumns: string[] = ['nombre', 'codigo', 'estado'];
  espacios_academicos: any[] = [];
  dataSource!: MatTableDataSource<any>;
  
  @Input() formtype: string = '';  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  openSnackBar: any;

  persona = {id: 0, nombre: "", identificacion: ""};

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private proyectoAcademicoService: ProyectoAcademicoService,
    private _snackBar: MatSnackBar,
    private espaciosAcademicosService: EspaciosAcademicosService,
    private popUpManager: PopUpManager,
    private dateService: DateService,
    private tercerosService: TercerosCrudService
  ) {
    this.heteroForm = this.fb.group({});
    this.coevaluacionIIForm = this.fb.group({});
    this.coevaluacionIForm = this.fb.group({});
    this.autoevaluacionIIForm = this.fb.group({});
    this.autoevaluacionIForm = this.fb.group({});
    this.persona = {
      "id": 0,
      "nombre": "",
      "identificacion": "",
    }
  }


  ngOnInit(): void {
    console.log(">>> Test actualización de bucket!!! <<<");
    console.log(new Date(), "Prueba adicional!!!");
    console.log("EvaluacionesComponent initialized");
    this.initializeForms(this.persona);

    // Obtener roles del usuario
    this.userService.getUserRoles().then((roles) => {
      this.userRoles = roles;
      this.dateService.getDateHeader().subscribe(
        (date: string) => {
          this.dateHeader = date;
          console.log('DateHeader:', this.dateHeader);
        },
        (error: any) => console.error('Error al obtener el encabezado de fecha:', error)
      );
      
      this.userService.getPersonaId().then(id => {
        console.log('PersonaId:', id);
        this.tercerosService.get(`datos_identificacion?query=TerceroId:${id},Activo:true&sortby=FechaCreacion&order=desc&limit=1`).subscribe(
          resp => {
            if (Object.keys(resp[0]).length > 0) {
              this.persona = {
                "id": id,
                "nombre": resp[0].TerceroId.NombreCompleto,
                "identificacion": resp[0].Numero
              };
              this.initializeForms(this.persona);  

            }
          }
        );
      })
    }).catch(error => console.error('Error al obtener los roles de usuario:', error));
  }

  // Inicializar formularios
  initializeForms(persona: any): void {
    this.heteroForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      estudianteNombre: [this.persona.nombre ? this.persona.nombre : "", Validators.required],
      estudianteIdentificacion: [this.persona.identificacion ? this.persona.identificacion : "", Validators.required],
      proyectoCurricular: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      descripcionProceso: [`Estimado estudiantado: Por favor evalúe formativamente a su docente utilizando el formato dispuesto para ello. Los ítems 01 a 20 de selección múltiple con única respuesta son obligatorios. Puede realizar anotaciones de felicitación o de sugerencias respetuosas en los espacios destinados para tal fin. Utilice como referencia la siguiente escala para medir el grado de desempeño a evaluar:`, 
        Validators.required],
    });

    this.coevaluacionIIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: [`Estimado Consejo Curricular: Por favor coevalúe con plan de mejoramiento su desempeño docente utilizando el formato dispuesto para ello. Los ítems PROMEDIO con única respuesta son obligatorios en cada dimensión.`, Validators.required],
    });

    this.coevaluacionIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      docenteNombre: [this.persona.nombre ? this.persona.nombre : "", Validators.required],
      grupoSeleccionado: ["", Validators.required],
      descripcionProceso: [`Estimado cuerpo docente y estudiantado: Por favor co-evalúen con compromisos mutuos su desempeño docente y el de sus estudiantes en este espacio curricular utilizando el formato dispuesto para ello. Por favor cargue el acta resultado de este ejercicio de coevaluación.`, Validators.required],
    });

    this.autoevaluacionIIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      docenteNombre: [this.persona.nombre ? this.persona.nombre : "", Validators.required],
      docenteIdentificacion: [this.persona.identificacion ? this.persona.identificacion : "", Validators.required],
      proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: [`Estimado cuerpo docente: Por favor autoevalúe con plan de mejoramiento su desempeño docente utilizando el formato dispuesto para ello. Los items 01 a 15 con única respuesta son obligatorios en cada dimensión.`, Validators.required],
    });

    this.autoevaluacionIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      estudianteNombre: [this.persona.nombre ? this.persona.nombre : "", Validators.required],
      estudianteIdentificacion: [this.persona.identificacion ? this.persona.identificacion : "", Validators.required],
      proyectoCurricular: ["", Validators.required],
      proyectoCurricular2: ["", Validators.required],
      descripcionProceso: [`Estimado estudiantado: Por favor autoevalúe su desempeño como estudiante en este espacio curricular. Los ítems 01 a 05 de selección múltiple con única respuesta son obligatorios. Puede realizar anotaciones de mejoramiento para conseguir sus resultados de aprendizaje en los espacios destinados para tal fin.`, Validators.required],
    });
  }

  // Método para cargar espacios académicos
  async loadEspaciosAcademicos() {
    try {
      const response = await this.cargarEspaciosAcademicos();
      this.dataSource = new MatTableDataSource<any>(this.espacios_academicos);
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      this.popUpManager.showErrorToast('Error al cargar los espacios académicos: ' + error);
    }
  } 

   async cargarEspaciosAcademicos() {
    return new Promise((resolve, reject) => {
      this.espaciosAcademicosService
        .get('espacio-academico?query=espacio_academico_padre,activo:true&limit=0')
        .subscribe(
          (response: any) => {
            this.espacios_academicos = response['Data'];
            resolve(true);
          },
          (error) => {
            reject(error);
          }
        );
    });
  } 

  // Método para aplicar filtro en la tabla de espacios académicos
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectForm(formType: string) {
    this.selectedEvaluation = formType;
  }

  // Método que maneja la selección del menú desplegable
  onSelectChange(event: MatSelectChange) {
    this.selectedEvaluation = event.value;
  }

  // Detecta cambios en el valor de formtype y actualiza el formulario mostrado
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formtype']) {
      this.selectForm(this.formtype);
    }
  }

  onGuardar(formValues?: any): void {
    if (formValues) {
      console.log("Formulario recibido:", formValues);
      if (this.validateForm(formValues)) {
        const formattedValues = {
          ...formValues,
          inicioFecha: moment(formValues.inicioFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
          finFecha: moment(formValues.finFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
        };
        console.log("Datos formateados para envío:", formattedValues);
      } else {
        console.error("El formulario no es válido. Por favor, completa todos los campos requeridos.");
      }
    } else {
      console.error("No se recibieron valores del formulario.");
    }
  }

  validateForm(formValues: any): boolean {
    const requiredFields = [
      "inicioFecha",
      "finFecha",
      "proyectoCurricular",
      "docenteNombre",
      "descripcionProceso",
    ];

    for (const field of requiredFields) {
      if (!formValues[field] || formValues[field].trim() === "") {
        console.error(`El campo ${field} es obligatorio.`);
        return false;
      }
    }

    return true;
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some((role) => this.userRoles.includes(role));
  }

  onProyectoSelection(event: MatSelectChange): void {
    const proyectoSeleccionado = event.value;
    if (proyectoSeleccionado) {
      this.openSnackBar(`Proyecto seleccionado: ${proyectoSeleccionado.Nombre}`);
    }
  }

  loadProyectos(): void {
    this.proyectoAcademicoService.get('proyecto_academico_institucion?query=Activo:true&sortby=Nombre&order=asc&limit=0')
      .subscribe({
        next: (resp) => {
          if (checkContent(resp)) {
            this.proyectos.opciones = resp;
          } else {
            console.error('No se encontraron proyectos');
          }
        },
        error: (err) => {
          console.error('Error al cargar proyectos:', err);
        }
      });
  }
}
