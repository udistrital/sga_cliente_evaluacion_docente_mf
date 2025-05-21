import { Injectable } from "@angular/core";
import { RequestManager } from "../managers/requestManager";
import { EnvioEmailPayload } from "../models/envio-email.model";

@Injectable()
export class EnvioEmailService {

    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('NOTIFICACION_MID');
    }

    postEnvioEmailTemplate(endpoint: string, payload: EnvioEmailPayload) {
        this.requestManager.setPath('NOTIFICACION_MID');
        return this.requestManager.post(endpoint, payload);
    }

}