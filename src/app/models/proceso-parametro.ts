export class ProcesoParametro {
  id?: number;
  FechaInicio!: string; 
  FechaFin!: string; 
  ProcesoId?: number;
  PorcentajeProceso?: number;
  Activo?: boolean;
  FechaCreacion?: string; 
  FechaModificacion?: string;  

  constructor(data?: Partial<ProcesoParametro>) {
    if (data) {
      this.id = data.id;
      this.FechaInicio = data.FechaInicio ? ProcesoParametro.formatearFecha(new Date(data.FechaInicio)) : "";
      this.FechaFin = data.FechaFin ? ProcesoParametro.formatearFecha(new Date(data.FechaFin)) : "";
      this.ProcesoId = data.ProcesoId ? Number(data.ProcesoId) : undefined;
      this.PorcentajeProceso = data.PorcentajeProceso;
      this.Activo = data.Activo ?? true;
      this.FechaCreacion = data.FechaCreacion ? ProcesoParametro.formatearFecha(new Date(data.FechaCreacion)) : "";
      this.FechaModificacion = data.FechaModificacion ? ProcesoParametro.formatearFecha(new Date(data.FechaModificacion)) : ProcesoParametro.formatearFecha(new Date());
    }
  }

  toUpdatePayload(): Partial<ProcesoParametro> {
    return {
      id: this.id,
      FechaInicio: this.FechaInicio,
      FechaFin: this.FechaFin,
      ProcesoId: this.ProcesoId,
      PorcentajeProceso: this.PorcentajeProceso,
      Activo: this.Activo,
      FechaCreacion: this.FechaCreacion,
      FechaModificacion: this.FechaModificacion,
    };
  }

  static formatearFecha(fecha: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ` +
           `${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;
  }
}
