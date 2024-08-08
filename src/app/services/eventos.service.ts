import { Injectable } from '@angular/core';
import { AnyService } from './any.service'; // Importación correcta basada en la estructura
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Importa el entorno

@Injectable({
    providedIn: 'root'
})
export class EventosService {

    private path = environment.EVENTOS_CRUD;

    constructor(private anyService: AnyService) {}

    get(endpoint: string): Observable<any> {
        return this.anyService.get(this.path, endpoint);
    }

    getp(endpoint: string): Observable<any> {
        return this.anyService.getp(this.path, endpoint);
    }

    post(endpoint: string, element: any): Observable<any> {
        return this.anyService.post(this.path, endpoint, element);
    }

    put(endpoint: string, element: any): Observable<any> {
        return this.anyService.put(this.path, endpoint, element);
    }

    put2(endpoint: string, element: { Id: string; }): Observable<any> {
        return this.anyService.put2(this.path, endpoint, element);
    }

    delete(endpoint: string, element: { Id: string; }): Observable<any> {
        return this.anyService.delete(this.path, endpoint, element);
    }

    delete2(endpoint: string): Observable<any> {
        return this.anyService.delete2(this.path, endpoint);
    }
}
