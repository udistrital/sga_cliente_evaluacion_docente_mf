

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DateStorageService } from './date-storage.service';
import { ConfigService } from './config.service';

@Injectable()
export class DateInterceptor implements HttpInterceptor {

  constructor(
    private dateStorageService: DateStorageService,
    private configService: ConfigService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiUrl = this.configService.getApiUrl();

    if (req.url.startsWith(apiUrl)) {
      return next.handle(req).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            const date = event.headers.get('date');
            console.log('Date header:', date); // Verifica la cabecera en la consola
            if (date) {
              this.dateStorageService.setDate(date);
            }
          }
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
