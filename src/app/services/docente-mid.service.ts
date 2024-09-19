import { Injectable } from "@angular/core";
import { RequestManager } from "../managers/requestManager";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
//import { HETEROEVALUACION, AUTOEVALUACION_I } from "src/app/models/formularios-data";  // Importa los formularios quemados

@Injectable({
    providedIn: 'root'
})
export class DocenteMidService {
    private apiUrl = environment.EVALUACION_DOCENTE_MID;

    constructor(private requestManager: RequestManager, private http: HttpClient) {
        this.requestManager.setPath('EVALUACION_DOCENTE_MID');
    }

    obtenerFormulario(id_tipo_formulario: number): Observable<any> {
        const endpoint = `${this.apiUrl}formulario_por_tipo/?id_tipo_formulario=${id_tipo_formulario}`;
        return this.http.get(endpoint).pipe(
            map((response: any) => {
                // Acceder a la estructura correcta
                if (response && response.Data && response.Data.Data) {
                    return response.Data.Data;  // Accedemos al nivel correcto de 'Data'
                } else {
                    console.error("Estructura inesperada en la respuesta", response);
                    return null;
                }
            }),
            catchError((error) => {
                console.error("Error al obtener el formulario del backend", error);
                return of(null); // Si falla, devuelve null
            })
        );
    }

    getFormularioPorTipo(id_tipo_formulario: string, id_periodo: string, id_tercero: string, id_espacio: string) {
        const endpoint = `formulario_por_tipo/?id_tipo_formulario=${String(id_tipo_formulario)}&id_periodo=${String(id_periodo)}&id_tercero=${String(id_tercero)}&id_espacio=${String(id_espacio)}&include_respuestas=true`;
        return this.get(endpoint);
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
