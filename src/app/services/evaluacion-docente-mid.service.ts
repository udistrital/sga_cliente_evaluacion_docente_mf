import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root',
})

export class EvaluacionDocenteMidService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('SGA_EVALUACION_DOCENTE');
  }

  get(endpoint: any) {
    this.requestManager.setPath('SGA_EVALUACION_DOCENTE');
    return this.requestManager.get(endpoint);
  }

  post(endpoint: any, element: any) {
    this.requestManager.setPath('SGA_EVALUACION_DOCENTE');
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint: any, element: any) {
    this.requestManager.setPath('SGA_EVALUACION_DOCENTE');
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint: any, element: any) {
    this.requestManager.setPath('SGA_EVALUACION_DOCENTE');
    return this.requestManager.delete(endpoint, element.Id);
  }
}