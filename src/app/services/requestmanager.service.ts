import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestManager {
  private path: string = ''; // Inicialización predeterminada

  constructor(private http: HttpClient) {}

  setPath(path: string) {
    this.path = `${environment.apiUrl}${path}`;
  }

  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.path}/${endpoint}`);
  }

  post(endpoint: string, element: any): Observable<any> {
    return this.http.post(`${this.path}/${endpoint}`, element);
  }

  put(endpoint: string, id: any, element: any): Observable<any> {
    return this.http.put(`${this.path}/${endpoint}/${id}`, element);
  }

  delete(endpoint: string, id: any): Observable<any> {
    return this.http.delete(`${this.path}/${endpoint}/${id}`);
  }
}
