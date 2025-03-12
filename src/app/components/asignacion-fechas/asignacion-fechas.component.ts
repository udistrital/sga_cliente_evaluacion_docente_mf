import { Component, OnInit } from "@angular/core";
import { ROLES_ASIGNACION_FECHAS } from "src/app/models/diccionario";
import { UserService } from "src/app/services/user.service";
import { ParametrosService } from "src/app/services/parametros.service";
import { ProcesoParametroService } from "src/app/services/proceso-parametro.service";
import { ProcesoParametro } from "src/app/models/proceso-parametro";
import { PopUpManager } from "src/app/managers/popUpManager";

@Component({
  selector: "app-asignacion-fechas",
  templateUrl: "./asignacion-fechas.component.html",
  styleUrls: ["./asignacion-fechas.component.scss"],
})
export class AsignacionFechasComponent implements OnInit {
  ROLES_ASIGNACION_FECHAS = ROLES_ASIGNACION_FECHAS;
  tienePermiso: boolean = false;
  userRoles: string[] = [];
  procesos: any[] = [];
  guardarHabilitado!: boolean;

  constructor(
    private userService: UserService,
    private parametrosService: ParametrosService,
    private procesoParametroService: ProcesoParametroService,
    private popUpManager: PopUpManager,
  ) { }

  ngOnInit(): void {
    this.userService.getUserRoles().then(roles => {
      this.userRoles = roles;
      this.tienePermiso = this.hasRole(Object.values(this.ROLES_ASIGNACION_FECHAS));
      //this.tienePermiso = false;

      if (this.tienePermiso) {
        this.procesoParametroService.get('proceso_parametro?sortby=id&order=asc').subscribe(
          (responseProcesoParam: any) => {
            if (responseProcesoParam && responseProcesoParam.Data && responseProcesoParam.Data.length) {
              this.parametrosService.get('parametro?query=tipo_parametro_id:152').subscribe(
                (responseParametro: any) => {
                  if (responseParametro && responseParametro.Data && responseParametro.Data.length) {
                    responseProcesoParam.Data.forEach((item: any) => {
                      let procesoEncontrado = responseParametro.Data.find((param: any) => param.Id === item.ProcesoId);
                      if (procesoEncontrado) {
                        this.procesos.push({
                          id: String(item.Id),
                          nombre: procesoEncontrado.Nombre,
                          fechaInicio: item.FechaInicio ? this.convertirFechaSinZonaHoraria(item.FechaInicio) : "",
                          fechaFin: item.FechaFin ? this.convertirFechaSinZonaHoraria(item.FechaFin) : "",
                          idProceso: String(item.ProcesoId),
                          porcentajeProceso: String(item.PorcentajeProceso),
                          fechaCreacion: item.FechaCreacion ? this.convertirFechaSinZonaHoraria(item.FechaCreacion) : "",
                          fechaModificacion: item.FechaModificacion ? this.convertirFechaSinZonaHoraria(item.FechaModificacion) : "",
                        });
                      }
                    }
                    );
                  } else {
                    this.popUpManager.showErrorAlert(`No se encontraron parametros o la estructura de datos no es la esperada.`);
                  }
                },
                (error) => {
                  this.popUpManager.showErrorAlert(`Error al obtener los parametros.`);
                }
              );
            } else {
              this.popUpManager.showErrorAlert(`No se encontraron procesos o la estructura de datos no es la esperada.`);
            }
          },
          (error) => {
            this.popUpManager.showErrorAlert(`Error al obtener los procesos.`);
          }
        );
      } else {
        this.popUpManager.showErrorAlert(`Acceso denegado: el usuario no tiene permisos para ver esta información.`);
      }
    }).catch(error => this.popUpManager.showErrorAlert(`Error al obtener los roles de usuario.`));
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.userRoles.includes(role));
  }

  convertirFechaSinZonaHoraria(fechaString: string): Date {
    const partes = fechaString.split(/[- :]/); 
    return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]), Number(partes[3]), Number(partes[4]), Number(partes[5]));
  }

  validarFechas(proceso: any) {
    if (!proceso.fechaInicio || !proceso.fechaFin) {
      proceso.errorFecha = "Debe seleccionar ambas fechas.";
      this.verificarHabilitarGuardar();
      return;
    }

    const fechaInicio = new Date(proceso.fechaInicio);
    const fechaFin = new Date(proceso.fechaFin);
  
    if (!fechaInicio) {
      proceso.errorFecha = "Fecha de inicio inválida.";
      proceso.fechaInicio = "";
      this.verificarHabilitarGuardar();
      return;
    }
  
    if (!fechaFin) {
      proceso.errorFecha = "Fecha de fin inválida.";
      proceso.fechaFin = "";
      this.verificarHabilitarGuardar();
      return;
    }
  
    if (fechaInicio > fechaFin) {
      proceso.errorFecha = "La fecha de inicio no puede ser mayor que la fecha de fin.";
      proceso.fechaFin = "";
    } else {
      proceso.errorFecha = ""; 
    }
  
    this.verificarHabilitarGuardar();
  }
  
  verificarHabilitarGuardar() {
    this.guardarHabilitado = this.procesos.every(proceso => proceso.fechaInicio && proceso.fechaFin && !proceso.errorFecha);
  }
  
  guardar() {
    let procesosActualizados = 0;
    let erroresActualizacion = 0;
    let totalProcesos = this.procesos.length;

    for (let proceso of this.procesos) {

      if (!proceso.idProceso) {
        continue;
      }

      const fechaInicio = proceso.fechaInicio ? this.formatearFecha(new Date(proceso.fechaInicio)) : "";
      const fechaFin = proceso.fechaFin ? this.formatearFecha(new Date(proceso.fechaFin)) : "";
      const fechaCreacion = proceso.fechaCreacion ? this.formatearFecha(new Date(proceso.fechaCreacion)) : "";
      const fechaModificacion = this.formatearFecha(new Date());

      const nuevoProcesoParametro = new ProcesoParametro({
        id: Number(proceso.id),
        FechaInicio: fechaInicio,
        FechaFin: fechaFin,
        ProcesoId: Number(proceso.idProceso),
        PorcentajeProceso: Number(proceso.porcentajeProceso),
        Activo: true,
        FechaCreacion: fechaCreacion,
        FechaModificacion: fechaModificacion
      });

      this.procesoParametroService.put(`proceso_parametro/${proceso.id}`, nuevoProcesoParametro.toUpdatePayload()).subscribe(
        (response) => {
          procesosActualizados++;

          if (procesosActualizados + erroresActualizacion === totalProcesos) {
            this.mostrarPopUp(procesosActualizados, erroresActualizacion);
          } else {
            this.popUpManager.showErrorAlert(`Se genero un error inesperado actualizando las fechas.`); 
          }
        },
        (error) => {
          this.popUpManager.showErrorAlert(`Se genero un error actualizando el proceso de ${proceso.nombre}.`); 
          erroresActualizacion++;

          if (procesosActualizados + erroresActualizacion === totalProcesos) {
            this.mostrarPopUp(procesosActualizados, erroresActualizacion);
          }
        }
      );
    }
  }

  mostrarPopUp(procesosActualizados: number, errores: number) {
    if (errores === 0) {
      this.popUpManager.showSuccessAlert(`Se actualizaron los ${procesosActualizados} procesos correctamente.`);
    } else {
      this.popUpManager.showErrorAlert(`${procesosActualizados} procesos actualizados con éxito, pero hubo ${errores} errores.`);
    }
  }  

  formatearFecha(fecha: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
  
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ` +
           `${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;
  }  

}
