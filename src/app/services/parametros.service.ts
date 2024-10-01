import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ParametrosService {
    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('PARAMETROS_CRUD');
    }
    
    // Método para obtener los parámetros por su endpoint
    get(endpoint: string): Observable<any> {
        this.requestManager.setPath('PARAMETROS_CRUD');
        return this.requestManager.get(endpoint);
    }
    
    post(endpoint: string, element: any): Observable<any> {
        this.requestManager.setPath('PARAMETROS_CRUD');
        return this.requestManager.post(endpoint, element);
    }
    
    put(endpoint: string, id: any, element: any): Observable<any> {
        this.requestManager.setPath('PARAMETROS_CRUD');
        return this.requestManager.put(`${endpoint}/${id}`, element);
    }

    delete(endpoint: string, id: any): Observable<any> {
        this.requestManager.setPath('PARAMETROS_CRUD');
        return this.requestManager.delete(endpoint, id);
    }
}
