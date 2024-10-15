import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AnyService {

  constructor(private http: HttpClient) {}

  get(path: string, endpoint: string) {
    return this.http.get(`${path}${endpoint}`, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  getp(path: string, endpoint: string) {
    return this.http.get(`${path}${endpoint}`, { ...httpOptions, reportProgress: true, observe: 'events' }).pipe(
      catchError(this.handleError),
    );
  }

  post(path: string, endpoint: string, element: any) {
    return this.http.post(`${path}${endpoint}`, element, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  put(path: string, endpoint: string, element: any) {
    return this.http.put(`${path}${endpoint}`, element, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  put2(path: string, endpoint: string, element: { Id: string; }) {
    return this.http.put(`${path}${endpoint}/${element.Id}`, element, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  delete(path: string, endpoint: string, element: { Id: string; }) {
    return this.http.delete(`${path}${endpoint}/${element.Id}`, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  delete2(path: string, endpoint: string) {
    return this.http.delete(`${path}${endpoint}`, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError({
      status: error.status,
      message: 'Something bad happened; please try again later.',
    });
  }
}
