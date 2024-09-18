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
    titulo: "SECCIÓN 01 - ANÁLISIS DE LA HETEROEVALUACIÓN",
    preguntas: [
        {
            text: "De acuerdo con los resultados de la heteroevaluación conceptúen un promedio y decidan una opción de la escala provista.",
            tipo: "texto",
        },
        {
            text: "01. ÁMBITO 01: DOCENCIA",
            tipo: "texto",
            options: EVALUACION_OPTIONS,  
        },
        {
            text: "02. ÁMBITO 02: ENSEÑANZA",
            tipo: "texto",
            options: EVALUACION_OPTIONS,  
        },
        {
            text: "03. ÁMBITO 03: PRÁCTICA",
            tipo: "texto",
            options: EVALUACION_OPTIONS,
        },
        {
            text: "PROMEDIO ASIGNADO POR EL CONCEJO CURRICULAR",
            tipo: "texto",
            options: EVALUACION_OPTIONS, 
        },
    ],
};

export const COEVALUACION_II_AMBITO_02 = {
    titulo: "SECCIÓN 02 - ANÁLISIS DE LA COEVALUACIÓN I",
    preguntas: [
        {
            text: "Lea el acta de coevaluación I para tener elementos cultivados de coevaluación del cuerpo docente.",
            tipo: "texto", 
        },
    ],
};

export const COEVALUACION_II_AMBITO_03 = {
    titulo: "SECCIÓN 03 - ANÁLISIS DE LA AUTOEVALUACIÓN",
    preguntas: [
        {
            text: "De acuerdo con los resultados de la autoevaluación, las acciones y las evidencias, conceptúen un promedio y decidan una opción de la escala provista.",
            tipo: "texto",

        },
        {
            text: "01. ÁMBITO 01: DOCENCIA",
            tipo: "texto",
            options: EVALUACION_OPTIONS,

        },
        {
            text: "Descarga archivo aquí",
            tipo: "download", 
        },
        {
            text: "02. ÁMBITO 02: ENSEÑANZA",
            tipo: "texto",
            options: EVALUACION_OPTIONS,
        },
        {
            text: "Descarga archivo aquí",
            tipo: "download", 
        },
        {
            text: "03. ÁMBITO 03: PRÁCTICA",
            tipo: "texto",
            options: EVALUACION_OPTIONS,
        },
        {
            text: "Descarga archivo aquí",
            tipo: "download", 
        },
        {
            text: "PROMEDIO ASIGNADO POR EL CONCEJO CURRICULAR",
            tipo: "texto",
            options: EVALUACION_OPTIONS,
        },
    ],
};

export const COEVALUACION_II_AMBITO_04 = {
    titulo: "SECCIÓN 04 - PROMEDIO",
    preguntas: [
        {
            text: "De acuerdo con los resultados de las secciones anteriores, establezcan un promedio final y escriban observaciones para el cuerpo docente.",
            tipo: "texto",
            options: EVALUACION_OPTIONS,
        },
        {
            text: "PROMEDIO ASIGNADO POR EL CONCEJO CURRICULAR",
            tipo: "texto",
            options: EVALUACION_OPTIONS,
        },
        {
            text: "01. comentario:",
            tipo: "input", 
            options: [],
        },
    ],
};

// Estructura completa del formulario Coevaluación II
export const COEVALUACION_II = {
    tipo_formulario: "coevaluacion-ii",
    ambitos: [
        COEVALUACION_II_AMBITO_01,
        COEVALUACION_II_AMBITO_02,
        COEVALUACION_II_AMBITO_03,
        COEVALUACION_II_AMBITO_04,
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
            {
                text: "El cuerpo docente debe cargar el acta de co-evalaucion curricularen enste boton: ",
                tipo: "texto",
            },

        ],
        },
    ],
    botonCargarEvidencias: "CARGUE EVIDENCIAS",
};

// export const response = {
//     Success: true,
//     Status: 200,
//     Message: "Consulta exitosa",
//     Data: {
//       Data: {
//         docente: "11",
//         espacioAcademico: "1",
//         seccion: {
//           cuantitativa: {
//             items: [
//               {
//                 campos: [
//                   {
//                     escala: [
//                       {
//                         nombre: "Insuficiente",
//                         tipo_campo: 2,
//                         valor: 200
//                       },
//                       {
//                         nombre: "Aceptable",
//                         tipo_campo: 2,
//                         valor: 200
//                       },
//                       {
//                         nombre: "Excelente",
//                         tipo_campo: 2,
//                         valor: 200
//                       }
//                     ],
//                     nombre: "Escala definida",
//                     porcentaje: 50,
//                     tipo_campo: 2,
//                     valor: 0
//                   }
//                 ],
//                 id: 1,
//                 nombre: "Item 1",
//                 orden: 1
//               },
//               {
//                 campos: null,
//                 id: 3,
//                 nombre: "Item 2",
//                 orden: 2
//               }
//             ],
//             nombre: "Sección 1",
//             orden: 1
//           }
//         },
//         tipoEvaluacion: "1"
//       },
//       Message: "Consulta exitosa",
//       Status: 200,
//       Success: true
//     }
//   };
  


export const response = {
    Success: true,
    Status: 200,
    Message: "Consulta exitosa",
    Data: {
      Data: {
        docente: "11",
        espacioAcademico: "1",
        seccion: {
          cualitativa: [
            {
              items: [
                {
                  campos: [
                    {
                      escala: [
                        { nombre: "Insuficiente", tipo_campo: 2, valor: 200 },
                        { nombre: "Aceptable", tipo_campo: 2, valor: 200 },
                        { nombre: "Excelente", tipo_campo: 2, valor: 200 }
                      ],
                      nombre: "Escala definida",
                      porcentaje: 50,
                      tipo_campo: 2,
                      valor: 0
                    }
                  ],
                  id: 2,
                  nombre: "Item 2",
                  orden: 2
                }
              ],
              nombre: "Sección 2",
              orden: 2
            },
            {
              items: [
                {
                  campos: [
                    {
                      escala: [
                        { nombre: "Insuficiente", tipo_campo: 2, valor: 200 },
                        { nombre: "Aceptable", tipo_campo: 2, valor: 200 },
                        { nombre: "Excelente", tipo_campo: 2, valor: 200 }
                      ],
                      nombre: "Escala definida",
                      porcentaje: 10,
                      tipo_campo: 2,
                      valor: 0
                    }
                  ],
                  id: 7,
                  nombre: "Pregunta 3",
                  orden: 3
                },
                { campos: null, id: 8, nombre: "Pregunta 3", orden: 3 },
                { campos: null, id: 8, nombre: "Pregunta 3", orden: 3 }
              ],
              nombre: "Sección A",
              orden: 2
            }
          ],
          cuantitativa: [
            {
              items: [
                {
                  campos: [
                    {
                      escala: null,
                      nombre: "Comentario",
                      porcentaje: 10,
                      tipo_campo: 4,
                      valor: 0
                    }
                  ],
                  id: 5,
                  nombre: "Pregunta 1",
                  orden: 1
                },
                {
                  campos: [
                    {
                      escala: [
                        { nombre: "Insuficiente", tipo_campo: 2, valor: 200 },
                        { nombre: "Aceptable", tipo_campo: 2, valor: 200 },
                        { nombre: "Excelente", tipo_campo: 2, valor: 200 }
                      ],
                      nombre: "Escala definida",
                      porcentaje: 10,
                      tipo_campo: 2,
                      valor: 0
                    }
                  ],
                  id: 6,
                  nombre: "Pregunta 2",
                  orden: 2
                },
                {
                  campos: [
                    {
                      escala: [
                        { nombre: "Insuficiente", tipo_campo: 2, valor: 200 },
                        { nombre: "Aceptable", tipo_campo: 2, valor: 200 },
                        { nombre: "Excelente", tipo_campo: 2, valor: 200 }
                      ],
                      nombre: "Escala definida",
                      porcentaje: 10,
                      tipo_campo: 2,
                      valor: 0
                    }
                  ],
                  id: 7,
                  nombre: "Pregunta 3",
                  orden: 3
                }
              ],
              nombre: "Sección 1",
              orden: 1
            }
          ]
        },
        tipoEvaluacion: "2"
      },
      Message: "Consulta exitosa",
      Status: 200,
      Success: true
    }
  };
  

