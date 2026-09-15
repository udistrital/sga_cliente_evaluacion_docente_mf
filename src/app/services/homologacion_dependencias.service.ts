import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable()
export class HomologacionDependenciasService {

    constructor(
        private readonly requestManager: RequestManager
    ) {
        this.requestManager.setPath('HOMOLOGACION_DEPENDENCIAS');
    }
    get(endpoint: string) {
        this.requestManager.setPath('HOMOLOGACION_DEPENDENCIAS');
        return this.requestManager.get(endpoint);
    }

    post(endpoint: string, element: any) {
        this.requestManager.setPath('HOMOLOGACION_DEPENDENCIAS');
        return this.requestManager.post(endpoint, element);
    }

    put(endpoint: string, element: any) {
        this.requestManager.setPath('HOMOLOGACION_DEPENDENCIAS');
        return this.requestManager.put(endpoint, element);
    }

    delete(endpoint: string, element: any) {
        this.requestManager.setPath('HOMOLOGACION_DEPENDENCIAS');
        return this.requestManager.delete(endpoint, element.Id);
    }
}
