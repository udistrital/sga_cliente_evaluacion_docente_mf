import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, map } from 'rxjs/operators';
import { AnyService } from 'src/app/services/any.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-dinamicform',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input('normalform') normalform: any;
  @Input('modeloData') modeloData: any;
  @Input('clean') clean!: boolean;
  @Output() result: EventEmitter<any> = new EventEmitter();
  @Output() resultAux: EventEmitter<any> = new EventEmitter();
  @Output() interlaced: EventEmitter<any> = new EventEmitter();
  @Output() percentage: EventEmitter<any> = new EventEmitter();
  
  emptyControl = new FormControl(null);
  form: FormGroup;
  data: any;
  searchTerm$ = new Subject<any>();
  @ViewChild(MatDatepicker, { static: true }) datepicker!: MatDatepicker<Date>;
  @ViewChildren('documento') fileInputs!: QueryList<ElementRef>;

  DocumentoInputVariable!: ElementRef;
  init!: boolean;

  constructor(
    private fb: FormBuilder,
    private sanitization: DomSanitizer,
    private anyService: AnyService,
  ) {
    // Inicializar el formulario con un grupo vacío
    this.form = this.fb.group({
      step_1: this.fb.group({
        // controles para el paso 1
      }),
      step_2: this.fb.group({
        // controles para el paso 2
      }),
      // Añade todos los pasos necesarios
    });

    this.data = {
      valid: true,
      data: {},
      percentage: 0,
      files: [],
    };

    this.searchTerm$
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        filter(data => data.text.length > 3),
        switchMap(({ text, path, query, keyToFilter, field }) => this.searchEntries(text, path, query, keyToFilter, field)),
      )
      .subscribe((response: any) => {
        const opciones = response.queryOptions.Data || response.queryOptions;
        const fieldAutocomplete = this.normalform.campos.find((field: any) => field.nombre === response.options.field.nombre);
        if (fieldAutocomplete) {
          fieldAutocomplete.opciones = opciones;
          if (opciones.length === 1 && Object.keys(opciones[0]).length === 0) {
            const canEmit = fieldAutocomplete.entrelazado || false;
            if (canEmit) {
              this.interlaced.emit({ ...fieldAutocomplete, noOpciones: true, valorBuscado: response.keyToFilter });
            }
          }
        }
      });
  }

  searchEntries(text: string, path: string, query: string, keyToFilter: string, field: any) {
    const channelOptions = new BehaviorSubject<any>({ field: field });
    const options$ = channelOptions.asObservable();
    const queryOptions$ = this.anyService.get(path, query.replace(keyToFilter, text));

    return combineLatest([options$, queryOptions$]).pipe(
      map(([options$, queryOptions$]) => ({
        options: options$,
        queryOptions: queryOptions$,
        keyToFilter: text,
      }))
    );
  }

  ngOnChanges(changes: any) {
    if (changes.normalform && changes.normalform.currentValue) {
      this.normalform = changes.normalform.currentValue;
      this.initializeForm();
    }
    if (changes.modeloData && changes.modeloData.currentValue) {
      this.modeloData = changes.modeloData.currentValue;
      if (this.normalform.campos) {
        this.normalform.campos.forEach((element: any) => {
          for (const key in this.modeloData) {
            if (this.modeloData.hasOwnProperty(key)) {
              if (key === element.nombre && this.modeloData[key] !== null) {
                switch (element.etiqueta) {
                  case 'selectmultiple':
                    element.valor = [];
                    if (this.modeloData[key].length > 0) {
                      this.modeloData[key].forEach((e1: any) =>
                        element.opciones.forEach((e2: any) => {
                          if (e1.Id === e2.Id) {
                            element.valor.push(e2);
                          }
                        })
                      );
                    }
                    break;
                  case 'select':
                    element.valor = element.opciones.find((e1: any) => e1.Id === this.modeloData[key].Id);
                    break;
                  case 'mat-date':
                    element.valor = new Date(this.modeloData[key]);
                    break;
                  case 'file':
                    element.url = this.cleanURL(this.modeloData[key]);
                    element.urlTemp = this.modeloData[key];
                    break;
                  default:
                    element.valor = this.modeloData[key];
                }
                this.validCampo(element);
              }
            }
          }
        });
        this.setPercentage();
      }
    }
    if (changes.clean && this.init) {
      this.clearForm();
      this.clean = false;
    }
  }

  ngOnInit() {
    this.init = true;
    if (!this.normalform.tipo_formulario) {
      this.normalform.tipo_formulario = 'mini';
    }

    this.initializeForm();

    this.normalform.campos = this.normalform.campos.map((d: any) => {
      d.clase = 'form-control';
      if (d.relacion === undefined) {
        d.relacion = true;
      }
      if (!d.valor) {
        d.valor = d.etiqueta === 'checkbox' ? false : '';
      }
      if (!d.deshabilitar) {
        d.deshabilitar = false;
      }
      if (d.etiqueta === 'fileRev') {
        d.File = undefined;
        d.urlTemp = undefined;
      }
      return d;
    });
  }

  initializeForm() {
    const formGroup: { [key: string]: any } = {};
    this.normalform.campos.forEach((c: any) => {
      formGroup[c.nombre] = [c.valor || ''];
    });
    this.form = this.fb.group(formGroup);
  }
  
  onChange(event: any, c: any) {
    if (c.etiqueta === 'file') {
      c.urlTemp = URL.createObjectURL(event.target.files[0]);
      c.url = this.cleanURL(c.urlTemp);
      c.valor = event.target.files[0];
      c.File = event.target.files[0];
    }
    this.validCampo(c);
  }

  getStepControlName(step: number): string {
    return `step_${step}`;
}

  onChangeDate(event: any, c: any) {
    c.valor = event.value;
  }

  displayWithFn(value: any): string {
    return value ? value.nombre || value.label || value : '';  // Ajusta según el tipo de objeto esperado
  }

  setNewValue(event: any, field: any): void {
    field.valor = event.option.value;
    this.validCampo(field);  // Asume que validCampo es un método existente para validar el campo
  }

  download(url: string, nombre: string, w: number, h: number) {
    const link = document.createElement('a');
    link.href = url;
    link.download = nombre;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  clearForm() {
    this.normalform.campos.forEach((d: any) => {
      d.valor = d.etiqueta === 'checkbox' ? false : null;
      if (d.etiqueta === 'file' || d.etiqueta === 'fileRev') {
        const nativeElement = this.DocumentoInputVariable ? this.DocumentoInputVariable.nativeElement : null;
        if (nativeElement) nativeElement.value = '';
        d.File = undefined;
        d.url = '';
        d.urlTemp = '';
      }
      if (d.etiqueta === 'autocomplete') {
        const e = document.querySelectorAll('.inputAuto');
        e.forEach((el: any) => (el.value = ''));
        d.opciones = [];
      }
      d.alerta = '';
      d.clase = 'form-control form-control-success';
    });
    this.percentage.emit(0);
  }

  validCampo(c: any, emit = true): boolean {
    if (c.requerido && (!c.valor || (c.etiqueta === 'file' && !c.valor.name) || c.valor === '')) {
      c.alerta = '** Debe llenar este campo';
      c.clase = 'form-control form-control-danger';
      return false;
    }
    if (c.etiqueta === 'input' && c.tipo === 'number') {
      c.valor = parseInt(c.valor, 10);
      if (c.valor < c.minimo) {
        c.clase = 'form-control form-control-danger';
        c.alerta = 'El valor no puede ser menor que ' + c.minimo;
        return false;
      }
    }
    if (c.etiqueta === 'input' && c.tipo === 'email') {
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!pattern.test(c.valor)) {
        c.clase = 'form-control form-control-danger';
        c.alerta = 'No es un correo válido';
        return false;
      }
    }
    c.clase = 'form-control form-control-success';
    c.alerta = '';
    if (c.entrelazado && emit) {
      this.interlaced.emit(c);
    }
    return true;
  }

  checkConfirmacion(): boolean {
    let valido = true;
    const camposAValidar = this.normalform.campos.filter((campo: any) => campo.etiqueta === 'inputConfirmacion');
    const l = camposAValidar.length;

    if (l % 2 === 0) {
        for (let i = 0; i < l; i += 2) {
            if (camposAValidar[i].valor !== camposAValidar[i + 1].valor) {
                camposAValidar[i].clase = 'form-control form-control-danger';
                camposAValidar[i + 1].clase = 'form-control form-control-danger';
                camposAValidar[i].alerta = camposAValidar[i].mensajeIguales || 'Los valores no coinciden';
                camposAValidar[i + 1].alerta = camposAValidar[i + 1].mensajeIguales || 'Los valores no coinciden';
                valido = false;
            } else {
                camposAValidar[i].clase = 'form-control form-control-success';
                camposAValidar[i + 1].clase = 'form-control form-control-success';
                camposAValidar[i].alerta = '';
                camposAValidar[i + 1].alerta = '';
            }
        }
    } else {
        console.warn('Error: Un campo de confirmación no tiene pareja');
        valido = false;
    }

    return valido;
}

  validForm() {
    const result: any = {};
    let requeridos = 0;
    let resueltos = 0;
    this.data.data = {};
    this.data.valid = true;

    this.normalform.campos.forEach((d: any) => {
      requeridos = d.requerido && !d.ocultar ? requeridos + 1 : requeridos;
      if (this.validCampo(d, false)) {
        if ((d.etiqueta === 'file' || d.etiqueta === 'fileRev') && !d.ocultar) {
          result[d.nombre] = { file: d.File, url: d.url };
        } else {
          result[d.nombre] = d.valor;
        }
        resueltos = d.requerido ? resueltos + 1 : resueltos;
      } else {
        this.data.valid = false;
      }
    });

    this.data.percentage = (resueltos / requeridos);
    this.data.valid = this.data.valid && this.checkConfirmacion();

    if (this.data.valid && this.data.percentage >= 1) {
      this.data.data = this.normalform.modelo ? { [this.normalform.modelo]: result } : result;
    }

    this.result.emit(this.data);
    if (this.data.valid) {
      this.percentage.emit(this.data.percentage);
    }
    return this.data;
  }

  auxButton(c: any) {
    const result: any = {};
    this.normalform.campos.forEach((d: any) => {
      result[d.nombre] = d.etiqueta === 'file' ? { file: d.File } : d.valor;
    });
    const dataTemp = {
      data: result,
      button: c.nombre,
    };
    c.resultado ? this.result.emit(dataTemp) : this.resultAux.emit(dataTemp);
  }

  setPercentage() {
    let requeridos = 0;
    let resueltos = 0;
    this.normalform.campos.forEach((form_element: any) => {
      if (form_element.requerido && !form_element.ocultar) {
        requeridos += 1;
        resueltos += form_element.valor ? 1 : 0;
      }
    });
    this.percentage.emit(resueltos / requeridos);
  }

  cleanURL(oldURL: string): SafeResourceUrl {
    return this.sanitization.bypassSecurityTrustUrl(oldURL);
  }

  onCheckboxChange(c: any) {
    c.valor = !c.valor;
    c.alerta = '';
  }
  getUniqueSteps(campos: any[]): number[] {
    const uniqueSteps: number[] = [];
    for (const campo of campos) {
      if (!uniqueSteps.includes(campo.step) && this.form.get(this.getStepControlName(campo.step))) {
        uniqueSteps.push(campo.step);
      }
    }
    return uniqueSteps;
  }
  
  getFieldsInStep(step: number): any[] {
    return this.normalform.campos.filter((c: any) => c.step === step);
  }

  handleKeyUp(event: KeyboardEvent, c: any) {
    const target = event.target as HTMLInputElement;
    this.searchTerm$.next({
      text: target.value,
      path: c.path,
      query: c.query,
      field: c,
      keyToFilter: c.keyToFilter,
    });
  }
}
