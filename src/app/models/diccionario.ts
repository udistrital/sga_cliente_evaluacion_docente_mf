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