import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { ROLES } from "src/app/models/diccionario";
import { UserService } from "src/app/services/user.service";
import { MatSelectChange } from "@angular/material/select";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";

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

  @Input() formtype: string = '';  

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.heteroForm = this.fb.group({});
    this.coevaluacionIIForm = this.fb.group({});
    this.coevaluacionIForm = this.fb.group({});
    this.autoevaluacionIIForm = this.fb.group({});
    this.autoevaluacionIForm = this.fb.group({});
  }

  ngOnInit(): void {
    console.log("EvaluacionesComponent initialized");
    this.initializeForms();

    // Obtener roles del usuario
    this.userService.getUserRoles().then((roles) => {
      this.userRoles = roles;
      console.log("User roles loaded:", this.userRoles);
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

  selectForm(formType: string) {
    this.selectedEvaluation = formType;
  }
  

  // Método que maneja la selección del menú desplegable
  onSelectChange(event: MatSelectChange) {
    this.selectedEvaluation = event.value;
    // invocar la lógica de selección de formularios de ser necesario
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
        console.log("Formulario válido. Enviando los datos...");

        const formattedValues = {
          ...formValues,
          inicioFecha: moment(formValues.inicioFecha, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          ),
          finFecha: moment(formValues.finFecha, "DD/MM/YYYY").format("YYYY-MM-DD"),
        };

        console.log("Datos formateados para envío:", formattedValues);
      } else {
        console.error(
          "El formulario no es válido. Por favor, completa todos los campos requeridos."
        );
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
}
