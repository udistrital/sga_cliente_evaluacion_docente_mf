import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root',
})

export class EspacioAcademicoService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('ESPACIO_ACADEMICO_SERVICE');
  }

  get(endpoint: any) {
    this.requestManager.setPath('ESPACIO_ACADEMICO_SERVICE');
    return this.requestManager.get(endpoint);
  }

  post(endpoint: any, element: any) {
    this.requestManager.setPath('ESPACIO_ACADEMICO_SERVICE');
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint: any, element: any) {
    this.requestManager.setPath('ESPACIO_ACADEMICO_SERVICE');
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint: any, element: any) {
    this.requestManager.setPath('ESPACIO_ACADEMICO_SERVICE');
    return this.requestManager.delete(endpoint, element.Id);
  }
}