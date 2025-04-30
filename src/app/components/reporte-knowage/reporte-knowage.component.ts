/*import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { spagoBIService } from '../../utils/spagoBIAPI/spagoBIService';
import { ActivatedRoute } from '@angular/router';

//declare const spagoBIService: any;

@Component({
  selector: 'app-reporte-knowage',
  templateUrl: './reporte-knowage.component.html',
  styleUrls: ['./reporte-knowage.component.scss']
})
export class ReporteKnowageComponent implements OnInit {

  reportConfig: any;
  retry: boolean = true;
  spinner: string = 'Cargando reporte.';

  @ViewChild('spagoBIDocumentArea', { static: true }) spagoBIDocumentArea!: ElementRef;
  @Input() reportLabel: string = '';

  constructor(
    private route: ActivatedRoute,
  ) {
    this.initReportConfig();
  }

  initReportConfig() {
    this.route.data.subscribe(data => {
      if (true) {
        //this.reportLabel = data['reportLabel'];
        this.reportLabel = 'RteEvaDocParTotal';
        const reportLabel = this.reportLabel + environment.SPAGOBI.TIPO_REPORTE;
        console.log("this.reportLabel :", reportLabel);
        this.reportConfig = {
          documentLabel: reportLabel,
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
    });
  }

  callbackFunction = (result: any, args: any, success: boolean) => {
    console.log("Callback ejecutado", { result, args, success });

    if (success === true) {
      this.spinner = '';
      const html = spagoBIService.getDocumentHtml(this.reportConfig);
      console.log("HTML generado:", html)
      setTimeout(() => {
        this.spagoBIDocumentArea.nativeElement.innerHTML = html;
      });
      //this.spagoBIDocumentArea.nativeElement.innerHTML = html;
    } else if (this.retry) {
      console.log()
      this.spinner = 'Cargando reporte.';
      this.retry = false;
      this.getReport();
    } else {
      this.spinner = '';
      console.error('Error obteniendo reporte');
      this.spagoBIDocumentArea.nativeElement.innerHTML = `<h5>Error obteniendo reporte</h5>`;
    }
  }

  ngOnInit() {
    this.getReport();
  }

  getReport() {
    spagoBIService.getReport(this, this.callbackFunction);
  }
}*/

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
//import { Sbi } from 'knowagesdk';
//import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reporte-knowage',
  templateUrl: './reporte-knowage.component.html',
  styleUrls: ['./reporte-knowage.component.scss']
})
export class ReporteKnowageComponent implements OnInit {
  url: SafeResourceUrl | null = null;

  /*constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    console.log("ingreso al ngOnInit");
    const label = 'RteEvaDocParTotal';
    this.http.get<{ iframeUrl: string }>(`http://localhost:8567/v1/reporte_knowage?label=${label}`).subscribe({
      next: (data) => {
        console.log("ingreso al renderizado");
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(data.iframeUrl);
      },
      error: (err) => {
        console.error('Error al obtener el reporte:', err);
      }
    });
    console.log("finaliza el ngOnInit");
  }*/
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log("ingreso al ngOnInit");
    const label = 'RteEvaDocParTotal';
  
    /*this.http.get<{ iframeUrl: string }>('http://localhost:8567/v1/reporte_knowage?label=' + label).subscribe({
      next: (data) => {
        console.log("iframeUrl:", data.iframeUrl);
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(data.iframeUrl);
      },
      error: (err: any) => {
        console.error('Error al obtener el reporte:', err);
      }
    });*/

    this.http.get('http://localhost:8567/v1/reporte_knowage?label=' + label, { responseType: 'text' }).subscribe({
      next: (html) => {
        console.log("html:", html);
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl('data:text/html;charset=utf-8,' + encodeURIComponent(html));
      },
      error: (err) => console.error('Error al obtener el reporte:', err)
    });
  
    console.log("finaliza el ngOnInit");
  }
} 
/*export class ReporteKnowageComponent implements OnInit {
  url: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.generarUrlReporte()
      .then((safeUrl) => {
        this.url = safeUrl;
      })
      .catch((err) => {
        console.error('Error al generar el reporte Knowage:', err);
      });
  }

  generarUrlReporte(): Promise<SafeResourceUrl> {
    return new Promise((resolve, reject) => {
      const sbi = new Sbi(
        environment.SPAGOBI.PROTOCOL,
        environment.SPAGOBI.HOST,
        environment.SPAGOBI.PORT,
        environment.SPAGOBI.CONTEXTPATH,
        'servlet/AdapterHTTP'
      );

      sbi.authenticate(environment.SPAGOBI.USER, environment.SPAGOBI.PASSWORD, () => {
        try {
          const html = sbi.getDocumentHtml(
            'RteEvaDocParTotal',
            true,
            false,
            {},
            ''
          );

          console.log('[Knowage] HTML devuelto por getDocumentHtml:', html);

          // Extrae el src del iframe
          const match = html.match(/src\s*=\s*"([^"]+)"/i);
          if (match && match[1]) {
            const customUrl = `https://${environment.SPAGOBI.HOST}:${environment.SPAGOBI.PORT}/${environment.SPAGOBI.CONTEXTPATH}/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ANGULAR_ACTION&OBJECT_LABEL=RteEvaDocParTotal&NEW_SESSION=TRUE&USER=je&PASSWORD=je&ROLE=/spagobi/user&TOOLBAR_VISIBLE=true`;
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(customUrl);

            //const trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(match[1]);
            resolve(this.url);
          } else {
            reject('No se pudo extraer la URL del iframe');
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}*/
