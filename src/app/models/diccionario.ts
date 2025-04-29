export const VIEWS = Object.freeze({
    LIST: Symbol(),
    FORM: Symbol(),
})

export const MODALS = Object.freeze({
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    SUCCESS: 'success',
    QUESTION: 'question',
})

export const ACTIONS = Object.freeze({
    VIEW: Symbol(),
    EDIT: Symbol(),
    DELETE: Symbol(),
    CREATE: Symbol(),
    SEND: Symbol(),
    EDIT_PART: Symbol(),
})

export const ROLES = Object.freeze({
    ADMIN_SGA: 'ADMIN_SGA',
    ADMIN_EVALUACION_DOCENTE: 'ADMIN_EVALUACION_DOCENTE',
    CONSEJO_CURRICULAR: 'CONSEJO_CURRICULAR',
    DOCENTE: 'DOCENTE',
    ESTUDIANTE: 'ESTUDIANTE',
    DECANO: 'DECANO',
    SEC_DECANATURA: 'SEC_DECANATURA',
    ADMIN_DOCENCIA: 'ADMIN_DOCENCIA',    
    ASIS_PROYECTO: 'ASIS_PROYECTO',
    RECTORIA: 'RECTORIA',
    COORDINADOR: 'COORDINADOR'
})

export const ROLES_ASIGNACION_FECHAS = Object.freeze({
    ADMIN_SGA: 'ADMIN_SGA',
    ADMIN_DOCENCIA: 'ADMIN_DOCENCIA',
})

export const ROLES_HETEROEVALUACION = Object.freeze({
    ADMIN_SGA: 'ADMIN_SGA',
    CONSEJO_CURRICULAR: 'ESTUDIANTE'
})

export const ROLES_AUTOEVALUACION_UNO = Object.freeze({
    ADMIN_SGA: 'ADMIN_SGA',
    CONSEJO_CURRICULAR: 'ESTUDIANTE'
})

export const ROLES_AUTOEVALUACION_DOS = Object.freeze({
    ADMIN_SGA: 'ADMIN_SGA',
    CONSEJO_CURRICULAR: 'DOCENTE'
})

export const ROLES_COEVALUACION_UNO = Object.freeze({
    ADMIN_SGA: 'ADMIN_SGA',
    CONSEJO_CURRICULAR: 'DOCENTE'
})

export const ROLES_COEVALUACION_DOS = Object.freeze({
    ADMIN_SGA: 'ADMIN_SGA',
    COORDINADOR: 'COORDINADOR',
    DECANO: 'DECANO'
})

export const PROCESOS_CATEGORIAS = Object.freeze({
    ESTUDIANTE: ['Heteroevaluación', 'Autoevaluación I'],
    DOCENTE: ['Autoevaluación II 1', 'Autoevaluación II 2', 'Autoevaluación II 3', 'Coevaluación I'],
    CONCEJO: ['Coevaluación II']
} as const);

export type CategoriaProceso = keyof typeof PROCESOS_CATEGORIAS;