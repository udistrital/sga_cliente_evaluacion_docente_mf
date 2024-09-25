import { Component, OnInit, Input, SimpleChanges, ViewChild } from "@angular/core";
import { ROLES } from "src/app/models/diccionario";
import { UserService } from "src/app/services/user.service";
import { MatSelectChange } from "@angular/material/select";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { DocenteMidService } from "src/app/services/docente-mid.service";
import Swal from "sweetalert2";
import { TercerosCrudService } from "src/app/services/terceros-crud.service";
import { DateService } from 'src/app/services/date.service';
import { ProyectoAcademicoService } from '../../services/proyecto_academico.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { checkContent } from "src/app/utils/verify-response";
import { EspaciosAcademicosService } from '../../services/espacios_academicos.service';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ParametrosService } from "src/app/services/parametros.service";

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
  isFieldDisabled: boolean = true; 
  periodosActivosDescripciones: string[] = [];
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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private proyectoAcademicoService: ProyectoAcademicoService,
    private _snackBar: MatSnackBar,
    private espaciosAcademicosService: EspaciosAcademicosService,
    private popUpManager: PopUpManager,
    private dateService: DateService,
    private docenteMidService: DocenteMidService,
    private tercerosCrudService: TercerosCrudService,
    private parametrosService: ParametrosService 
  ) {
    this.heteroForm = this.fb.group({});
    this.coevaluacionIIForm = this.fb.group({});
    this.coevaluacionIForm = this.fb.group({});
    this.autoevaluacionIIForm = this.fb.group({});
    this.autoevaluacionIForm = this.fb.group({});
  }


  ngOnInit(): void {
    // Verificar si el persona_id existe en el localStorage
    let storedPersonaId = localStorage.getItem("persona_id");
    if (!storedPersonaId) {
      console.warn(
        "No se encontró persona_id, estableciendo 94 como valor por defecto."
      );
      localStorage.setItem("persona_id", "94");
      storedPersonaId = "94";
    }
    console.log("persona_id encontrado:", storedPersonaId);
    console.log("EvaluacionesComponent initialized");

    // Inicializar los formularios
    this.initializeForms();
    this.loadProyectos();
    this.loadEspaciosAcademicos();

    if (!storedPersonaId) {
      console.error("Persona ID no encontrado en localStorage.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se ha encontrado el ID de persona. Por favor, inicia sesión de nuevo.",
      });
      return;
    }

    // Obtener roles del usuario
    this.userService.getUserRoles().then((roles) => {
      this.userRoles = roles;
      console.log("User roles loaded:", this.userRoles);

      // Nueva consulta para obtener los periodos activos
      this.parametrosService.get('periodo?query=CodigoAbreviacion:PA,Activo:true&sortby=Id&order=desc&limit=5').subscribe(
        (response) => {
          if (response && response.Data && response.Data.length) {
            // Extraer y almacenar las descripciones de los periodos activos
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

    // Llamar a la función getCodigoEstudiante y mostrar el código en la consola
    this.userService.getCodigoEstudiante()
      .then((codigo) => {
        console.log("Código del estudiante:", codigo);
      })
      .catch((error) => {
        console.error("Error al obtener el código del estudiante:", error.message);
      });

    // Cargar datos de identificación del usuario
    this.loadUserData();
  }

  // Cargar datos de identificación del usuario actual
  loadUserData() {
    this.userService.getPersonaId().then((personaId) => {
      if (!personaId) {
        console.error("No se encontró el ID de la persona. Verifica si el usuario está autenticado correctamente.");
        return;
      }
      
      // Obtener los datos de identificación usando el personaId
      this.tercerosCrudService.getDatosIdentificacionPorTercero(personaId).subscribe(
        (data) => {
          if (data && data.length > 0) {
            const datosIdentificacion = data[0];
            const filteredData = {
              CodigoAbreviacion: datosIdentificacion.TipoDocumentoId?.CodigoAbreviacion,
              Id: datosIdentificacion.TerceroId?.Id,
              NombreCompleto: datosIdentificacion.TerceroId?.NombreCompleto,
              Activo: datosIdentificacion.Activo,
              Numero: datosIdentificacion.Numero,
              DocumentoSoporte: datosIdentificacion.DocumentoSoporte,
            };
            
            // Si el usuario está activo, rellenar los formularios
            if (filteredData.Activo) {
              this.heteroForm.patchValue({
                estudianteNombre: filteredData.NombreCompleto,
                estudianteIdentificacion: filteredData.Numero,
              });
              this.autoevaluacionIForm.patchValue({
                estudianteNombre: filteredData.NombreCompleto,
                estudianteIdentificacion: filteredData.Numero,
              });
              this.autoevaluacionIIForm.patchValue({
                docenteNombre: filteredData.NombreCompleto,
                docenteIdentificacion: filteredData.Numero,
              });
              this.coevaluacionIForm.patchValue({
                docenteNombre: filteredData.NombreCompleto,
              });
              this.coevaluacionIIForm.patchValue({
                docenteNombre: filteredData.NombreCompleto,
              });
              console.log("Datos de identificación filtrados y cargados:", filteredData);
            } else {
              console.warn("El usuario no está activo.");
            }
          } else {
            console.warn("No se encontraron datos de identificación para el usuario.");
          }
        },
        (error) => {
          console.error("Error al cargar los datos de identificación:", error);
        }
      );
    }).catch((error) => {
      console.error("Error al obtener el ID de la persona:", error);
    });
  }


  // Inicializar formularios
  initializeForms(): void {
    this.heteroForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      estudianteNombre: ["", Validators.required],
      estudianteIdentificacion: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      descripcionProceso: ["", Validators.required],
    });

    this.coevaluacionIIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: ["", Validators.required],
    });

    this.coevaluacionIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      grupoSeleccionado: ["", Validators.required],
      descripcionProceso: ["", Validators.required],
    });

    this.autoevaluacionIIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      docenteNombre: ["", Validators.required],
      docenteIdentificacion: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      descripcionProceso: ["", Validators.required],
    });

    this.autoevaluacionIForm = this.fb.group({
      inicioFecha: ["", Validators.required],
      finFecha: ["", Validators.required],
      estudianteNombre: ["", Validators.required],
      estudianteIdentificacion: ["", Validators.required],
      proyectoCurricular: ["", Validators.required],
      proyectoCurricular2: ["", Validators.required],
      descripcionProceso: ["", Validators.required],
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

  // Control de acceso basado en roles
  hasRole(rolesPermitidos: string[]): boolean {
    return rolesPermitidos.some((rol) => this.userRoles.includes(rol));
  }

  selectForm(formType: string) {
    this.selectedEvaluation = formType;
  }

  // Método que maneja la selección del menú desplegable
  onSelectChange(event: MatSelectChange) {
    this.selectedEvaluation = event.value;
    console.log("Selected Evaluation: ", this.selectedEvaluation);
    // invocar la lógica de selección de formularios de ser necesario
  }

  // Detecta cambios en el valor de formtype y actualiza el formulario mostrado
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["formtype"]) {
      this.selectForm(this.formtype);
    }
  }

  onGuardar(event?: any, formValues?: any): void {
    if (event) {
      console.log("Datos recibidos de formulario dinámico:", event);
      this.processFormSubmission(event);
    } else if (formValues) {
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
      const formValues = this.getSelectedFormValues();
      if (formValues && this.validateForm(formValues)) {
        const formattedValues = {
          ...formValues,
          inicioFecha: moment(formValues.inicioFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
          finFecha: moment(formValues.finFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
        };
        console.log("Datos listos para envío:", formattedValues);
      } else {
        console.error("Formulario no es válido.");
      }
    }
  }

// Procesa el formulario dinámico
processFormSubmission(formValues: any) {
  if (!formValues || Object.keys(formValues).length === 0) {
    console.error("No se recibieron valores del formulario dinámico.");
    return;
  }

  // Verificar qué tipo de evaluación dinámica se está enviando
  switch (this.selectedEvaluation) {
    case "heteroevaluacion":
      this.submitHeteroevaluacion(formValues);
      break;

    case "autoevaluacion-i":
      this.submitAutoevaluacionI(formValues);
      break;

    case "autoevaluacion-ii":
      this.submitAutoevaluacionII(formValues);
      break;

    case "coevaluacion-i":
      this.submitCoevaluacionI(formValues);
      break;

    case "coevaluacion-ii":
      this.submitCoevaluacionII(formValues);
      break;

    default:
      console.error("No se reconoce la evaluación seleccionada.");
  }
}

// Métodos para enviar cada tipo de formulario dinámico

submitHeteroevaluacion(formValues: any) {
  if (!formValues) {
    console.error("No se recibieron valores del formulario de Heteroevaluación.");
    return;
  }

  // Realizar una transformación en caso de que se necesite, como formatear fechas
  const formattedValues = {
    ...formValues,
    inicioFecha: formValues.inicioFecha ? moment(formValues.inicioFecha, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
    finFecha: formValues.finFecha ? moment(formValues.finFecha, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
  };

  console.log("Enviando datos de Heteroevaluación formateados:", formattedValues);

  // Enviar los datos al backend
  this.docenteMidService.get(formattedValues).subscribe(
    (response) => {
      console.log("Datos de Heteroevaluación enviados exitosamente:", response);
      Swal.fire({
        icon: "success",
        title: "Enviado",
        text: "Formulario de Heteroevaluación enviado correctamente.",
      });
    },
    (error) => {
      console.error("Error enviando Heteroevaluación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al enviar el formulario de Heteroevaluación.",
      });
    }
  );
}

  submitAutoevaluacionI(formValues: any) {
    console.log("Enviando formulario de Autoevaluación I:", formValues);
    // Aquí la lógica de transformación y envío
    const formattedValues = {
      ...formValues,
      inicioFecha: moment(formValues.inicioFecha, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      finFecha: moment(formValues.finFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
    };
    console.log("Datos formateados de Autoevaluación I:", formattedValues);
    // Lógica de envío al servidor
  }

  submitAutoevaluacionII(formValues: any) {
    console.log("Enviando formulario de Autoevaluación II:", formValues);
    // Transformación y envío
    const formattedValues = {
      ...formValues,
      inicioFecha: moment(formValues.inicioFecha, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      finFecha: moment(formValues.finFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
    };
    console.log("Datos formateados de Autoevaluación II:", formattedValues);
    // Lógica de envío al servidor
  }

  submitCoevaluacionI(formValues: any) {
    console.log("Enviando formulario de Coevaluación I:", formValues);
    // Transformación y envío
    const formattedValues = {
      ...formValues,
      inicioFecha: moment(formValues.inicioFecha, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      finFecha: moment(formValues.finFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
    };
    console.log("Datos formateados de Coevaluación I:", formattedValues);
    // Lógica de envío al servidor
  }

  submitCoevaluacionII(formValues: any) {
    console.log("Enviando formulario de Coevaluación II:", formValues);
    // Transformación y envío
    const formattedValues = {
      ...formValues,
      inicioFecha: moment(formValues.inicioFecha, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      finFecha: moment(formValues.finFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
    };
    console.log("Datos formateados de Coevaluación II:", formattedValues);
    // Lógica de envío al servidor
  }

  validateForm(formValues: any): boolean {
    const requiredFields = this.getRequiredFieldsForSelectedForm();
    for (const field of requiredFields) {
      if (!formValues[field] || formValues[field].trim() === "") {
        console.error(`El campo ${field} es obligatorio.`);
        return false;
      }
    }
    return true;
  }

  // Métodos para obtener valores del formulario dependiendo de la evaluación seleccionada
  getSelectedFormValues(): any {
    switch (this.selectedEvaluation) {
      case "heteroevaluacion":
        return this.heteroForm.value;
      case "autoevaluacion-i":
        return this.autoevaluacionIForm.value;
      case "autoevaluacion-ii":
        return this.autoevaluacionIIForm.value;
      case "coevaluacion-i":
        return this.coevaluacionIForm.value;
      case "coevaluacion-ii":
        return this.coevaluacionIIForm.value;
      default:
        return null;
    }
  }

  getRequiredFieldsForSelectedForm(): string[] {
    switch (this.selectedEvaluation) {
      case "heteroevaluacion":
        return [
          "inicioFecha",
          "finFecha",
          "proyectoCurricular",
          "docenteNombre",
          "descripcionProceso",
        ];
      case "autoevaluacion-i":
        return [
          "inicioFecha",
          "finFecha",
          "estudianteNombre",
          "estudianteIdentificacion",
          "proyectoCurricular",
        ];
      case "autoevaluacion-ii":
        return [
          "inicioFecha",
          "finFecha",
          "docenteNombre",
          "docenteIdentificacion",
          "proyectoCurricular",
        ];
      case "coevaluacion-i":
        return [
          "inicioFecha",
          "finFecha",
          "proyectoCurricular",
          "docenteNombre",
          "grupoSeleccionado",
        ];
      case "coevaluacion-ii":
        return [
          "inicioFecha",
          "finFecha",
          "proyectoCurricular",
          "docenteNombre",
          "espacioAcademico",
        ];
      default:
        return [];
    }
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