import { Injectable } from "@angular/core";
import { RequestManager } from "../managers/requestManager";

@Injectable()
export class DocenteCrudService {

    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
    }
    get(endpoint: string) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.get(endpoint);
    }

    getItemsFormulario(idFormulario: string) {
        const endpoint = `item?formularioId=${idFormulario}`;
        return this.get(endpoint);
    }    

    post(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.post(endpoint, element);
    }

    put(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.put(endpoint, element);
    }

    delete(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.delete(endpoint, element.Id);
    }

    //put para actualizar la fehca de modificacion
    
}
