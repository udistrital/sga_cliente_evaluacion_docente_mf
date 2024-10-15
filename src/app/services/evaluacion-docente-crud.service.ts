import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable()
export class EvaluacionDocenteService {
    tipoCampos = [
        { id: 4674, label: 'Texto' },
        { id: 4668, label: 'Selección Múltiple' },
        { id: 6686, label: 'Cargar Archivos' },
        { id: 4672, label: 'Descargar Archivos' },
    ];
    
    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
    }
    
    get(endpoint: string) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.get(endpoint);
    }
    
    getCamposActivos() {
        return this.get('campo?query=activo:true,CampoPadreId:0&limit=0&sortby=Id&order=desc');
    }

    // Servicio con log adicional para verificar el objeto enviado
    post(endpoint: string, element: any) {
        console.log("Enviando datos al backend:", element);
        
        // Verifica si el TipoCampoId está presente y es válido
        if (!element.TipoCampoId || element.TipoCampoId === 0) {
            console.error("Error: El TipoCampoId no es válido antes del POST:", element.TipoCampoId);
        }
        
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.post(endpoint, element);
    }

    put(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
    
        // Añadir log para verificar que se esté enviando correctamente el PUT
        console.log(`Realizando PUT a ${endpoint} con datos:`, element);
    
        return this.requestManager.put(endpoint, element);
    }
    

    delete(endpoint: string, element: any) {
        this.requestManager.setPath('EVALUACION_DOCENTE_CRUD');
        return this.requestManager.delete(endpoint, element.Id);
    }
}
