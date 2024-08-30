import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "ngx-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.scss"],
})
export class DynamicFormComponent implements OnInit, OnChanges {
  // Inputs
  @Input() normalform: any;
  @Input() modeloData: any;
  @Input() clean!: boolean;

  // Outputs
  @Output() result = new EventEmitter<any>();
  @Output() resultAux = new EventEmitter<any>();
  @Output() interlaced = new EventEmitter<any>();
  @Output() percentage = new EventEmitter<any>();

  // Form-related properties
  form: FormGroup = new FormGroup({});
  emptyControl = new FormControl(null);
  data: any;
  init = true;

  // Preguntas de ejemplo
  questions01 = [
    "01. Demuestra conocimiento de los contenidos que se van a enseñar en mi espacio curricular",
    "02. Demuestra habilidades para conducir procesos de enseñanza-aprendizaje según los contenidos de mi espacio curricular",
  ];

  questions02 = [
    "06. Me da a conocer lo que debo saber, comprender y ser capaz de hacer en mi espacio curricular",
    "07. Me enseña lo que debo saber, comprender y ser capaz de hacer en mi espacio curricular",
  ];

  questions03 = [
    "11. Desarrolla las unidades de aprendizaje de mi espacio curricular",
    "12. Evalúa mis evidencias de aprendizaje y me proporciona devoluciones claras para mi mejoramiento",
  ];

  // Preguntas de la autoevaluación del aprendizaje
  questionsAutoevaluacion = [
    {
      text: "01. Asumo las actividades que me plantea este espacio curricular en cada unidad de aprendizaje",
      options: [
        {
          value: "Evito hacer las actividades",
          text: "Evito hacer las actividades",
        },
        {
          value: "A veces me animan las actividades",
          text: "A veces me animan las actividades",
        },
        {
          value: "Con frecuencia hago las actividades del espacio curricular",
          text: "Con frecuencia hago las actividades del espacio curricular",
        },
        {
          value:
            "Me encanta las actividades si he tenido éxito en actividades similares",
          text: "Me encanta las actividades si he tenido éxito en actividades similares",
        },
        {
          value: "Espero con positivismo el próximo reto",
          text: "Espero con positivismo el próximo reto",
        },
      ],
    },
    {
      text: "02. Siento que puedo lograr los resultados de aprendizaje esperados",
      options: [
        { value: "Nunca", text: "Nunca" },
        { value: "A veces", text: "A veces" },
        { value: "Con alguna frecuencia", text: "Con alguna frecuencia" },
        {
          value: "La mayor parte del tiempo",
          text: "La mayor parte del tiempo",
        },
        { value: "Siempre", text: "Siempre" },
      ],
    },
    {
      text: "03. Acepto los resultados de la evaluación que realiza mi docente",
      options: [
        {
          value: "Me siento mal con los resultados negativos",
          text: "Me siento mal con los resultados negativos",
        },
        {
          value: "Me siento bien solo si me interesa el espacio curricular",
          text: "Me siento bien solo si me interesa el espacio curricular",
        },
        {
          value:
            "Con frecuencia miro las devoluciones de mi docente positivamente",
          text: "Con frecuencia miro las devoluciones de mi docente positivamente",
        },
        {
          value:
            "La mayor parte del tiempo miro las devoluciones de mi docente positivamente",
          text: "La mayor parte del tiempo miro las devoluciones de mi docente positivamente",
        },
        {
          value: "Siempre miro las devoluciones de mi docente positivamente",
          text: "Siempre miro las devoluciones de mi docente positivamente",
        },
      ],
    },
    {
      text: "04. Estrategias de autoaprendizaje (I)",
      options: [
        {
          value:
            "No movilizo recursos personales para mi aprendizaje en este espacio curricular",
          text: "No movilizo recursos personales para mi aprendizaje en este espacio curricular",
        },
        {
          value:
            "A veces movilizo recursos personales para mi aprendizaje en este espacio curricular",
          text: "A veces movilizo recursos personales para mi aprendizaje en este espacio curricular",
        },
        {
          value:
            "Con frecuencia movilizo recursos personales para mi aprendizaje en este espacio curricular",
          text: "Con frecuencia movilizo recursos personales para mi aprendizaje en este espacio curricular",
        },
        {
          value:
            "La mayor parte de las veces movilizo recursos personales para mi aprendizaje en este espacio curricular",
          text: "La mayor parte de las veces movilizo recursos personales para mi aprendizaje en este espacio curricular",
        },
        {
          value:
            "Siempre movilizo recursos personales para mi aprendizaje en este espacio curricular",
          text: "Siempre movilizo recursos personales para mi aprendizaje en este espacio curricular",
        },
      ],
    },
    {
      text: "05. Estrategias de autoaprendizaje (II)",
      options: [
        {
          value:
            "No me animo a usar redes para mi aprendizaje en este espacio curricular",
          text: "No me animo a usar redes para mi aprendizaje en este espacio curricular",
        },
        {
          value:
            "A veces me animo a usar redes para mi aprendizaje en este espacio curricular",
          text: "A veces me animo a usar redes para mi aprendizaje en este espacio curricular",
        },
        {
          value:
            "Con frecuencia me animo a usar redes para mi aprendizaje en este espacio curricular",
          text: "Con frecuencia me animo a usar redes para mi aprendizaje en este espacio curricular",
        },
        {
          value:
            "La mayor parte de las veces me animo a usar redes para mi aprendizaje en este espacio curricular",
          text: "La mayor parte de las veces me animo a usar redes para mi aprendizaje en este espacio curricular",
        },
        {
          value:
            "Siempre me animo a usar redes para mi aprendizaje en este espacio curricular",
          text: "Siempre me animo a usar redes para mi aprendizaje en este espacio curricular",
        },
      ],
    },
  ];

  questions04 = [
    { id: 1, texto: "Seguridad de la Información" },
    { id: 2, texto: "Gestión de Riesgos" },
  ];

  options04 = [
    { valor: "insuficiente", texto: "Insuficiente" },
    { valor: "necesita_mejorar", texto: "Necesita mejorar" },
    { valor: "bueno", texto: "Bueno" },
    { valor: "sobresaliente", texto: "Sobresaliente" },
    { valor: "excelente", texto: "Excelente" },
  ];

  commentsAutoevaluacion = ["Comentario 1", "Comentario 2", "Comentario 3"];

  // Información quemada para pruebas
  formData = {
    tipoEvaluacion: "1",
    docente: "1",
    espacioAcademico: "1",
    seccion: [
      {
        orden: 1,
        nombreSeccion: "Sección 1",
        items: {
          descripcion: [
            {
              orden: 1,
              nombreItem: "Descripción 1",
              campo: {
                tipoCampo: 1,
                escala: [{ valor1: "Insuficiente" }, { valor2: "Excelente" }],
              },
            },
          ],
          cuantitativo: [
            {
              orden: 1,
              nombreItem: "Cuantitativo 1",
              campo: {
                tipoCampo: 2,
                valor: 0,
                escala: [
                  { valor1: "Insuficiente", peso1: 1 },
                  { valor2: "Excelente", peso2: 5 },
                ],
              },
            },
          ],
          cualitativo: [
            {
              orden: 1,
              nombreItem: "Cualitativo 1",
              campo: {
                tipoCampo: 3,
              },
            },
          ],
          soporte: [
            {
              orden: 1,
              nombreItem: "Soporte 1",
              campo: {
                tipoCampo: 4,
                archivo: [],
              },
            },
          ],
        },
      },
    ],
  };

  

  get allQuestions() {
    return [...this.questions01, ...this.questions02, ...this.questions03];
  }

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.initializeForm();
    this.initializeData();
  }
  ngOnInit() {
    console.log(
      "DynamicFormComponent initialized with normalform:",
      this.normalform
    );

    // Configuración inicial para definir el tipo de formulario si no está definido
    if (!this.normalform.tipo_formulario) {
      this.normalform.tipo_formulario = "mini";
    }

    // Agregando los campos para el nuevo ámbito en Autoevaluación II
    if (this.normalform.tipo_formulario === "autoevaluacion-ii") {
      this.normalform.campos.push({
        nombre: "seguridad_informacion",
        tipo: "select",
        opciones: [
          { valor: "insuficiente", texto: "Insuficiente" },
          { valor: "necesita_mejorar", texto: "Necesita mejorar" },
          { valor: "bueno", texto: "Bueno" },
          { valor: "sobresaliente", texto: "Sobresaliente" },
          { valor: "excelente", texto: "Excelente" },
        ],
        preguntas: [
          { id: 1, texto: "Seguridad de la Información" },
          { id: 2, texto: "Gestión de Riesgos" },
        ],
      });
    }

    // Inicializar el formulario basado en el tipo de formulario
    this.initializeFormFields();

    // Configuración específica para el formulario informativo de Coevaluación II
    if (this.normalform.tipo_formulario === "informativo") {
      this.initializeInformativoForm();
    }

    this.initializeFormFields();
  }

  initializeInformativoForm() {
    const formGroup: { [key: string]: any } = {};
    this.normalform.secciones[0].ambitos.forEach(
      (ambito: any, index: number) => {
        formGroup[`ambito_${index + 1}`] = new FormControl(
          this.modeloData[`ambito_${index + 1}`] || ""
        );
      }
    );
    formGroup["promedio_asignado"] = new FormControl(
      this.modeloData.promedio_asignado || ""
    );
    this.form = this.fb.group(formGroup);
    console.log("Informativo Form initialized:", this.form.value);
  }

  ngOnChanges(changes: any) {
    if (changes.normalform && changes.normalform.currentValue) {
      console.log("normalform changed:", changes.normalform.currentValue);
      this.normalform = changes.normalform.currentValue;
      this.initializeFormFields();
    }

    if (changes.modeloData && changes.modeloData.currentValue) {
      console.log("modeloData changed:", changes.modeloData.currentValue);
      this.modeloData = changes.modeloData.currentValue;
      this.populateFormWithModelData();
    }
  }

  private initializeForm() {
    console.log("Initializing form...");
    const formGroup: { [key: string]: any } = {};
    this.normalform?.campos?.forEach((campo: any) => {
      formGroup[campo.nombre] = new FormControl(campo.valor || "");
    });
    this.form = this.fb.group(formGroup);
  }

  private initializeData() {
    console.log("Initializing data...");
    this.data = {
      valid: true,
      data: {},
      percentage: 0,
      files: [],
    };
  }

  private initializeFormFields() {
    if (this.normalform && Array.isArray(this.normalform.campos)) {
      console.log(
        "Initializing form fields with campos:",
        this.normalform.campos
      );
      const formGroup: { [key: string]: any } = {};
      this.normalform.campos.forEach((c: any) => {
        c.preguntas.forEach((pregunta: any) => {
          formGroup[`${c.nombre}_${pregunta.id}`] = new FormControl("");
        });
      });
      this.form = this.fb.group(formGroup);
      console.log("Form initialized:", this.form.value);
    }
  }

  private populateFormWithModelData() {
    if (this.normalform.campos) {
      console.log("Populating form with model data:", this.modeloData);
      this.normalform.campos.forEach((element: any) => {
        const key = Object.keys(this.modeloData).find(
          (k) => k === element.nombre && this.modeloData[k] !== null
        );
        if (key) {
          this.populateFormField(element, this.modeloData[key]);
        }
      });
      this.setPercentage();
    }
  }

  private populateFormField(element: any, value: any) {
    switch (element.tipo) {
      case "selectmultiple":
        element.valor = [];
        value.forEach((val: any) => {
          element.valor.push(val);
        });
        break;
      case "select":
      case "mat-date":
        element.valor = value;
        break;
      case "file":
        element.url = value;
        break;
      default:
        element.valor = value;
    }
    this.form.get(element.nombre)?.setValue(element.valor);
    console.log(
      "Populated field:",
      element.nombre,
      "with value:",
      element.valor
    );
  }

  validarForm() {
    if (this.form.valid) {
      const formData = this.form.value;
  
      // Construyendo la estructura para la petición
      const requestData = {
        id_periodo: 1,
        id_tercero: 1,
        id_evaliado: 1,
        proyecto_curricular: 123, // ajustar esto dinámicamente
        espacio_academico: 12, // ajustar esto dinámicamente
        plantilla_id: 456, //  ajustar esto dinámicamente
        respuestas: [] as any[], 
      };
  
      // Mapeando el formulario a la estructura de 'respuestas'
      Object.keys(formData).forEach((key) => {
        const valor = formData[key];
        const itemId = parseInt(key.split('_')[1], 10);
  
        if (Array.isArray(valor)) {
          // Si es un array, se asume que son archivos
          const respuesta = {
            item_id: itemId,
            archivos: valor.map(f => f.name),
          };
          requestData.respuestas.push(respuesta);
        } else {
          const respuesta = {
            item_id: itemId,
            valor: valor,
          };
          requestData.respuestas.push(respuesta);
        }
      });
  
      // Mostrando el JSON resultante en la consola
      console.log("Datos del formulario para la petición:", requestData);
  
      // Emisión del resultado
      this.result.emit(requestData);
    } else {
      console.log("Formulario no válido");
    }
  }
  

  setPercentage() {
    let requeridos = 0;
    let resueltos = 0;
    this.normalform.campos.forEach((form_element: any) => {
      if (form_element.requerido && !form_element.ocultar) {
        requeridos += 1;
        resueltos += form_element.valor ? 1 : 0;
      }
    });
    const percentage = resueltos / requeridos;
    this.percentage.emit(percentage);
    console.log("Form completion percentage:", percentage);
  }

  onFileChange(event: any, campo: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      campo.urlTemp = URL.createObjectURL(file);
      campo.url = this.sanitizer.bypassSecurityTrustUrl(campo.urlTemp);
      campo.valor = file;
    }
  }

  downloadFile(url: string): void {
    window.open(url, "_blank");
  }

  clearForm() {
    this.form.reset();
    console.log("Form cleared");
  }

  getStepControlName(step: number): string {
    return `step_${step}`;
  }

  onChangeDate(event: any, c: any) {
    c.valor = event.value;
  }

  displayWithFn(value: any): string {
    return value ? value.nombre || value.label || value : "";
  }

  setNewValue(event: any, field: any): void {
    field.valor = event.option.value;
    this.validCampo(field);
  }

  download(url: string, nombre: string, w: number, h: number) {
    const link = document.createElement("a");
    link.href = url;
    link.download = nombre;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  validCampo(c: any, emit = true): boolean {
    if (this.isFieldInvalid(c)) {
      c.alerta = "** Debe llenar este campo";
      c.clase = "form-control form-control-danger";
      return false;
    }
    this.validateField(c);
    if (c.entrelazado && emit) {
      this.interlaced.emit(c);
    }
    return true;
  }

  private isFieldInvalid(c: any): boolean {
    return (
      c.requerido &&
      (!c.valor || (c.etiqueta === "file" && !c.valor.name) || c.valor === "")
    );
  }

  private validateField(c: any) {
    if (c.etiqueta === "input" && c.tipo === "number") {
      this.validateNumberField(c);
    } else if (c.etiqueta === "input" && c.tipo === "email") {
      this.validateEmailField(c);
    } else {
      c.clase = "form-control form-control-success";
      c.alerta = "";
    }
  }

  private validateNumberField(c: any) {
    c.valor = parseInt(c.valor, 10);
    if (c.valor < c.minimo) {
      c.clase = "form-control form-control-danger";
      c.alerta = `El valor no puede ser menor que ${c.minimo}`;
    }
  }

  private validateEmailField(c: any) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(c.valor)) {
      c.clase = "form-control form-control-danger";
      c.alerta = "No es un correo válido";
    }
  }

  checkConfirmacion(): boolean {
    let valido = true;
    const camposAValidar = this.normalform.campos.filter(
      (campo: any) => campo.etiqueta === "inputConfirmacion"
    );
    if (camposAValidar.length % 2 !== 0) {
      console.warn("Error: Un campo de confirmación no tiene pareja");
      return false;
    }

    for (let i = 0; i < camposAValidar.length; i += 2) {
      if (camposAValidar[i].valor !== camposAValidar[i + 1].valor) {
        this.markAsInvalid(camposAValidar[i], camposAValidar[i + 1]);
        valido = false;
      } else {
        this.markAsValid(camposAValidar[i], camposAValidar[i + 1]);
      }
    }
    return valido;
  }

  private markAsInvalid(field1: any, field2: any) {
    field1.clase = "form-control form-control-danger";
    field2.clase = "form-control form-control-danger";
    field1.alerta = field1.mensajeIguales || "Los valores no coinciden";
    field2.alerta = field2.mensajeIguales || "Los valores no coinciden";
  }

  private markAsValid(field1: any, field2: any) {
    field1.clase = "form-control form-control-success";
    field2.clase = "form-control form-control-success";
    field1.alerta = "";
    field2.alerta = "";
  }

  getUniqueSteps(campos: any[]): number[] {
    const uniqueSteps: number[] = [];
    for (const campo of campos) {
      if (
        !uniqueSteps.includes(campo.step) &&
        this.form.get(this.getStepControlName(campo.step))
      ) {
        uniqueSteps.push(campo.step);
      }
    }
    return uniqueSteps;
  }

  getFieldsInStep(step: number): any[] {
    return this.normalform.campos.filter((c: any) => c.step === step);
  }

  onCheckboxChange(c: any) {
    c.valor = !c.valor;
    c.alerta = "";
  }

  auxButton(c: any) {
    const result: any = {};
    this.normalform.campos.forEach((d: any) => {
      result[d.nombre] = d.etiqueta === "file" ? { file: d.File } : d.valor;
    });
    const dataTemp = { data: result, button: c.nombre };
    c.resultado ? this.result.emit(dataTemp) : this.resultAux.emit(dataTemp);
  }
}


