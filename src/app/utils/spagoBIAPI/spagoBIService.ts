import { environment } from '../../../environments/environment';
declare const Sbi: any; // Esto es importante

const { SPAGOBI } = environment;

function loadSbiSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Sbi) {
      resolve(); // Ya está cargado
      return;
    }

    const script = document.createElement('script');
    script.src = 'assets/sbisdk-all-production.js'; // ⚠️ Usa la ruta real desde dist/
    script.type = 'text/javascript';
    script.onload = () => {
      if ((window as any).Sbi) {
        resolve();
      } else {
        reject('Sbi se cargó pero no está definido.');
      }
    };
    script.onerror = () => reject('Error al cargar el SDK de SpagoBI.');
    document.head.appendChild(script);
  });
}


function setBaseUrl(config: any) {
  Sbi.sdk.services.setBaseUrl(config);
}

function authenticate(config: any) {
  Sbi.sdk.api.authenticate(config);
}

function getDocumentHtml(config: any): string {
  return Sbi.sdk.api.getDocumentHtml(config);
}

function getDocumentUrl(config: any): string {
  return Sbi.sdk.api.getDocumentUrl(config);
}

function getReport(scope: any, callbackFunction: any) {
  loadSbiSdk().then(() => {
    const Sbi = (window as any).Sbi;

    const baseUrl = {
      protocol: SPAGOBI.PROTOCOL,
      host: SPAGOBI.HOST,
      port: SPAGOBI.PORT,
      contextPath: SPAGOBI.CONTEXTPATH,
      controllerPath: 'servlet/AdapterHTTP'
    };
    const authConf = {
      params: {
        user: SPAGOBI.USER,
        password: SPAGOBI.PASSWORD
      },
      callback: {
        fn: callbackFunction,
        scope: scope
      }
    };

    Sbi.sdk.services.setBaseUrl(baseUrl);
    Sbi.sdk.api.authenticate(authConf);
  }).catch(error => {
    console.error('[spagoBIService] Error cargando el SDK:', error);
  });
}


export const spagoBIService = {
  getReport,
  getDocumentHtml,
  getDocumentUrl
};
