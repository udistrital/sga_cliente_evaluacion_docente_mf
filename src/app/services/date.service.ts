import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private url = 'https://api.github.com/';

  constructor(private http: HttpClient) { }

  getDateHeader(): Observable<string> {
    return new Observable(observer => {
      this.http.get(this.url, { observe: 'response' }).subscribe(
        (response: HttpResponse<any>) => {
          // Verifica los encabezados de la respuesta
          console.log('Response Headers:', response.headers.keys());
          const dateHeader = response.headers.get('Date');
          console.log('Date Header:', dateHeader);
          if (dateHeader) {
            observer.next(dateHeader);
          } else {
            observer.error('Date header not found');
          }
        },
        error => observer.error(error)
      );
    });
  }
}
