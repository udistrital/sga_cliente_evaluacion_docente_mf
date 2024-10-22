import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DateService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDateHeader(): Observable<string> {
    return new Observable(observer => {
      this.http.get(this.url, { observe: 'response' }).subscribe(
        (response: HttpResponse<any>) => {
          const dateHeader = response.headers.get('Date');
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
