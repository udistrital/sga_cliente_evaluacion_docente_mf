import { Injectable } from "@angular/core";
import { RequestManager } from "../managers/requestManager";

@Injectable()
export class DocenteMidService {

    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('EVALUACION_DOCENTE_MID');
    }
    get(endpoint: string) {
        this.requestManager.setPath('EVALUACION_DOCENTE_MID');
        return this.requestManager.get(endpoint);
    }

    post(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_MID');
        return this.requestManager.post(endpoint, element);
    }

    put(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_MID');
        return this.requestManager.put(endpoint, element);
    }

    delete(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_MID');
        return this.requestManager.delete(endpoint, element.Id);
    }
}