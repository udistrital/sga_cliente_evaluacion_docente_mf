import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getSingleSpaExtraProviders } from 'single-spa-angular';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { DefinicionFormulariosComponent } from './components/definicion-formularios/definicion-formularios.component';
import { AsignacionFechasComponent } from './components/asignacion-fechas/asignacion-fechas.component';
import { DefinirEscalasComponent } from './components/definir-escalas/definir-escalas.component';
import { EvaluacionesComponent } from './components/evaluaciones/evaluaciones.component';
import { PruebaComponent } from './components/prueba/prueba.component';
import { MetricasComponent } from './components/metricas/metricas.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component'; // Importa el nuevo componente

const routes: Routes = [
  {
    path: 'definicion-formularios',
    component: DefinicionFormulariosComponent
  },
  {
    path: 'asignacion-fechas',
    component: AsignacionFechasComponent
  },
  {
    path: 'definir-escalas',
    component: DefinirEscalasComponent
  },
  {
    path: 'evaluaciones',
    component: EvaluacionesComponent
  },
  {
    path: 'prueba',
    component: PruebaComponent
  },
  {
    path: 'metricas',
    component: MetricasComponent
  },
  {
    path: 'resultados',
    component: ResultadosComponent
  },
  {
    path: 'dynamic-form',
    component: DynamicFormComponent
  }
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
