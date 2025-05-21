export interface EmailAttachment {
    ContentType: string;
    FileName: string;
    Base64File: string;
}

export interface EmailDestination {
    Destination: {
        ToAddresses: string[];
    };
    ReplacementTemplateData: {
        nombre_usuario: string;
        documento_usuario: string;
        nombre_evaluacion: string;
        numero_periodo: string;
        fecha_eva_realizada: string;
        hora_eva_realizada: string;
    };
    Attachments?: EmailAttachment[];
}

export interface EmailTemplateData {
    nombre_usuario: string;
    documento_usuario: string;
    nombre_evaluacion: string;
    numero_periodo: string;
    fecha_eva_realizada: string;
    hora_eva_realizada: string;
}

export interface EnvioEmailPayload {
    Source: string;
    Template: string;
    Destinations: EmailDestination[];
    DefaultTemplateData: EmailTemplateData;
}
