import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable()
export class CumplidosDveService {

    constructor(
        private readonly requestManager: RequestManager
    ) {
        this.requestManager.setPath('CUMPLIDOS_DVE_MID');
    }
    get(endpoint: string) {
        this.requestManager.setPath('CUMPLIDOS_DVE_MID');
        return this.requestManager.get(endpoint);
    }

    post(endpoint: string, element: any) {
        this.requestManager.setPath('CUMPLIDOS_DVE_MID');
        return this.requestManager.post(endpoint, element);
    }

    put(endpoint: string, element: any) {
        this.requestManager.setPath('CUMPLIDOS_DVE_MID');
        return this.requestManager.put(endpoint, element);
    }

    delete(endpoint: string, element: any) {
        this.requestManager.setPath('CUMPLIDOS_DVE_MID');
        return this.requestManager.delete(endpoint, element.Id);
    }
}
