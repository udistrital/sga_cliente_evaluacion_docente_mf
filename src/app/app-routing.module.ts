import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getSingleSpaExtraProviders } from 'single-spa-angular';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DefinicionFormulariosComponent } from './componentes/definicion-formularios/definicion-formularios.component';
import { AsignacionFechasComponent } from './componentes/asignacion-fechas/asignacion-fechas.component';

const routes: Routes = [
  {
    path: '',
    component: DefinicionFormulariosComponent 
  },
  {
    path: 'asignacion-fechas',
    component: AsignacionFechasComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/sga_cliente_evaluacion_docente_mf/' },
    ...getSingleSpaExtraProviders(),
    provideHttpClient(withFetch())
  ]
})
export class AppRoutingModule { }
