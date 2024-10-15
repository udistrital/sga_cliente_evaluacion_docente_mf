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
        text: "08. Integra en la enseñanza las competencias, la didactica y la evalaución",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "09. Logra que sepa actuar de manera competente en contextos particulares señalados por el contenido de mi espacio curricular",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "10. Me enseña a relacionar las competencias y los resultados de aprendizaje de mi espacio curricular",
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
        text: "13. Demuestra compromiso general con el ambiente de aprendizaje de mi salón",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "14. Demuestra respeto por diversidades y diferencias sexo-genéricas, cognitivas, lingüísticas, raciales y culturales dentro y fuera de mi salón",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "15. Me motiva para el alcance de competencias y resultados de aprendizaje",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "16. Promueve el desarrollo de autoconceptos positivos para el estudiantado",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "17. Realiza actividades apropiadas para la consecución de los resultados de aprendizaje y el desarrollo de competencias",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "18. Recibe y maneja positivamente preguntas, ideas y opiniones que mantienen al estudiantado pendiente e involucrado en clase",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "19. Se adapta a niveles y ritmos de aprendizaje diferenciados tanto míos como de mis compañeros de clase",
        tipo: "select",
        options: EVALUACION_OPTIONS,
        },
        {
        text: "20. Es evidente que prepara sus clases y actividades para estimular mi logro de resultados de aprendizaje y competencias",
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
        {
            text: "Dada su respuesta anterior, escribe las acciones que tomará para fortalecer su éxito en este espacio curricular:",
            tipo: "textarea",
            options: [],
        }

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
        text: "Rúbrica holística ambito La Docencia",
        tipo: "radio",
        options: [
            {
            valor: "1",
            texto: "Insuficiente: No conozco los contenidos que imparto y no tengo habilidades para conducir procesos de enseñanza-aprendizaje",
            },
            {
            valor: "2",
            texto: "Necesita mejorar: Conozco parcialmente los contenidos que imparto y se me dificulta conducir procesos de enseñanza-aprendizaje",
            },
            {
            valor: "3",
            texto: "Bueno: Conozco parcialmente los contenidos que imparto, pero tengo habilidades para conducir procesos de enseñanza-aprendizaje",
            },
            {
            valor: "4",
            texto: "Sobresaliente: Conozco lo que enseño y tengo habilidades para conducir procesos de enseñanza-aprendizaje",
            },
            {
            valor: "5",
            texto: "Excelente: Vinculo mi investigación propia a lo que enseño y tengo habilidades para conducir procesos de enseñanza-aprendizaje",
            }
        ],
        },
        {
        text: "Dada su respuesta anterior, escriba las acciones que tomará para fortalecer su calidad docente:",
        tipo: "textarea",
        options: [],
        },
        {
        text: "De acuerdo con sus acciones de fortalecimiento, escriba las evidencias que subirá a su portafolio docente digital:",
        tipo: "file",
        options: [],
        },
    ]
};

// Ámbito 02: La Enseñanza
export const AUTOEVALUACION_II_AMBITO_02 = {
    titulo: "ÁMBITO 02: LA ENSEÑANZA",
    preguntas: [
        {
        text: "Rúbrica holística ambito La Enseñanza",
        tipo: "radio",
        options: [
            {
            valor: "1",
            texto: "Insuficiente: No doy a conocer las competencias y resultados de aprendizaje ni integro en mi enseñanza competencias, didáctica y evaluación",
            },
            {
            valor: "2",
            texto: "Necesita mejorar: Doy a conocer a mis alumnos parcialmente los contenidos que imparto y se me dificulta integrar en mi enseñanza competencias, didáctica y evaluación",
            },
            {
            valor: "3",
            texto: "Bueno: Doy a conocer a mis alumnos parcialmente los contenidos que imparto, pero integro en mi enseñanza competencias, didáctica y evaluación",
            },
            {
            valor: "4",
            texto: "Sobresaliente: Doy a conocer a mis alumnos los contenidos que imparto e integro en mi enseñanza competencias, didáctica y evaluación",
            },
            {
            valor: "5",
            texto: "Excelente: Doy a conocer a mis alumnos los contenidos que imparto basados en mi investigación e integro en mi enseñanza competencias, didáctica y evaluación",
            }
        ],
        },
        {
        text: "Dada su respuesta anterior, escriba las acciones que tomará para fortalecer su enseñanza:",
        tipo: "textarea",
        options: [],
        },
        {
        text: "De acuerdo con sus acciones de fortalecimiento, escriba las evidencias que subirá a su portafolio docente digital:",
        tipo: "file",
        options: [],
        },
    ]
};

// Ámbito 03: La Práctica
export const AUTOEVALUACION_II_AMBITO_03 = {
    titulo: "ÁMBITO 03: LA PRÁCTICA",
    preguntas: [
        {
        text: "Rúbrica holística ambito La Práctica",
        tipo: "radio",
        options: [
            {
                valor: "1",
                texto: "Insuficiente: No demuestro compromiso con el clima de aprendizaje y no realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
                },
                {
                valor: "2",
                texto: "Necesita mejorar: Demuestro parcialmente compromiso con el clima de aprendizaje y no realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
                },
                {
                valor: "3",
                texto: "Bueno: Demuestro parcialmente compromiso con el clima de aprendizaje, pero realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
                },
                {
                valor: "4",
                texto: "Sobresaliente: Demuestro con frecuencia compromiso con el clima de aprendizaje y realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
                },
                {
                valor: "5",
                texto: "Excelente: Demuestro siempre mi compromiso con el clima de aprendizaje y realizo actividades apropiadas para la consecución de resultados de aprendizaje y desarrollo de competencias",
                }
        ],
        },
        {
        text: "Dada su respuesta anterior, escriba las acciones que tomará para fortalecer su práctica docente:",
        tipo: "textarea",
        options: [],
        },
        {
        text: "De acuerdo con sus acciones de fortalecimiento, escriba las evidencias que subirá a su portafolio docente digital:",
        tipo: "file",
        options: [],
        },
    ]
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
            text: "01. ÁMBITO 01: DOCENCIA",
            tipo: "radio",
            options: EVALUACION_OPTIONS,  
        },
        {
            text: "02. ÁMBITO 02: ENSEÑANZA",
            tipo: "radio",
            options: EVALUACION_OPTIONS,  
        },
        {
            text: "03. ÁMBITO 03: PRÁCTICA",
            tipo: "radio",
            options: EVALUACION_OPTIONS,
        },
        {
            text: "PROMEDIO ASIGNADO POR EL CONCEJO CURRICULAR",
            tipo: "radio",
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
            text: "01. ÁMBITO 01: DOCENCIA",
            tipo: "radio",
            options: EVALUACION_OPTIONS,
        },
        {
            text: "Descarga archivo aquí",
            tipo: "download", 
        },
        {
            text: "02. ÁMBITO 02: ENSEÑANZA",
            tipo: "radio",
            options: EVALUACION_OPTIONS,
        },
        {
            text: "Descarga archivo aquí",
            tipo: "download", 
        },
        {
            text: "03. ÁMBITO 03: PRÁCTICA",
            tipo: "radio",
            options: EVALUACION_OPTIONS,
        },
        {
            text: "Descarga archivo aquí",
            tipo: "download", 
        },
        {
            text: "PROMEDIO ASIGNADO POR EL CONCEJO CURRICULAR",
            tipo: "radio",
            options: EVALUACION_OPTIONS,
        },
    ],
};

export const COEVALUACION_II_AMBITO_04 = {
    titulo: "SECCIÓN 04 - PROMEDIO",
    preguntas: [
        {
            text: "PROMEDIO ASIGNADO POR EL CONCEJO CURRICULAR",
            tipo: "radio",
            options: EVALUACION_OPTIONS,
        },
        {
            text: "Plan de acción para fortalecimiento de la docencia, la enseñanza y la práctica",
            tipo: "textarea", 
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
                    text: "Frente a la heteroevaluación realizada por el estudiantado a la persona docente, ésta tiene las siguientes observaciones:",
                    tipo: "textarea",
                    options: [],
                },
                {
                    text: "Frente a la heteroevaluación realizada por el estudiantado sobre sí mismos, se tienen las siguientes observaciones conjuntas:",
                    tipo: "textarea",
                    options: [],
                },
                {
                    text: "Frente a la heteroevaluación realizada por el estudiantado sobre sí mismos, se tienen las siguientes observaciones conjuntas:",
                    tipo: "textarea",
                    options: [],
                },
                {
                    text: "Tanto estudiantes como persona docente proponen el siguiente plan de acción:",
                    tipo: "textarea",
                    options: [],
                },
                {
                    text: "Listado de personas intervinientes:",
                    tipo: "textarea",
                    options: [],
                },
                {
                    text: "El cuerpo docente debe cargar el acta de co-evalaucion curricularen enste boton: ",
                    tipo: "file",
                    options: [],
                },
            ],
        },
    ]
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
  


export const responses = {
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
  
