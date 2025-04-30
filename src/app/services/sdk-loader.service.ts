
// src/app/services/sdk-loader.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SdkLoaderService {
  private sdkLoaded = false;

  loadSdk(): Promise<void> {
    if (this.sdkLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/js/knowageSdk.min.js'; // O la URL si está disponible externamente
      script.type = 'text/javascript';
      script.onload = () => {
        this.sdkLoaded = true;
        resolve();
      };
      script.onerror = (error: any) => reject(`Error cargando SDK Knowage: ${error}`);
      document.head.appendChild(script);
    });
  }
}
