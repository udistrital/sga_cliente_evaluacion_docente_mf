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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EvaluacionesComponent } from './components/evaluaciones/evaluaciones.component';
import { HeteroevaluacionComponent } from './components/evaluaciones/heteroevaluacion/heteroevaluacion.component';
import { AutoevaluacionIComponent } from './components/evaluaciones/autoevaluacion-i/autoevaluacion-i.component';
import { CoevaluacionIComponent } from './components/evaluaciones/coevaluacion-i/coevaluacion-i.component';
import { AutoevaluacionIIComponent } from './components/evaluaciones/autoevaluacion-ii/autoevaluacion-ii.component';
import { CoevaluacionIIComponent } from './components/evaluaciones/coevaluacion-ii/coevaluacion-ii.component';
import { MetricasComponent } from './components/metricas/metricas.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
    HeteroevaluacionComponent,
    AutoevaluacionIComponent,
    CoevaluacionIComponent,
    AutoevaluacionIIComponent,
    CoevaluacionIIComponent,
    MetricasComponent
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
    CommonModule,
    BrowserModule,
    MatTabsModule,
    MatIconModule,
    MatStepperModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
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
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerUtilInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
