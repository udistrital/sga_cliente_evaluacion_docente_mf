import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable()
export class ProyectoAcademicoService {

    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('PROYECTO_ACADEMICO_SERVICE');
    }
    get(endpoint: string) {
        this.requestManager.setPath('PROYECTO_ACADEMICO_SERVICE');
        return this.requestManager.get(endpoint);
    }

    post(endpoint: string, element: any) {
        this.requestManager.setPath('PROYECTO_ACADEMICO_SERVICE');
        return this.requestManager.post(endpoint, element);
    }

    put(endpoint: string, element: any) {
        this.requestManager.setPath('PROYECTO_ACADEMICO_SERVICE');
        return this.requestManager.put(endpoint, element);
    }

    delete(endpoint: string, element: any) {
        this.requestManager.setPath('PROYECTO_ACADEMICO_SERVICE');
        return this.requestManager.delete(endpoint, element.Id);
    }
}
