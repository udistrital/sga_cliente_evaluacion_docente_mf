import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MATERIAL_MODULES } from './imports/material';
import { SpinnerUtilInterceptor, SpinnerUtilModule } from 'spinner-util';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { DefinicionFormulariosComponent } from './components/definicion-formularios/definicion-formularios.component';
import { AsignacionFechasComponent } from './components/asignacion-fechas/asignacion-fechas.component';
import { DefinirEscalasComponent, DialogoConfirmacion } from './components/definir-escalas/definir-escalas.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';

import { EvaluacionesComponent } from './components/evaluaciones/evaluaciones.component';
import { NgIsGrantedDirective } from './directives/ng-is-granted.directive';
import { UserService } from './services/user.service';

import { EventosService } from './services/eventos.service';
import { ParametrosService } from './services/parametros.service';
import { AnyService } from './services/any.service';
import { MetricasComponent } from './components/metricas/metricas.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { NuxeoComponent } from './components/nuxeo/nuxeo.component';
import { GestorDocumentalService } from './services/gestor-documental.service';
import { DocumentoService } from './services/documento.service';
import { DocenteCrudService } from './services/docente-crud.service';
import { ProyectoAcademicoService } from './services/proyecto_academico.service';
import { OikosService } from 'src/app/services/oikos.service';
import { EspaciosAcademicosService } from './services/espacios_academicos.service';

import { DateService } from './services/date.service';
import { SgaEvaluacionDocenteMidService } from './services/sga_evaluacion_docente_mid.service';
import { EvaluacionDocenteService } from './services/evaluacion-docente-crud.service';
import { DefinicionPlantillasComponent } from './components/definicion-plantillas/definicion-plantillas.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.apiUrl + 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DefinicionFormulariosComponent,
    AsignacionFechasComponent,
    DefinirEscalasComponent,
    DefinicionPlantillasComponent,
    EvaluacionesComponent,
    NgIsGrantedDirective,
    MetricasComponent,
    NuxeoComponent,
    ResultadosComponent,
    MetricasComponent,
    ResultadosComponent,
    DynamicFormComponent,
    DialogoConfirmacion
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChartsModule,
    CommonModule,
    BrowserAnimationsModule,
    MATERIAL_MODULES,
    HttpClientModule,
    SpinnerUtilModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    EventosService, 
    ParametrosService,
    AnyService,
    ProyectoAcademicoService,
    UserService,
    GestorDocumentalService,
    DocumentoService,
    DocenteCrudService,
    OikosService,
    DateService,
    EspaciosAcademicosService,
    SgaEvaluacionDocenteMidService,
    EvaluacionDocenteService,
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerUtilInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
