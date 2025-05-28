import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { spagoBIService } from '../../utils/spagobi-adapter';

@Component({
  selector: 'app-reporte-knowage',
  templateUrl: './reporte-knowage.component.html',
  styleUrls: ['./reporte-knowage.component.scss']
})
export class ReporteKnowageComponent implements OnInit {

  @Input() reportLabel: string = '';
  @Input() reportNombre: string = '';
  @ViewChild('spagoBIDocumentArea', { static: true }) spagoBIDocumentArea!: ElementRef;

  reportConfig: any;
  spinner: string = 'Cargando reporte...';
  retry: boolean = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.reportLabel && this.reportNombre) {
      this.initReportConfig();
      this.loadReport();
    } else {
      this.spinner = '⚠️ No se ha recibido el nombre, ni el nombre lable del reporte';
    }
  }

  initReportConfig() {
    const tipo = environment.SPAGOBI.TIPO_REPORTE || '';
    const label = this.reportLabel;
    this.reportConfig = {
      documentLabel: label + tipo,
      executionRole: '/spagobi/user',
      displayToolbar: true,
      displaySliders: true,
      iframe: {
        style: 'border: solid rgb(0,0,0,0.2) 1px;',
        height: '600px;',
        width: '100%',
      },
    };
  }

  async loadReport() {
    try {
      await spagoBIService.getReport(this, this.callbackFunction);
    } catch (error) {
      this.spinner = '';
      console.error('No se pudo cargar el reporte Knowage:', error);
      this.spagoBIDocumentArea.nativeElement.innerHTML = `<h5>Error cargando reporte Knowage</h5>`;
    }
  }

  callbackFunction = (result: any, args: any, success: boolean) => {
    if (success) {
      this.spinner = '';
      try {
        const html = spagoBIService.getDocumentHtml(this.reportConfig);
        this.spagoBIDocumentArea.nativeElement.innerHTML = html;
      } catch (e) {
        console.error('Error generando HTML del reporte:', e);
        this.spagoBIDocumentArea.nativeElement.innerHTML = `<h5>Error generando el reporte</h5>`;
      }
    } else if (this.retry) {
      this.retry = false;
      this.spinner = 'Reintentando...';
      this.loadReport();
    } else {
      this.spinner = '';
      this.spagoBIDocumentArea.nativeElement.innerHTML = `<h5>Error obteniendo reporte desde Knowage</h5>`;
    }
  };
}