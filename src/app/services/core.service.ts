import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable()
export class CoreService {

    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('CRUD_CORE');
    }
    get(endpoint: string) {
        this.requestManager.setPath('CRUD_CORE');
        return this.requestManager.get(endpoint);
    }

    post(endpoint: string, element: any) {
        this.requestManager.setPath('CRUD_CORE');
        return this.requestManager.post(endpoint, element);
    }

    put(endpoint: string, element: any) {
        this.requestManager.setPath('CRUD_CORE');
        return this.requestManager.put(endpoint, element);
    }

    delete(endpoint: string, element: any) {
        this.requestManager.setPath('CRUD_CORE');
        return this.requestManager.delete(endpoint, element.Id);
    }
}
