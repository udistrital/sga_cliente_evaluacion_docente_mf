

// Opciones comunes para la evaluación
export const EVALUACION_OPTIONS = [
    { valor: "insuficiente", texto: "Insuficiente" },
    { valor: "necesita_mejorar", texto: "Necesita mejorar" },
    { valor: "bueno", texto: "Bueno" },
    { valor: "sobresaliente", texto: "Sobresaliente" },
    { valor: "excelente", texto: "Excelente" },
];

// Heteroevaluación

// Heteroevaluación Ámbito 01
export const HETEROEVALUACION_AMBITO_01 = {
    titulo: "ÁMBITO 01: LA DOCENCIA",
    preguntas: [
        {
        text: "01. Demuestra conocimiento de los contenidos que se van a enseñar en mi espacio curricular",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "02. Demuestra habilidades para conducir procesos de enseñanza-aprendizaje según los contenidos de mi espacio curricular",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "03. Demuestra comprensión de ritmos de aprendizaje diferenciados y adapta el aula de clase a estas necesidades",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "04. Demuestra habilidades para organizar y explicar ideas",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "05. Demuestra habilidades para observar su aula, diagnosticar necesidades y adaptarse al contexto",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
    ],
};

// Heteroevaluación Ámbito 02
export const HETEROEVALUACION_AMBITO_02 = {
    titulo: "ÁMBITO 02: LA ENSEÑANZA",
    preguntas: [
        {
        text: "06. Me da a conocer lo que debo saber, comprender y ser capaz de hacer en mi espacio curricular",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "07. Me enseña lo que debo saber, comprender y ser capaz de hacer en mi espacio curricular",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "08. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "09. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "10. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
    ],
};

// Heteroevaluación Ámbito 03
export const HETEROEVALUACION_AMBITO_03 = {
    titulo: "ÁMBITO 03: LA PRÁCTICA",
    preguntas: [
        {
        text: "11. Desarrolla las unidades de aprendizaje de mi espacio curricular",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "12. Evalúa mis evidencias de aprendizaje y me proporciona devoluciones claras para mi mejoramiento",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "13. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "14. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "15. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "16. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "17. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "18. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "19. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "20. (Pregunta vacía)",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
    ],
};

// Estructura del formulario completo de Heteroevaluación
export const HETEROEVALUACION = {
    tipo_formulario: "heteroevaluacion",
    ambitos: [HETEROEVALUACION_AMBITO_01, HETEROEVALUACION_AMBITO_02, HETEROEVALUACION_AMBITO_03]
};

// Preguntas específicas de la evaluación de seguridad
export const EVALUACION_SEGURIDAD = [
    { id: 1, texto: "Seguridad de la Información" },
    { id: 2, texto: "Gestión de Riesgos" },
];

//Auto evalaucion I
export const AUTOEVALUACION_I_AMBITO_01 = {
    titulo: "AUTOGESTION DEL APRENDIZAJE",
    preguntas: [
        {
        text: "01. Asumo las actividades que me plantea este espacio curricular en cada unidad de aprendizaje",
        tipo: "select",
        options: [
            {
            valor: "Evito hacer las actividades",
            texto: "Evito hacer las actividades",
            },
            {
            valor: "A veces me animan las actividades",
            texto: "A veces me animan las actividades",
            },
            {
            valor: "Con frecuencia hago las actividades del espacio curricular",
            texto: "Con frecuencia hago las actividades del espacio curricular",
            },
            {
            valor:
                "Me encanta las actividades si he tenido éxito en actividades similares",
            texto:
                "Me encanta las actividades si he tenido éxito en actividades similares",
            },
            {
            valor: "Espero con positivismo el próximo reto",
            texto: "Espero con positivismo el próximo reto",
            },
        ],
        },
        {
        text: "02. Siento que puedo lograr los resultados de aprendizaje esperados",
        tipo: "select",
        options: [
            { valor: "Nunca", texto: "Nunca" },
            { valor: "A veces", texto: "A veces" },
            { valor: "Con alguna frecuencia", texto: "Con alguna frecuencia" },
            {
            valor: "La mayor parte del tiempo",
            texto: "La mayor parte del tiempo",
            },
            { valor: "Siempre", texto: "Siempre" },
        ],
        },
        {
        text: "03. Acepto los resultados de la evaluación que realiza mi docente",
        tipo: "select",
        options: [
            {
            valor: "Me siento mal con los resultados negativos",
            texto: "Me siento mal con los resultados negativos",
            },
            {
            valor: "Me siento bien solo si me interesa el espacio curricular",
            texto: "Me siento bien solo si me interesa el espacio curricular",
            },
            {
            valor:
                "Con frecuencia miro las devoluciones de mi docente positivamente",
            texto:
                "Con frecuencia miro las devoluciones de mi docente positivamente",
            },
            {
            valor:
                "La mayor parte del tiempo miro las devoluciones de mi docente positivamente",
            texto:
                "La mayor parte del tiempo miro las devoluciones de mi docente positivamente",
            },
            {
            valor: "Siempre miro las devoluciones de mi docente positivamente",
            texto: "Siempre miro las devoluciones de mi docente positivamente",
            },
        ],
        },
        {
            text: "04. Estrategias de autoaprendizaje (I)",
            tipo: "select",
            options: [
                {
                valor:
                    "No movilizo recursos personales para mi aprendizaje en este espacio curricular",
                texto:
                    "No movilizo recursos personales para mi aprendizaje en este espacio curricular",
                },
                {
                valor:
                    "A veces movilizo recursos personales para mi aprendizaje en este espacio curricular",
                texto:
                    "A veces movilizo recursos personales para mi aprendizaje en este espacio curricular",
                },
                {
                valor:
                    "Con frecuencia movilizo recursos personales para mi aprendizaje en este espacio curricular",
                texto:
                    "Con frecuencia movilizo recursos personales para mi aprendizaje en este espacio curricular",
                },
                {
                valor:
                    "La mayor parte de las veces movilizo recursos personales para mi aprendizaje en este espacio curricular",
                texto:
                    "La mayor parte de las veces movilizo recursos personales para mi aprendizaje en este espacio curricular",
                },
                {
                valor:
                    "Siempre movilizo recursos personales para mi aprendizaje en este espacio curricular",
                texto:
                    "Siempre movilizo recursos personales para mi aprendizaje en este espacio curricular",
                },
            ],
        },
        {
            text: "05. Estrategias de autoaprendizaje (II)",
            tipo: "select",
            options: [
                {
                valor:
                    "No me animo a usar redes para mi aprendizaje en este espacio curricular",
                texto:
                    "No me animo a usar redes para mi aprendizaje en este espacio curricular",
                },
                {
                valor:
                    "A veces me animo a usar redes para mi aprendizaje en este espacio curricular",
                texto:
                    "A veces me animo a usar redes para mi aprendizaje en este espacio curricular",
                },
                {
                valor:
                    "Con frecuencia me animo a usar redes para mi aprendizaje en este espacio curricular",
                texto:
                    "Con frecuencia me animo a usar redes para mi aprendizaje en este espacio curricular",
                },
                {
                valor:
                    "La mayor parte de las veces me animo a usar redes para mi aprendizaje en este espacio curricular",
                texto:
                    "La mayor parte de las veces me animo a usar redes para mi aprendizaje en este espacio curricular",
                },
                {
                valor:
                    "Siempre me animo a usar redes para mi aprendizaje en este espacio curricular",
                texto:
                    "Siempre me animo a usar redes para mi aprendizaje en este espacio curricular",
                },
            ],
            },

    ],
};

export const AUTOEVALUACION_I = {
    tipo_formulario: "autoevaluacion-i", // Cambiado a autoevaluacion-i
    ambitos: [
        AUTOEVALUACION_I_AMBITO_01,
    ],
};

// Autoevaluación II
export const AUTOEVALUACION_II_AMBITO_01 = {
    titulo: "ÁMBITO 01: LA DOCENCIA",
    preguntas: [
        {
        text: "01. No conozco los contenidos que imparto y no tengo habilidades para conducir procesos de enseñanza-aprendizaje",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "02. Conozco parcialmente los contenidos que imparto y se me dificulta conducir procesos de enseñanza-aprendizaje",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "03. Conozco parcialmente los contenidos que imparto, pero tengo habilidades para conducir procesos de enseñanza-aprendizaje",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "04. Conozco lo que enseño y tengo habilidades para conducir procesos de enseñanza-aprendizaje",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "05. Vinculo mi investigación propia a lo que enseño y tengo habilidades para conducir procesos de enseñanza-aprendizaje",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
    ],
    comentarios: {
        label:
        "Dada su respuesta anterior, escriba las acciones que tomará para fortalecer su calidad docente:",
        cantidad: 3,
    },
    evidencias: {
        label:
        "De acuerdo con sus acciones de fortalecimiento, escriba las evidencias que subirá a su portafolio docente digital:",
        cantidad: 3,
        botonCargar: "CARGUE EVIDENCIAS",
    },
};

// Ámbito 02: La Enseñanza
export const AUTOEVALUACION_II_AMBITO_02 = {
    titulo: "ÁMBITO 02: LA ENSEÑANZA",
    preguntas: [
        {
        text: "06. No doy a conocer las competencias y resultados de aprendizaje ni integro en mi enseñanza competencias, didáctica y evaluación",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "07. Doy a conocer a mis alumnos parcialmente los contenidos que imparto y se me dificulta integrar en mi enseñanza competencias, didáctica y evaluación",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "08. Doy a conocer a mis alumnos parcialmente los contenidos que imparto, pero integro en mi enseñanza competencias, didáctica y evaluación",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "09. Doy a conocer a mis alumnos los contenidos que imparto e integro en mi enseñanza competencias, didáctica y evaluación",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "10. Doy a conocer a mis alumnos los contenidos que imparto basados en mi investigación e integro en mi enseñanza competencias, didáctica y evaluación",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
    ],
    comentarios: {
        label:
        "Dada su respuesta anterior, escriba las acciones que tomará para fortalecer su enseñanza:",
        cantidad: 3,
    },
    evidencias: {
        label:
        "De acuerdo con sus acciones de fortalecimiento, escriba las evidencias que subirá a su portafolio docente digital:",
        cantidad: 3,
        botonCargar: "CARGUE EVIDENCIAS",
    },
};

// Ámbito 03: La Práctica
export const AUTOEVALUACION_II_AMBITO_03 = {
    titulo: "ÁMBITO 03: LA PRÁCTICA",
    preguntas: [
        {
        text: "11. No demuestro compromiso con el clima de aprendizaje y no realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "12. Demuestro parcialmente compromiso con el clima de aprendizaje y no realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "13. Demuestro parcialmente compromiso con el clima de aprendizaje, pero realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "14. Demuestro con frecuencia compromiso con el clima de aprendizaje y realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "15. Demuestro siempre mi compromiso con el clima de aprendizaje y realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
        tipo: "radio",
        options: EVALUACION_OPTIONS,
        },
    ],
    comentarios: {
        label:
        "Dada su respuesta anterior, escriba las acciones que tomará para fortalecer su práctica docente:",
        cantidad: 3,
    },
    evidencias: {
        label:
        "De acuerdo con sus acciones de fortalecimiento, escriba las evidencias que subirá a su portafolio docente digital:",
        cantidad: 3,
        botonCargar: "CARGUE EVIDENCIAS",
    },
};

// Estructura completa de Autoevaluación II
export const AUTOEVALUACION_II = {
    tipo_formulario: "autoevaluacion-ii",
    ambitos: [
        AUTOEVALUACION_II_AMBITO_01, // Ámbito 01: La Docencia
        AUTOEVALUACION_II_AMBITO_02, // Ámbito 02: La Enseñanza
        AUTOEVALUACION_II_AMBITO_03, // Ámbito 03: La Práctica
    ],
};

// Formulario de coevaluación II - Ámbito 01
export const COEVALUACION_II_AMBITO_01 = {
    titulo: "ÁMBITO 01: LA DOCENCIA",
    preguntas: [
        {
        text: "01. El docente demuestra conocimiento profundo de los contenidos que enseña y adapta sus enseñanzas a las necesidades del grupo",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "02. El docente estructura y organiza el contenido de manera clara, facilitando el aprendizaje",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "03. El docente utiliza estrategias didácticas innovadoras para involucrar a los estudiantes",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "04. El docente fomenta la participación activa de los estudiantes en el aula",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "05. El docente demuestra una actitud reflexiva sobre su práctica pedagógica",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
    ],
    comentarios: {
        label:
        "Escriba las acciones que recomendaría al docente para mejorar su desempeño en la docencia:",
        cantidad: 3,
    },
    evidencias: {
        label:
        "Escriba las evidencias que utilizará para respaldar sus recomendaciones:",
        cantidad: 3,
        botonCargar: "CARGUE EVIDENCIAS",
    },
};

// Formulario de coevaluación II - Ámbito 02
export const COEVALUACION_II_AMBITO_02 = {
    titulo: "ÁMBITO 02: LA ENSEÑANZA",
    preguntas: [
        {
        text: "06. El docente facilita la comprensión de los temas a través de ejemplos y aplicaciones prácticas",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "07. El docente se asegura de que los estudiantes comprendan los objetivos de aprendizaje",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "08. El docente promueve el pensamiento crítico y la resolución de problemas",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "09. El docente motiva a los estudiantes a aplicar los conocimientos en situaciones reales",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "10. El docente proporciona retroalimentación constructiva a los estudiantes",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
    ],
    comentarios: {
        label:
        "Escriba las acciones que recomendaría al docente para mejorar su enseñanza:",
        cantidad: 3,
    },
    evidencias: {
        label:
        "Escriba las evidencias que utilizará para respaldar sus recomendaciones:",
        cantidad: 3,
        botonCargar: "CARGUE EVIDENCIAS",
    },
};

// Formulario de coevaluación II - Ámbito 03
export const COEVALUACION_II_AMBITO_03 = {
    titulo: "ÁMBITO 03: LA PRÁCTICA",
    preguntas: [
        {
        text: "11. El docente demuestra compromiso con la mejora continua de su práctica educativa",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "12. El docente busca implementar nuevas metodologías para mejorar la enseñanza",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "13. El docente demuestra interés por la formación continua y el aprendizaje profesional",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "14. El docente promueve un ambiente de respeto y colaboración en el aula",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "15. El docente está dispuesto a recibir retroalimentación para mejorar su práctica",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
    ],
    comentarios: {
        label:
        "Escriba las acciones que recomendaría al docente para fortalecer su práctica educativa:",
        cantidad: 3,
    },
    evidencias: {
        label:
        "Escriba las evidencias que utilizará para respaldar sus recomendaciones:",
        cantidad: 3,
        botonCargar: "CARGUE EVIDENCIAS",
    },
};

// Estructura de Coevaluación II
export const COEVALUACION_II = {
    tipo_formulario: "coevaluacion-ii",
    ambitos: [
        COEVALUACION_II_AMBITO_01,
        COEVALUACION_II_AMBITO_02,
        COEVALUACION_II_AMBITO_03,
    ],
};

// Formulario de Coevaluación I
export const COEVALUACION_I = {
    tipo_formulario: "coevaluacion-i",
    ambitos: [
        {
        titulo: "Acta de Coevalaución", 
        preguntas: [
            {
                text: "Espacio Curricular",
                tipo: "input",
                options: [],
                },
            {
            text: "Código del Espacio Curricular",
            tipo: "input",
            options: [],
            },
            {
            text: "Grupo",
            tipo: "input",
            options: [],
            },
        ],
        },
        {
        titulo: "Observaciones del Docente",
        preguntas: [
            {
            text: "Frente a la heteroevaluación realizada por el estudiantado a la persona docente, ésta tiene las siguientes observaciones:",
            tipo: "textarea",
            options: [],
            },
        ],
        },
        {
        titulo: "Observaciones de los Estudiantes",
        preguntas: [
            {
            text: "Frente a la heteroevaluación realizada por el estudiantado sobre sí mismos, se tienen las siguientes observaciones conjuntas:",
            tipo: "textarea",
            options: [],
            },
        ],
        },
        {
        titulo: "Plan de Acción",
        preguntas: [
            {
            text: "Tanto estudiantes como persona docente proponen el siguiente plan de acción:",
            tipo: "textarea",
            options: [],
            },
        ],
        },
        {
        titulo: "Personas Intervinientes",
        preguntas: [
            {
            text: "Listado de personas intervinientes:",
            tipo: "textarea",
            options: [],
            },
        ],
        },
    ],
    botonCargarEvidencias: "CARGUE EVIDENCIAS",
};

//Datos quemados para pruebas
export const FORM_DATA_PRUEBAS = {
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
            },
        },
    ],
};

