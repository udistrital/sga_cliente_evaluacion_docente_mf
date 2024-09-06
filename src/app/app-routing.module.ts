import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getSingleSpaExtraProviders } from 'single-spa-angular';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { DefinicionFormulariosComponent } from './components/definicion-formularios/definicion-formularios.component';
import { AsignacionFechasComponent } from './components/asignacion-fechas/asignacion-fechas.component';
import { DefinirEscalasComponent } from './components/definir-escalas/definir-escalas.component';
import { EvaluacionesComponent } from './components/evaluaciones/evaluaciones.component';
import { MetricasComponent } from './components/metricas/metricas.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component'; // Importa el nuevo componente
import { AuthGuard } from 'src/_guards/auth.guard';
// Importar el componente EmptyRouteComponent
import { NuxeoComponent } from './components/nuxeo/nuxeo.component';

const routes: Routes = [
  {
    path: 'definicion-formularios',
    canActivate: [AuthGuard],
    component: DefinicionFormulariosComponent
  },
  {
    path: 'asignacion-fechas',
    canActivate: [AuthGuard],
    component: AsignacionFechasComponent
  },
  {
    path: 'definir-escalas',
    canActivate: [AuthGuard],
    component: DefinirEscalasComponent
  },
  {
    path: 'evaluaciones',
    //canActivate: [AuthGuard],
    component: EvaluacionesComponent
  },
  {
    path: 'metricas',
    canActivate: [AuthGuard],
    component: MetricasComponent
  },
  {
    path: 'resultados',
    canActivate: [AuthGuard],
    component: ResultadosComponent
  },
  { 
    path: 'nuxeo', 
    component: NuxeoComponent },
  {
    path: 'dynamic-form',
    canActivate: [AuthGuard],
    component: DynamicFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/evaluacion-docente/' },
    ...getSingleSpaExtraProviders(),
    provideHttpClient(withFetch())
  ]
})
export class AppRoutingModule { }
