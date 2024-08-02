import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable()
export class FechasEvaluacionesService {

    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('EVENTOS_CRUD'); 
    }

    get(endpoint: string) {
        this.requestManager.setPath('EVENTOS_CRUD');
        return this.requestManager.get(endpoint);
    }

    post(endpoint: string, element: any) {
        this.requestManager.setPath('EVENTOS_CRUD');
        return this.requestManager.post(endpoint, element);
    }

    put(endpoint: string, id: any, element: any) {
        this.requestManager.setPath('EVENTOS_CRUD');
        return this.requestManager.put(`${endpoint}/${id}`, element);
    }

    delete(endpoint: string, id: any) {
        this.requestManager.setPath('EVENTOS_CRUD');
        return this.requestManager.delete(endpoint, id);
    }
}