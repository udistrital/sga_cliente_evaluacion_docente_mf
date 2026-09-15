import { environment } from '../../environments/environment';

const { SPAGOBI } = environment;

const spagoBIService: any = {};

async function loadSdk() {
  if ((window as any).Sbi?.sdk) return;
  await (window as any).System.import('sbisdk');
}

spagoBIService.getReport = async function (scope: any, callbackFunction: Function) {
  await loadSdk();

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

  (window as any).Sbi.sdk.services.setBaseUrl(baseUrl);
  (window as any).Sbi.sdk.api.authenticate(authConf);
};

spagoBIService.getDocumentHtml = function (config: any): string {
  return (window as any).Sbi.sdk.api.getDocumentHtml(config);
};

spagoBIService.getDocumentUrl = function (config: any): string {
  return (window as any).Sbi.sdk.api.getDocumentUrl(config);
};

export { spagoBIService };