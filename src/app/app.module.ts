import { NgModule } from '@angular/core';
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
import { NgIsGrantedDirective } from './directives/ng-is-granted.directive';
import { UserService } from './services/user.service';

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
    NgIsGrantedDirective 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    MATERIAL_MODULES,
    HttpClientModule,
    SpinnerUtilModule,
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
  providers: [
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerUtilInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
