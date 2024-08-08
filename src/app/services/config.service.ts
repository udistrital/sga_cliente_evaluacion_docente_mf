import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = 'https://httpbin.org/get'; // URL base de la API

  getApiUrl(): string {
    return this.apiUrl;
  }
}
