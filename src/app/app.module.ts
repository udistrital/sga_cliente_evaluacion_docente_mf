import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter, DateAdapter, MAT_DATE_LOCALE as MAT_LOCALE, MatNativeDateModule } from '@angular/material/core';
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
import { ReporteKnowageComponent } from './components/reporte-knowage/reporte-knowage.component'
import { ResultadosComponent } from './components/resultados/resultados.component';
import { NuxeoComponent } from './components/nuxeo/nuxeo.component';
import { GestorDocumentalService } from './services/gestor-documental.service';
import { DocumentoService } from './services/documento.service';
import { DocenteCrudService } from './services/docente-crud.service';
import { ProyectoAcademicoService } from './services/proyecto_academico.service';
import { OikosService } from 'src/app/services/oikos.service';
import { EspaciosAcademicosService } from './services/espacios_academicos.service';
import { ProcesoParametroService } from './services/proceso-parametro.service';

import { DateService } from './services/date.service';
import { SgaEvaluacionDocenteMidService } from './services/sga_evaluacion_docente_mid.service';
import { EvaluacionDocenteService } from './services/evaluacion-docente-crud.service';
import { DefinicionPlantillasComponent } from './components/definicion-plantillas/definicion-plantillas.component';
import { AcademicaService } from './services/academica.service';
import { CoreService } from './services/core.service';
import { CumplidosDveService } from './services/cumplidos_dve.service';
import { HomologacionDependenciasService } from './services/homologacion_dependencias.service';
import { ProcesosService } from './services/procesos.service';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.apiUrl + 'assets/i18n/', '.json');
}

export function initProcesos(service: ProcesosService) {
  return () => service.cargarProcesos();
}

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY', 
  },
  display: {
    dateInput: 'DD/MM/YYYY', 
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    ReporteKnowageComponent,
    MetricasComponent,
    DynamicFormComponent,
    DialogoConfirmacion,
    PdfViewerComponent,
  ],
  imports: [
    PdfViewerModule,
    BrowserModule,
    AppRoutingModule,
    NgxChartsModule,
    CommonModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
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
    ProcesoParametroService,
    SgaEvaluacionDocenteMidService,
    EvaluacionDocenteService,
    AcademicaService,
    CoreService,
    CumplidosDveService,
    HomologacionDependenciasService,
    ProcesosService,
    {
      provide: APP_INITIALIZER,
      useFactory: initProcesos,
      deps: [ProcesosService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerUtilInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }, 
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_LOCALE, useValue: 'es-CO' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

