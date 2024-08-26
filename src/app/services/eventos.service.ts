import { Injectable } from '@angular/core'; // Importa el RequestManager
import { Observable } from 'rxjs';
import { RequestManager } from '../managers/requestManager';

@Injectable({
    providedIn: 'root'
})
export class EventosService {
    constructor(private requestManager: RequestManager) {}

    get(endpoint: string): Observable<any> {
        return this.requestManager.get(endpoint);
    }

    post(endpoint: string, element: any): Observable<any> {
        return this.requestManager.post(endpoint, element);
    }

    put(endpoint: string, element: any): Observable<any> {
        return this.requestManager.put(endpoint, element);
    }
    }

    @Injectable({
    providedIn: 'root'
    })
    export class ParametrosService {
    constructor(private requestManager: RequestManager) {}

    get(endpoint: string): Observable<any> {
        return this.requestManager.get(endpoint);
    }
}
