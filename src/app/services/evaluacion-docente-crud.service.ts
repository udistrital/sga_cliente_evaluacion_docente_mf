import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable()
export class EvaluacionDocenteService {
    tipoCampos = [
        { id: 4674, label: 'Texto' },
        { id: 4668, label: 'Selección Múltiple' },
        { id: 6686, label: 'Cargar Archivos' },
        { id: 4672, label: 'Descargar Archivos' },
    ];
    
    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
    }
    
    get(endpoint: string) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.get(endpoint);
    }
    
    getCamposActivos() {
        return this.get('campo?query=activo:true&limit=0');
    }

    post(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.post(endpoint, element);
    }

    put(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.put(endpoint, element);
    }

    delete(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.delete(endpoint, element.Id);
    }
}
