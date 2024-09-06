import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ProyectoAcademicoService } from 'src/app/services/proyecto_academico.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import { SgaPlanTrabajoDocenteMidService } from 'src/app/services/plan-trabajo-docente.service';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verificar-ptd',
  templateUrl: './verificar-ptd.component.html',
  styleUrls: ['./verificar-ptd.component.scss']
})
export class VerificarPtdComponent implements OnInit {

  periodos: { select: any, opciones: any[] } = { select: undefined, opciones: [] };
  proyectos: { select: any, opciones: any[] } = { select: undefined, opciones: [] };
  formDocente: FormGroup;
  dataSource: any; // Ajusta según sea necesario
VIEWS: any;
vista: any;

  constructor(
    private translate: TranslateService,
    private popUpManager: PopUpManager,
    private proyectoAcademicoService: ProyectoAcademicoService,
    private parametrosService: ParametrosService,
    private sgaPlanTrabajoDocenteMidService: SgaPlanTrabajoDocenteMidService,
    private builder: FormBuilder
  ) {
    this.formDocente = this.builder.group({});
  }

  ngOnInit() {
    this.loadSelects();
  }

  loadPeriodo(): Promise<any[]> {
    return this.parametrosService.get('periodo?query=CodigoAbreviacion:PA&sortby=Id&order=desc&limit=0').toPromise();
  }

  loadProyectos(): Promise<any[]> {
    return this.proyectoAcademicoService.get('proyecto_academico_institucion?query=Activo:true&sortby=Nombre&order=asc&limit=0').toPromise();
  }

  async loadSelects() {
    try {
      const [periodos, proyectos] = await Promise.all([this.loadPeriodo(), this.loadProyectos()]);
      this.periodos.opciones = periodos;
      this.proyectos.opciones = proyectos;
    } catch (error) {
      console.warn(error);
      this.popUpManager.showPopUpGeneric(this.translate.instant('ERROR.titulo_generico'),
        this.translate.instant('ERROR.sin_informacion_en') + ': <b>' + error + '</b>.<br><br>' +
        this.translate.instant('ERROR.persiste_error_comunique_OAS'),
        'ERROR', false);
    }
  }

  filtrarPlanes(): void {
    if (this.periodos.select && this.proyectos.select) {
      this.sgaPlanTrabajoDocenteMidService.get(`plan/preaprobado?vigencia=${this.periodos.select.Id}&proyecto=${this.proyectos.select.Id}`).subscribe(
        (resp: any) => {
          // Procesa la respuesta y actualiza dataSource según sea necesario
          this.dataSource = resp.Data; // Ajusta según sea necesario
        },
        (err: any) => {
          console.warn(err);
          this.popUpManager.showPopUpGeneric(this.translate.instant('ERROR.titulo_generico'),
            this.translate.instant('ERROR.persiste_error_comunique_OAS'),
            'ERROR', false);
        }
      );
    }
  }

}
