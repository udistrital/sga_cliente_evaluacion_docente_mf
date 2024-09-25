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
import { DefinirEscalasComponent } from './components/definir-escalas/definir-escalas.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper'; 
import { EvaluacionesComponent } from './components/evaluaciones/evaluaciones.component';
import { NgIsGrantedDirective } from './directives/ng-is-granted.directive';
import { UserService } from './services/user.service';

import { EventosService } from './services/eventos.service';
import { ParametrosService } from './services/parametros.service';
import { AnyService } from './services/any.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MetricasComponent } from './components/metricas/metricas.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Importar MatSnackBarModule
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { NuxeoComponent } from './components/nuxeo/nuxeo.component';
import { GestorDocumentalService } from './services/gestor-documental.service';
import { DocumentoService } from './services/documento.service';
import { ProyectoAcademicoService } from './services/proyecto_academico.service';
import { OikosService } from 'src/app/services/oikos.service';
import { EspaciosAcademicosService } from './services/espacios_academicos.service';

import { DateService } from './services/date.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.apiUrl + 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DefinicionFormulariosComponent,
    AsignacionFechasComponent,
    DefinirEscalasComponent,
    EvaluacionesComponent,
    NgIsGrantedDirective,
    MetricasComponent,
    NuxeoComponent,
    ResultadosComponent,
    MetricasComponent,
    ResultadosComponent,
    DynamicFormComponent
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
    MatRadioModule,
    FormsModule,    
    BrowserModule,
    MatTabsModule,
    MatIconModule,
    MatStepperModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    AppRoutingModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSortModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatStepperModule  
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
    OikosService,
    DateService,
    EspaciosAcademicosService,
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerUtilInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
