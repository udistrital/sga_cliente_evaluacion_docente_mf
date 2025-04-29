import { Injectable } from '@angular/core';
import { ParametrosService } from 'src/app/services/parametros.service';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { CategoriaProceso, PROCESOS_CATEGORIAS } from 'src/app/models/diccionario';

@Injectable({
    providedIn: 'root'
})
export class ProcesosService {

    procesosParametro: Record<CategoriaProceso, string[]> = {
        ESTUDIANTE: [],
        DOCENTE: [],
        CONCEJO: []
    };

    constructor(private parametrosService: ParametrosService) { }

    async cargarProcesos(): Promise<void> {
        try {
            const response: any = await firstValueFrom(
                this.parametrosService.get('parametro?query=tipo_parametro_id:' + environment.TIPO_PARAMETRO_ID.PROCESO_EVALUACION_ID)
            );

            if (response && response.Data && response.Data.length) {
                response.Data.forEach((parametro: any) => {
                    const nombre = parametro.Nombre;
                    const id = String(parametro.Id);

                    console.log('Nombre:', nombre);
                    console.log('ID:', id);

                    for (const categoria in PROCESOS_CATEGORIAS) {
                        const key = categoria as CategoriaProceso;
                        if (PROCESOS_CATEGORIAS[key].some(keyword => nombre === keyword)) {
                            this.procesosParametro[key].push(id);
                            break;
                        }
                    }
                });
            } else {
                console.error('No se encontraron parámetros.');
            }
        } catch (error) {
            console.error('Error al cargar procesos:', error);
        }
    }

    getProcesosParametro(): { [key: string]: string[] } {
        return this.procesosParametro;
    }
}