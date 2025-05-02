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
  @ViewChild('spagoBIDocumentArea', { static: true }) spagoBIDocumentArea!: ElementRef;

  reportConfig: any;
  spinner: string = 'Cargando reporte...';
  retry: boolean = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.initReportConfig();
    this.loadReport();
  }

  initReportConfig() {
    const tipo = environment.SPAGOBI.TIPO_REPORTE || '';
    const label = 'RteAspirantesProd';
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




// /*export class ReporteKnowageComponent implements OnInit {
//   url: SafeResourceUrl | null = null;

//   constructor(private sanitizer: DomSanitizer) {}

//   ngOnInit(): void {
//     this.generarUrlReporte()
//       .then((safeUrl) => {
//         this.url = safeUrl;
//       })
//       .catch((err) => {
//         console.error('Error al generar el reporte Knowage:', err);
//       });
//   }

//   generarUrlReporte(): Promise<SafeResourceUrl> {
//     return new Promise((resolve, reject) => {
//       const sbi = new Sbi(
//         environment.SPAGOBI.PROTOCOL,
//         environment.SPAGOBI.HOST,
//         environment.SPAGOBI.PORT,
//         environment.SPAGOBI.CONTEXTPATH,
//         'servlet/AdapterHTTP'
//       );

//       sbi.authenticate(environment.SPAGOBI.USER, environment.SPAGOBI.PASSWORD, () => {
//         try {
//           const html = sbi.getDocumentHtml(
//             'RteEvaDocParTotal',
//             true,
//             false,
//             {},
//             ''
//           );

//           console.log('[Knowage] HTML devuelto por getDocumentHtml:', html);

//           // Extrae el src del iframe
//           const match = html.match(/src\s*=\s*"([^"]+)"/i);
//           if (match && match[1]) {
//             const customUrl = `https://${environment.SPAGOBI.HOST}:${environment.SPAGOBI.PORT}/${environment.SPAGOBI.CONTEXTPATH}/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ANGULAR_ACTION&OBJECT_LABEL=RteEvaDocParTotal&NEW_SESSION=TRUE&USER=je&PASSWORD=je&ROLE=/spagobi/user&TOOLBAR_VISIBLE=true`;
//             this.url = this.sanitizer.bypassSecurityTrustResourceUrl(customUrl);

//             //const trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(match[1]);
//             resolve(this.url);
//           } else {
//             reject('No se pudo extraer la URL del iframe');
//           }
//         } catch (e) {
//           reject(e);
//         }
//       });
//     });
//   }
// }*/


//     this.http.get('http://localhost:8567/v1/reporte_knowage?label=' + label, { responseType: 'text' }).subscribe({
//       next: (html) => {
//         console.log("html:", html);
//         this.url = this.sanitizer.bypassSecurityTrustResourceUrl('data:text/html;charset=utf-8,' + encodeURIComponent(html));
//       },
//       error: (err) => console.error('Error al obtener el reporte:', err)
//     });
  
//     console.log("finaliza el ngOnInit");
//   }
// } 
// /*export class ReporteKnowageComponent implements OnInit {
//   url: SafeResourceUrl | null = null;

//   constructor(private sanitizer: DomSanitizer) {}

//   ngOnInit(): void {
//     this.generarUrlReporte()
//       .then((safeUrl) => {
//         this.url = safeUrl;
//       })
//       .catch((err) => {
//         console.error('Error al generar el reporte Knowage:', err);
//       });
//   }

//   generarUrlReporte(): Promise<SafeResourceUrl> {
//     return new Promise((resolve, reject) => {
//       const sbi = new Sbi(
//         environment.SPAGOBI.PROTOCOL,
//         environment.SPAGOBI.HOST,
//         environment.SPAGOBI.PORT,
//         environment.SPAGOBI.CONTEXTPATH,
//         'servlet/AdapterHTTP'
//       );

//       sbi.authenticate(environment.SPAGOBI.USER, environment.SPAGOBI.PASSWORD, () => {
//         try {
//           const html = sbi.getDocumentHtml(
//             'RteEvaDocParTotal',
//             true,
//             false,
//             {},
//             ''
//           );

//           console.log('[Knowage] HTML devuelto por getDocumentHtml:', html);

//           // Extrae el src del iframe
//           const match = html.match(/src\s*=\s*"([^"]+)"/i);
//           if (match && match[1]) {
//             const customUrl = `https://${environment.SPAGOBI.HOST}:${environment.SPAGOBI.PORT}/${environment.SPAGOBI.CONTEXTPATH}/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ANGULAR_ACTION&OBJECT_LABEL=RteEvaDocParTotal&NEW_SESSION=TRUE&USER=je&PASSWORD=je&ROLE=/spagobi/user&TOOLBAR_VISIBLE=true`;
//             this.url = this.sanitizer.bypassSecurityTrustResourceUrl(customUrl);

//             //const trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(match[1]);
//             resolve(this.url);
//           } else {
//             reject('No se pudo extraer la URL del iframe');
//           }
//         } catch (e) {
//           reject(e);
//         }
//       });
//     });
//   }
// }*/
