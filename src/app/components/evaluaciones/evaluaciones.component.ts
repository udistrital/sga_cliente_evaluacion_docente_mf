import { Component, OnInit } from "@angular/core";
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
  showDynamicForm = false;
  formData: any = {};
  modeloData: any = {};
  heteroForm: FormGroup;
  coevaluacionIIForm: FormGroup;
  coevaluacionIForm: FormGroup;
  autoevaluacionIIForm: FormGroup;
  autoevaluacionIForm: FormGroup;
  normalform: any;

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

    this.userService.getUserRoles().then((roles) => {
      this.userRoles = roles;
      console.log("User roles loaded:", this.userRoles);
    });
  }

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
      proyectoCurricular2: ["", Validators.required],
      proyectoCurricularN: ["", Validators.required],
      espacioAcademico: ["", Validators.required],
      espacioAcademico2: ["", Validators.required],
      espacioAcademicoN: ["", Validators.required],
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
      formularioProceso: ["", Validators.required],
    });
  }

  onSelectChange(event: MatSelectChange) {
    this.selectedEvaluation = event.value;
    console.log("Selected evaluation:", this.selectedEvaluation);

    this.showDynamicForm = true;

    switch (this.selectedEvaluation) {
      case "heteroevaluacion":
        this.loadHeteroevaluacionData();
        break;
      case "autoevaluacion-i":
        this.loadAutoevaluacionIData();
        break;
      case "coevaluacion-i":
        this.loadCoevaluacionIData();
        break;
      case "autoevaluacion-ii":
        this.loadAutoevaluacionIIData();
        break;
      case "coevaluacion-ii":
        this.loadCoevaluacionIIData();
        break;
      default:
        this.showDynamicForm = false;
        break;
    }

    console.log("Form data after selection:", this.formData);
  }

  loadHeteroevaluacionData() {
    this.formData = {
      tipo_formulario: "mini",
      titulo: "Evaluación de Heteroevaluación",
      formato: "Código SIGUD por asignar",
      actor: "Estudiantes",
      cronograma: "Semana 4 a 7 del calendario académico",
      rubricas: "Selección múltiple",
      instruccion: `Estimado estudiante: Por favor evalúe formativamente a su docente utilizando el formato dispuesto para ello. 
                    Los ítems 01 a 20 de selección múltiple con única respuesta son obligatorios. 
                    Puede realizar anotaciones de felicitación o de sugerencias respetuosas en los espacios destinados para tal fin. 
                    Utilice como referencia la siguiente escala para medir el grado de desempeño a evaluar:`,
      escalas: [
        {
          label: "INSUFICIENTE",
          descripcion: "No sucede y no se demuestra el criterio",
        },
        {
          label: "NECESITA MEJORAR",
          descripcion: "Sucede parcialmente pero no se demuestra el criterio",
        },
        {
          label: "BUENO",
          descripcion:
            "Sucede con frecuencia y se demuestra el criterio en un nivel básico",
        },
        {
          label: "SOBRESALIENTE",
          descripcion:
            "Sucede la mayor parte del tiempo y se demuestra el criterio de forma adecuada",
        },
        {
          label: "EXCELENTE",
          descripcion:
            "Sucede siempre y se demuestra el criterio completamente",
        },
      ],
      comentariosLabel:
        "Dado los ítems anteriores, quisiera felicitarlo o sugerirle respetuosamente lo siguiente:",
      comentariosPlaceholder: "Ingrese sus comentarios aquí...",
      campos: [
        // Preguntas de Ámbito 01: LA DOCENCIA
        {
          nombre: "item1",
          label:
            "01. Demuestra conocimiento de los contenidos que se van a enseñar en mi espacio curricular",
          tipo: "radio",
        },
        {
          nombre: "item2",
          label:
            "02. Demuestra habilidades para conducir procesos de enseñanza-aprendizaje según los contenidos de mi espacio curricular",
          tipo: "radio",
        },
        {
          nombre: "item3",
          label:
            "03. Demuestra comprensión de ritmos de aprendizaje diferenciados y adapta el aula de clase a estas necesidades",
          tipo: "radio",
        },
        {
          nombre: "item4",
          label: "04. Demuestra habilidades para organizar y explicar ideas",
          tipo: "radio",
        },
        {
          nombre: "item5",
          label:
            "05. Demuestra habilidades para observar su aula, diagnosticar necesidades y adaptarse al contexto",
          tipo: "radio",
        },
        // Preguntas de Ámbito 02: LA ENSEÑANZA
        {
          nombre: "item6",
          label:
            "06. Me da a conocer lo que debo saber, comprender y ser capaz de hacer en mi espacio curricular",
          tipo: "radio",
        },
        {
          nombre: "item7",
          label:
            "07. Me enseña lo que debo saber, comprender y ser capaz de hacer en mi espacio curricular",
          tipo: "radio",
        },
        {
          nombre: "item8",
          label:
            "08. Integra en la enseñanza las competencias, la didáctica y la evaluación",
          tipo: "radio",
        },
        {
          nombre: "item9",
          label:
            "09. Logra que sepa actuar de manera competente en contextos particulares señalados por el contenido de mi espacio curricular",
          tipo: "radio",
        },
        {
          nombre: "item10",
          label:
            "10. Me enseña a relacionar las competencias y los resultados de aprendizaje de mi espacio curricular",
          tipo: "radio",
        },
        // Preguntas de Ámbito 03: LA PRÁCTICA
        {
          nombre: "item11",
          label:
            "11. Desarrolla las unidades de aprendizaje de mi espacio curricular",
          tipo: "radio",
        },
        {
          nombre: "item12",
          label:
            "12. Evalúa mis evidencias de aprendizaje y me proporciona devoluciones claras para mi mejoramiento",
          tipo: "radio",
        },
        {
          nombre: "item13",
          label:
            "13. Demuestra compromiso general con el ambiente de aprendizaje de mi salón",
          tipo: "radio",
        },
        {
          nombre: "item14",
          label:
            "14. Demuestra respeto por diversidades y diferencias sexo-genéricas, cognitivas, lingüísticas, raciales y culturales dentro y fuera de mi salón",
          tipo: "radio",
        },
        {
          nombre: "item15",
          label:
            "15. Me motiva para el alcance de competencias y resultados de aprendizaje",
          tipo: "radio",
        },
        {
          nombre: "item16",
          label:
            "16. Promueve el desarrollo de autoconceptos positivos para el estudiantado",
          tipo: "radio",
        },
        {
          nombre: "item17",
          label:
            "17. Realiza actividades apropiadas para la consecución de los resultados de aprendizaje y el desarrollo de competencias",
          tipo: "radio",
        },
        {
          nombre: "item18",
          label:
            "18. Recibe y maneja positivamente preguntas, ideas y opiniones que mantienen al estudiantado pendiente e involucrado en clase",
          tipo: "radio",
        },
        {
          nombre: "item19",
          label:
            "19. Se adapta a niveles y ritmos de aprendizaje diferenciados tanto míos como de mis compañer@s de clase",
          tipo: "radio",
        },
        {
          nombre: "item20",
          label:
            "20. Es evidente que prepara sus clases y actividades para estimular mi logro de resultados de aprendizaje y competencias",
          tipo: "radio",
        },
      ],
      btn: "Guardar",
      btnLimpiar: "Limpiar",
    };

    this.modeloData = {
      item1: "",
      item2: "",
      item3: "",
      item4: "",
      item5: "",
      item6: "",
      item7: "",
      item8: "",
      item9: "",
      item10: "",
      item11: "",
      item12: "",
      item13: "",
      item14: "",
      item15: "",
      item16: "",
      item17: "",
      item18: "",
      item19: "",
      item20: "",
    };
  }

  loadAutoevaluacionIData() {
    this.formData = {
      tipo_formulario: "autoevaluacion-i",
      titulo: "Autoevaluación Estudiantil",
      formato: "Autoevaluación del Aprendizaje",
      actor: "Estudiantes",
      cronograma: "Al final de cada unidad de aprendizaje",
      rubricas: "Selección múltiple",
      instruccion: `Estimado estudiante: Por favor autoevalúe su desempeño como estudiante en este espacio curricular. 
                    Los ítems 01 a 05 de selección múltiple con única respuesta son obligatorios. 
                    Puede realizar anotaciones de mejoramiento para conseguir sus resultados de aprendizaje en los espacios destinados para tal fin.`,
      campos: [
        {
          nombre: "item1",
          label:
            "01. Asumo las actividades que me plantea este espacio curricular en cada unidad de aprendizaje",
          tipo: "radio",
          opciones: [
            { label: "Opción 1", descripcion: "Evito hacer las actividades" },
            {
              label: "Opción 2",
              descripcion: "A veces me animan las actividades",
            },
            {
              label: "Opción 3",
              descripcion:
                "Con frecuencia hago las actividades del espacio curricular",
            },
            {
              label: "Opción 4",
              descripcion:
                "Me encantan las actividades si he tenido éxito en actividades similares",
            },
            {
              label: "Opción 5",
              descripcion: "Espero con positivismo el próximo reto",
            },
          ],
        },
        {
          nombre: "item2",
          label:
            "02. Siento que puedo lograr los resultados de aprendizaje esperados",
          tipo: "radio",
          opciones: [
            { label: "Opción 1", descripcion: "Nunca" },
            { label: "Opción 2", descripcion: "A veces" },
            { label: "Opción 3", descripcion: "Con alguna frecuencia" },
            { label: "Opción 4", descripcion: "La mayor parte del tiempo" },
            { label: "Opción 5", descripcion: "Siempre" },
          ],
        },
        {
          nombre: "item3",
          label:
            "03. Acepto los resultados de la evaluación que realiza mi docente",
          tipo: "radio",
          opciones: [
            {
              label: "Opción 1",
              descripcion: "Me siento mal con los resultados negativos",
            },
            {
              label: "Opción 2",
              descripcion:
                "Me siento bien solo si me interesa el espacio curricular",
            },
            {
              label: "Opción 3",
              descripcion:
                "Con frecuencia miro las devoluciones de mi docente positivamente",
            },
            {
              label: "Opción 4",
              descripcion:
                "La mayor parte del tiempo miro las devoluciones de mi docente positivamente",
            },
            {
              label: "Opción 5",
              descripcion:
                "Siempre miro las devoluciones de mi docente positivamente",
            },
          ],
        },
        {
          nombre: "item4",
          label: "04. Estrategias de autoaprendizaje (I)",
          tipo: "radio",
          opciones: [
            {
              label: "Opción 1",
              descripcion:
                "No movilizo recursos personales (conocimientos, saber hacer, cualidades, cultura, recursos emocionales) para mi aprendizaje en este espacio curricular",
            },
            {
              label: "Opción 2",
              descripcion:
                "A veces movilizo recursos personales (conocimientos, saber hacer, cualidades, cultura, recursos emocionales) para mi aprendizaje en este espacio curricular",
            },
            {
              label: "Opción 3",
              descripcion:
                "Con frecuencia movilizo recursos personales (conocimientos, saber hacer, cualidades, cultura, recursos emocionales) para mi aprendizaje en este espacio curricular",
            },
            {
              label: "Opción 4",
              descripcion:
                "La mayor parte de las veces movilizo recursos personales (conocimientos, saber hacer, cualidades, cultura, recursos emocionales) para mi aprendizaje en este espacio curricular",
            },
            {
              label: "Opción 5",
              descripcion:
                "Siempre movilizo recursos personales (conocimientos, saber hacer, cualidades, cultura, recursos emocionales) para mi aprendizaje en este espacio curricular",
            },
          ],
        },
        {
          nombre: "item5",
          label: "05. Estrategias de autoaprendizaje (II)",
          tipo: "radio",
          opciones: [
            {
              label: "Opción 1",
              descripcion:
                "No me animo a usar redes (bancos de datos, documentos y mi experiencia) para mi aprendizaje en este espacio curricular",
            },
            {
              label: "Opción 2",
              descripcion:
                "A veces me animo a usar redes (bancos de datos, documentos y mi experiencia) para mi aprendizaje en este espacio curricular",
            },
            {
              label: "Opción 3",
              descripcion:
                "Con frecuencia me animo a usar redes (bancos de datos, documentos y mi experiencia) para mi aprendizaje en este espacio curricular",
            },
            {
              label: "Opción 4",
              descripcion:
                "La mayor parte de las veces me animo a usar redes (bancos de datos, documentos y mi experiencia) para mi aprendizaje en este espacio curricular",
            },
            {
              label: "Opción 5",
              descripcion:
                "Siempre me animo a usar redes (bancos de datos, documentos y mi experiencia) para mi aprendizaje en este espacio curricular",
            },
          ],
        },
      ],
      comentariosLabel:
        "Dado su respuesta anterior, escriba las acciones que tomará para fortalecer su éxito en este espacio curricular:",
      comentariosPlaceholder: "Ingrese sus acciones aquí...",
      btn: "Guardar",
      btnLimpiar: "Limpiar",
    };

    this.modeloData = {
      item1: "",
      item2: "",
      item3: "",
      item4: "",
      item5: "",
    };
    console.log("Autoevaluacion I data loaded:", this.formData);
  }

  loadCoevaluacionIData() {
    this.formData = {
      tipo_formulario: "coevaluacion-i",
      titulo: "Acta de Coevaluación",
      formato: "Acta de co-evaluación del espacio curricular",
      actor: "Cuerpo docente y estudiantado",
      cronograma: "Semanas 10 a 11",
      documento: "Acta de co-evaluación del espacio curricular",
      instruccion: `Estimado cuerpo docente y estudiantado: 
                    Por favor co-evalúen con compromisos mutuos su desempeño docente y el de sus estudiantes en este espacio curricular utilizando el formato dispuesto para ello. 
                    Por favor cargue el acta resultado de este ejercicio de coevaluación.`,
      campos: [
        {
          nombre: "espacioCurricular",
          label: "ESPACIO CURRICULAR",
          tipo: "text",
          placeholder: "Nombre del espacio curricular",
        },
        {
          nombre: "codigoEspacioCurricular",
          label: "CÓDIGO DEL ESPACIO CURRICULAR",
          tipo: "text",
          placeholder: "Código del espacio curricular",
        },
        {
          nombre: "grupo",
          label: "GRUPO",
          tipo: "text",
          placeholder: "Grupo",
        },
        {
          nombre: "observacionesDocente",
          label:
            "Frente a la heteroevaluación realizada por el estudiantado a la persona docente, ésta tiene las siguientes observaciones:",
          tipo: "textarea",
          cantidad: 3, // Tres líneas de observaciones
        },
        {
          nombre: "observacionesEstudiante",
          label:
            "Frente a la heteroevaluación realizada por el estudiantado sobre sí mismos, se tienen las siguientes observaciones conjuntas:",
          tipo: "textarea",
          cantidad: 3, // Tres líneas de observaciones
        },
        {
          nombre: "planAccion",
          label:
            "Tanto estudiantes como persona docente proponen el siguiente plan de acción:",
          tipo: "textarea",
          cantidad: 3, // Tres líneas para el plan de acción
        },
        {
          nombre: "intervinientes",
          label: "Listado de personas intervinientes:",
          tipo: "textarea",
          cantidad: 3, // Tres líneas para listar a las personas intervinientes
        },
        {
          nombre: "cargarEvidencias",
          label:
            "El cuerpo docente debe cargar el Acta de Co-evaluación del espacio curricular en este botón:",
          tipo: "file",
          buttonLabel: "Cargar evidencias",
        },
      ],
      btn: "Guardar",
      btnLimpiar: "Limpiar",
    };

    this.modeloData = {
      espacioCurricular: "",
      codigoEspacioCurricular: "",
      grupo: "",
      observacionesDocente: "",
      observacionesEstudiante: "",
      planAccion: "",
      intervinientes: "",
    };
  }

  loadAutoevaluacionIIData() {
    this.formData = {
      tipo_formulario: "autoevaluacion-ii",
      titulo: "Autoevaluación del cuerpo docente",
      formato: "Código SIGUD por asignar",
      actor: "Docentes",
      cronograma: "Semanas 10 a 11",
      rubricas: "Selección múltiple",
      instruccion: `Estimado cuerpo docente:
                    Por favor autoevalúe con plan de mejoramiento su desempeño docente utilizando el formato dispuesto para ello.
                    Los ítems 01 a 15 con única respuesta son obligatorios en cada dimensión.`,
      escala: `INSUFICIENTE = No sucede y no se demuestra el criterio
              NECESITA MEJORAR = Sucede parcialmente pero no se demuestra el criterio
              BUENO = Sucede con frecuencia y se demuestra el criterio en un nivel básico
              SOBRESALIENTE = Sucede la mayor parte del tiempo y se demuestra el criterio de forma adecuada
              EXCELENTE = Sucede siempre y se demuestra el criterio completamente`,
      campos: [
        // Ámbito 01: LA DOCENCIA
        {
          nombre: "docencia",
          label: "ÁMBITO 01: LA DOCENCIA",
          tipo: "select",
          opciones: [
            { valor: "insuficiente", texto: "Insuficiente" },
            { valor: "necesita_mejorar", texto: "Necesita mejorar" },
            { valor: "bueno", texto: "Bueno" },
            { valor: "sobresaliente", texto: "Sobresaliente" },
            { valor: "excelente", texto: "Excelente" },
          ],
          preguntas: [
            {
              id: 1,
              texto:
                "01. No conozco los contenidos que imparto y no tengo habilidades para conducir procesos de enseñanza-aprendizaje",
            },
            {
              id: 2,
              texto:
                "02. Conozco parcialmente los contenidos que imparto y se me dificulta conducir procesos de enseñanza-aprendizaje",
            },
            {
              id: 3,
              texto:
                "03. Conozco parcialmente los contenidos que imparto, pero tengo habilidades para conducir procesos de enseñanza-aprendizaje",
            },
            {
              id: 4,
              texto:
                "04. Conozco lo que enseño y tengo habilidades para conducir procesos de enseñanza-aprendizaje",
            },
            {
              id: 5,
              texto:
                "05. Vinculo mi investigación propia a lo que enseño y tengo habilidades para conducir procesos de enseñanza-aprendizaje",
            },
          ],
        },
        // Ámbito 02: LA ENSEÑANZA
        {
          nombre: "ensenanza",
          label: "ÁMBITO 02: LA ENSEÑANZA",
          tipo: "select",
          opciones: [
            { valor: "insuficiente", texto: "Insuficiente" },
            { valor: "necesita_mejorar", texto: "Necesita mejorar" },
            { valor: "bueno", texto: "Bueno" },
            { valor: "sobresaliente", texto: "Sobresaliente" },
            { valor: "excelente", texto: "Excelente" },
          ],
          preguntas: [
            {
              id: 6,
              texto:
                "06. No doy a conocer las competencias y resultados de aprendizaje ni integro en mi enseñanza competencias, didáctica y evaluación",
            },
            {
              id: 7,
              texto:
                "07. Doy a conocer a mis alumnos parcialmente los contenidos que imparto y se me dificulta integrar en mi enseñanza competencias, didáctica y evaluación",
            },
            {
              id: 8,
              texto:
                "08. Doy a conocer a mis alumnos parcialmente los contenidos que imparto, pero integro en mi enseñanza competencias, didáctica y evaluación",
            },
            {
              id: 9,
              texto:
                "09. Doy a conocer a mis alumnos los contenidos que imparto e integro en mi enseñanza competencias, didáctica y evaluación",
            },
            {
              id: 10,
              texto:
                "10. Doy a conocer a mis alumnos los contenidos que imparto basados en mi investigación e integro en mi enseñanza competencias, didáctica y evaluación",
            },
          ],
        },
        // Ámbito 03: LA PRÁCTICA (Datos de la imagen)
        {
          nombre: "practica",
          label: "ÁMBITO 03: LA PRÁCTICA",
          tipo: "select",
          opciones: [
            { valor: "insuficiente", texto: "Insuficiente" },
            { valor: "necesita_mejorar", texto: "Necesita mejorar" },
            { valor: "bueno", texto: "Bueno" },
            { valor: "sobresaliente", texto: "Sobresaliente" },
            { valor: "excelente", texto: "Excelente" },
          ],
          preguntas: [
            {
              id: 11,
              texto:
                "11. No demuestro compromiso con el clima de aprendizaje y no realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
            },
            {
              id: 12,
              texto:
                "12. Demuestro parcialmente compromiso con el clima de aprendizaje y no realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
            },
            {
              id: 13,
              texto:
                "13. Demuestro parcialmente compromiso con el clima de aprendizaje, pero realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
            },
            {
              id: 14,
              texto:
                "14. Demuestro con frecuencia compromiso con el clima de aprendizaje y realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
            },
            {
              id: 15,
              texto:
                "15. Demuestro siempre mi compromiso con el clima de aprendizaje y realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
            },
          ],
        },
      ],
      btnLimpiar: "Limpiar",
      btn: "Guardar",
      extra: "cargue_evidencias",
    };
  }

  loadCoevaluacionIIData() {
    this.formData = {
      tipo_formulario: "informativo",
      titulo: "Coevaluación II",
      formato: "Código SIGUD por asignar",
      actor: "Consejos Curriculares",
      cronograma: "Semana 14 a 15",
      rubricas: "Selección múltiple",
      instruccion: `Estimado Consejo Curricular:
                      Por favor coevalúe con plan de mejoramiento su desempeño docente utilizando el formato dispuesto para ello. 
                      Los ítems PROMEDIO con única respuesta son obligatorios en cada dimensión.`,
      escala: `INSUFICIENTE = No sucede y no se demuestra el criterio
                NECESITA MEJORAR = Sucede parcialmente pero no se demuestra el criterio
                BUENO = Sucede con frecuencia y se demuestra el criterio en un nivel básico
                SOBRESALIENTE = Sucede la mayor parte del tiempo y se demuestra el criterio de forma adecuada
                EXCELENTE = Sucede siempre y se demuestra el criterio completamente`,
      secciones: [
        {
          title: "SECCIÓN 01 - ANÁLISIS DE LA HETEROEVALUACIÓN",
          instruccion:
            "De acuerdo con los resultados de la heteroevaluación conceptúen un promedio y decidan una opción de la escala provista.",
          ambitos: [
            {
              ambito: "01. ÁMBITO 01: DOCENCIA",
              opciones: [
                "Insuficiente",
                "Necesita mejorar",
                "Bueno",
                "Sobresaliente",
                "Excelente",
              ].map((texto) => ({
                valor: texto.toLowerCase().replace(" ", "_"),
                texto,
              })),
            },
            {
              ambito: "02. ÁMBITO 02: ENSEÑANZA",
              opciones: [
                "Insuficiente",
                "Necesita mejorar",
                "Bueno",
                "Sobresaliente",
                "Excelente",
              ].map((texto) => ({
                valor: texto.toLowerCase().replace(" ", "_"),
                texto,
              })),
            },
            {
              ambito: "03. ÁMBITO 03: PRÁCTICA",
              opciones: [
                "Insuficiente",
                "Necesita mejorar",
                "Bueno",
                "Sobresaliente",
                "Excelente",
              ].map((texto) => ({
                valor: texto.toLowerCase().replace(" ", "_"),
                texto,
              })),
            },
            {
              ambito: "04. AUTOGESTIÓN DEL ESTUDIANTADO",
              opciones: [
                "Insuficiente",
                "Necesita mejorar",
                "Bueno",
                "Sobresaliente",
                "Excelente",
              ].map((texto) => ({
                valor: texto.toLowerCase().replace(" ", "_"),
                texto,
              })),
            },
          ],
        },
      ],
      promedio_asignado: {
        opciones: [
          "Insuficiente",
          "Necesita mejorar",
          "Bueno",
          "Sobresaliente",
          "Excelente",
        ].map((texto) => ({
          valor: texto.toLowerCase().replace(" ", "_"),
          texto,
        })),
      },
    };

    interface Opcion {
      valor: string;
      texto: string;
    }

    interface Ambito {
      ambito: string;
      opciones: Opcion[];
    }

    this.normalform = {
      titulo: this.formData.titulo,
      formato: this.formData.formato,
      actor: this.formData.actor,
      cronograma: this.formData.cronograma,
      rubricas: this.formData.rubricas,
      campos: this.formData.secciones[0].ambitos.map(
        (ambito: Ambito, index: number) => ({
          nombre: `ambito_${index + 1}`,
          label: ambito.ambito,
          tipo: "radio",
          opciones: ambito.opciones.map((opcion: Opcion) => ({
            valor: opcion.valor,
            texto: opcion.texto,
          })),
        })
      ),
    };

    this.modeloData = {
      ambito_01_docencia: "",
      ambito_02_ensenanza: "",
      ambito_03_practica: "",
      ambito_04_autogestion: "",
      promedio_asignado: "",
    };
  }

  handleFormResult(result: any) {
    console.log("Resultados del formulario dinámico:", result);
    // Aquí se puede manejar los datos resultantes del formulario dinámico
  }

  setHeteroevaluacionData() {
    this.heteroForm.patchValue({
      inicioFecha: moment("2024-01-15", "YYYY-MM-DD").format("DD/MM/YYYY"),
      finFecha: moment("2024-05-30", "YYYY-MM-DD").format("DD/MM/YYYY"),
      estudianteNombre: "Estudiante Heteroevaluación",
      estudianteIdentificacion: "123456789H",
      proyectoCurricular: "proyecto1",
      docenteNombre: "Docente Heteroevaluación",
      descripcionProceso: "Descripción del proceso de Heteroevaluación.",
    });
  }

  setCoevaluacionIData() {
    this.coevaluacionIForm.patchValue({
      inicioFecha: moment("2024-02-01", "YYYY-MM-DD").format("DD/MM/YYYY"),
      finFecha: moment("2024-06-15", "YYYY-MM-DD").format("DD/MM/YYYY"),
      proyectoCurricular: "proyecto2",
      docenteNombre: "Docente Coevaluación I",
      descripcionProceso: "Descripción del proceso de Coevaluación I.",
      espacioAcademico: "Espacio Académico Coevaluación I",
      grupoSeleccionado: "grupo2",
    });
  }

  setCoevaluacionIIData() {
    this.coevaluacionIIForm.patchValue({
      inicioFecha: moment("2024-03-01", "YYYY-MM-DD").format("DD/MM/YYYY"),
      finFecha: moment("2024-07-01", "YYYY-MM-DD").format("DD/MM/YYYY"),
      proyectoCurricular: "proyecto1",
      docenteNombre: "Docente Coevaluación II",
      descripcionProceso: "Descripción del proceso de Coevaluación II.",
      espacioAcademico: "Espacio Académico Coevaluación II",
    });
  }

  setAutoevaluacionIData() {
    this.autoevaluacionIForm.patchValue({
      inicioFecha: moment("2024-04-01", "YYYY-MM-DD").format("DD/MM/YYYY"),
      finFecha: moment("2024-08-01", "YYYY-MM-DD").format("DD/MM/YYYY"),
      estudianteNombre: "Estudiante Autoevaluación I",
      estudianteIdentificacion: "123456789A",
      proyectoCurricular: "proyecto1",
      descripcionProceso: "Descripción del proceso de Autoevaluación I.",
    });
  }

  setAutoevaluacionIIData() {
    this.autoevaluacionIIForm.patchValue({
      inicioFecha: moment("2024-05-01", "YYYY-MM-DD").format("DD/MM/YYYY"),
      finFecha: moment("2024-09-01", "YYYY-MM-DD").format("DD/MM/YYYY"),
      docenteNombre: "Docente Autoevaluación II",
      docenteIdentificacion: "987654321A",
      proyectoCurricular: "proyecto2",
      descripcionProceso: "Descripción del proceso de Autoevaluación II.",
    });
  }

  onGuardar() {
    let formValues;

    switch (this.selectedEvaluation) {
      case "heteroevaluacion":
        if (this.heteroForm.valid) {
          formValues = {
            ...this.heteroForm.value,
            inicioFecha: moment(
              this.heteroForm.value.inicioFecha,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD"),
            finFecha: moment(
              this.heteroForm.value.finFecha,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD"),
          };
          console.log(`Guardando Heteroevaluación`, formValues);
        }
        break;

      case "autoevaluacion-i":
        if (this.autoevaluacionIForm.valid) {
          formValues = {
            ...this.autoevaluacionIForm.value,
            inicioFecha: moment(
              this.autoevaluacionIForm.value.inicioFecha,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD"),
            finFecha: moment(
              this.autoevaluacionIForm.value.finFecha,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD"),
          };
          console.log(`Guardando Autoevaluación I`, formValues);
        }
        break;

      case "coevaluacion-i":
        if (this.coevaluacionIForm.valid) {
          formValues = {
            ...this.coevaluacionIForm.value,
            inicioFecha: moment(
              this.coevaluacionIForm.value.inicioFecha,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD"),
            finFecha: moment(
              this.coevaluacionIForm.value.finFecha,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD"),
          };
          console.log(`Guardando Coevaluación I`, formValues);
        }
        break;

      case "autoevaluacion-ii":
        if (this.autoevaluacionIIForm.valid) {
          formValues = {
            ...this.autoevaluacionIIForm.value,
            inicioFecha: moment(
              this.autoevaluacionIIForm.value.inicioFecha,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD"),
            finFecha: moment(
              this.autoevaluacionIIForm.value.finFecha,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD"),
          };
          console.log(`Guardando Autoevaluación II`, formValues);
        }
        break;

      case "coevaluacion-ii":
        if (this.coevaluacionIIForm.valid) {
          formValues = {
            ...this.coevaluacionIIForm.value,
            inicioFecha: moment(
              this.coevaluacionIIForm.value.inicioFecha,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD"),
            finFecha: moment(
              this.coevaluacionIIForm.value.finFecha,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD"),
          };
          console.log(`Guardando Coevaluación II`, formValues);
        }
        break;

      default:
        console.log("Ninguna evaluación seleccionada.");
        return;
    }

    if (formValues) {
      console.log("Datos a guardar:", formValues);
      // Aquí puedes agregar la lógica para enviar los datos al servidor o realizar otras acciones necesarias
    } else {
      console.log(
        "El formulario no es válido. Por favor, completa todos los campos requeridos."
      );
    }
  }

  onGenerarSoporte() {
    console.log(`Generando soporte para ${this.selectedEvaluation}`);
  }

  onContinuar() {
    console.log(`Continuando con ${this.selectedEvaluation}`);
  }

  confirm() {
    console.log(`Confirmando ${this.selectedEvaluation}`);
    this.closeModal();
  }

  closeDynamicForm() {
    this.showDynamicForm = false;
  }

  closeModal() {
    this.showModal = false;
  }

  openModal() {
    this.showModal = true;
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some((role) => this.userRoles.includes(role));
  }
}
