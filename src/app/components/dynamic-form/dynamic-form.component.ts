import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
  // Inputs
  @Input() normalform: any;
  @Input() modeloData: any;
  @Input() clean!: boolean;

  // Outputs
  @Output() result = new EventEmitter<any>();
  @Output() resultAux = new EventEmitter<any>();
  @Output() interlaced = new EventEmitter<any>();
  @Output() percentage = new EventEmitter<any>();

  // Form-related properties
  form: FormGroup = new FormGroup({});
  emptyControl = new FormControl(null);
  data: any;
  searchTerm$ = new Subject<any>();

  // View references
  @ViewChild(MatDatepicker, { static: true }) datepicker!: MatDatepicker<Date>;
  @ViewChildren('documento') fileInputs!: QueryList<ElementRef>;
  DocumentoInputVariable!: ElementRef;

  init = false;

  constructor(
    private fb: FormBuilder,
    private sanitization: DomSanitizer,
    private anyService: AnyService,
  ) {
    this.initializeForm();
    this.initializeData();
    this.setupSearchSubscription();
  }

  ngOnInit() {
    this.init = true;
    if (!this.normalform.tipo_formulario) {
      this.normalform.tipo_formulario = 'mini';
    }
    this.initializeFormFields();
  }

  ngOnChanges(changes: any) {
    this.handleInputChanges(changes);
  }

  // Initialize form with empty group structure
  private initializeForm() {
    this.form = this.fb.group({
      step_1: this.fb.group({}),
      step_2: this.fb.group({}),
      // Add additional steps as necessary
    });
  }

  private initializeData() {
    this.data = {
      valid: true,
      data: {},
      percentage: 0,
      files: [],
    };
  }

  private setupSearchSubscription() {
    this.searchTerm$
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        filter(data => data.text.length > 3),
        switchMap(({ text, path, query, keyToFilter, field }) =>
          this.searchEntries(text, path, query, keyToFilter, field)
        )
      )
      .subscribe(response => this.handleSearchResponse(response));
  }

  private handleInputChanges(changes: any) {
    if (changes.normalform?.currentValue) {
      this.normalform = changes.normalform.currentValue;
      this.initializeFormFields();
    }

    if (changes.modeloData?.currentValue) {
      this.modeloData = changes.modeloData.currentValue;
      this.populateFormWithModelData();
    }

    if (changes.clean && this.init) {
      this.clearForm();
      this.clean = false;
    }
  }

  private initializeFormFields() {
    const formGroup: { [key: string]: any } = {};
    this.normalform.campos.forEach((c: any) => {
      formGroup[c.nombre] = [c.valor || ''];
    });
    this.form = this.fb.group(formGroup);

    this.normalform.campos = this.normalform.campos.map((d: any) => {
      d.clase = 'form-control';
      d.relacion = d.relacion !== undefined ? d.relacion : true;
      d.valor = d.valor || (d.etiqueta === 'checkbox' ? false : '');
      d.deshabilitar = d.deshabilitar || false;
      if (d.etiqueta === 'fileRev') {
        d.File = undefined;
        d.urlTemp = undefined;
      }
      return d;
    });
  }

  private populateFormWithModelData() {
    if (this.normalform.campos) {
      this.normalform.campos.forEach((element: any) => {
        const key = Object.keys(this.modeloData).find(k => k === element.nombre && this.modeloData[k] !== null);
        if (key) {
          this.populateFormField(element, this.modeloData[key]);
        }
      });
      this.setPercentage();
    }
  }

  private populateFormField(element: any, value: any) {
    switch (element.etiqueta) {
      case 'selectmultiple':
        this.populateSelectMultipleField(element, value);
        break;
      case 'select':
        element.valor = element.opciones.find((e: any) => e.Id === value.Id);
        break;
      case 'mat-date':
        element.valor = new Date(value);
        break;
      case 'file':
        element.url = this.cleanURL(value);
        element.urlTemp = value;
        break;
      default:
        element.valor = value;
    }
    this.validCampo(element);
  }

  onChange(event: any, c: any) {
    if (c.etiqueta === 'file') {
      this.handleFileChange(event, c);
    }
    this.validCampo(c);
  }

  private handleFileChange(event: any, c: any) {
    c.urlTemp = URL.createObjectURL(event.target.files[0]);
    c.url = this.cleanURL(c.urlTemp);
    c.valor = event.target.files[0];
    c.File = event.target.files[0];
  }

  getStepControlName(step: number): string {
    return `step_${step}`;
  }

  onChangeDate(event: any, c: any) {
    c.valor = event.value;
  }

  displayWithFn(value: any): string {
    return value ? value.nombre || value.label || value : '';
  }

  setNewValue(event: any, field: any): void {
    field.valor = event.option.value;
    this.validCampo(field);
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
      this.resetField(d);
    });
    this.percentage.emit(0);
  }

  private resetField(d: any) {
    if (d.etiqueta === 'file' || d.etiqueta === 'fileRev') {
      this.resetFileField(d);
    }
    if (d.etiqueta === 'autocomplete') {
      this.resetAutocompleteField();
    }
    d.alerta = '';
    d.clase = 'form-control form-control-success';
  }

  private resetFileField(d: any) {
    const nativeElement = this.DocumentoInputVariable?.nativeElement || null;
    if (nativeElement) nativeElement.value = '';
    d.File = undefined;
    d.url = '';
    d.urlTemp = '';
  }

  private resetAutocompleteField() {
    const e = document.querySelectorAll('.inputAuto');
    e.forEach((el: any) => (el.value = ''));
  }

  validCampo(c: any, emit = true): boolean {
    if (this.isFieldInvalid(c)) {
      c.alerta = '** Debe llenar este campo';
      c.clase = 'form-control form-control-danger';
      return false;
    }
    this.validateField(c);
    if (c.entrelazado && emit) {
      this.interlaced.emit(c);
    }
    return true;
  }

  private isFieldInvalid(c: any): boolean {
    return c.requerido && (!c.valor || (c.etiqueta === 'file' && !c.valor.name) || c.valor === '');
  }

  private validateField(c: any) {
    if (c.etiqueta === 'input' && c.tipo === 'number') {
      this.validateNumberField(c);
    } else if (c.etiqueta === 'input' && c.tipo === 'email') {
      this.validateEmailField(c);
    } else {
      c.clase = 'form-control form-control-success';
      c.alerta = '';
    }
  }

  private validateNumberField(c: any) {
    c.valor = parseInt(c.valor, 10);
    if (c.valor < c.minimo) {
      c.clase = 'form-control form-control-danger';
      c.alerta = `El valor no puede ser menor que ${c.minimo}`;
    }
  }

  private validateEmailField(c: any) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(c.valor)) {
      c.clase = 'form-control form-control-danger';
      c.alerta = 'No es un correo válido';
    }
  }

  checkConfirmacion(): boolean {
    let valido = true;
    const camposAValidar = this.normalform.campos.filter((campo: any) => campo.etiqueta === 'inputConfirmacion');
    if (camposAValidar.length % 2 !== 0) {
      console.warn('Error: Un campo de confirmación no tiene pareja');
      return false;
    }

    for (let i = 0; i < camposAValidar.length; i += 2) {
      if (camposAValidar[i].valor !== camposAValidar[i + 1].valor) {
        this.markAsInvalid(camposAValidar[i], camposAValidar[i + 1]);
        valido = false;
      } else {
        this.markAsValid(camposAValidar[i], camposAValidar[i + 1]);
      }
    }
    return valido;
  }

  private markAsInvalid(field1: any, field2: any) {
    field1.clase = 'form-control form-control-danger';
    field2.clase = 'form-control form-control-danger';
    field1.alerta = field1.mensajeIguales || 'Los valores no coinciden';
    field2.alerta = field2.mensajeIguales || 'Los valores no coinciden';
  }

  private markAsValid(field1: any, field2: any) {
    field1.clase = 'form-control form-control-success';
    field2.clase = 'form-control form-control-success';
    field1.alerta = '';
    field2.alerta = '';
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
        this.populateResult(d, result);
        resueltos = d.requerido ? resueltos + 1 : resueltos;
      } else {
        this.data.valid = false;
      }
    });

    this.calculatePercentage(resueltos, requeridos);
    this.result.emit(this.data);

    return this.data;
  }

  private populateResult(d: any, result: any) {
    if ((d.etiqueta === 'file' || d.etiqueta === 'fileRev') && !d.ocultar) {
      result[d.nombre] = { file: d.File, url: d.url };
    } else {
      result[d.nombre] = d.valor;
    }
  }

  private calculatePercentage(resueltos: number, requeridos: number) {
    this.data.percentage = resueltos / requeridos;
    this.data.valid = this.data.valid && this.checkConfirmacion();
    if (this.data.valid && this.data.percentage >= 1) {
      this.data.data = this.normalform.modelo ? { [this.normalform.modelo]: this.data.data } : this.data.data;
    }
    this.percentage.emit(this.data.percentage);
  }

  auxButton(c: any) {
    const result: any = {};
    this.normalform.campos.forEach((d: any) => {
      result[d.nombre] = d.etiqueta === 'file' ? { file: d.File } : d.valor;
    });
    const dataTemp = { data: result, button: c.nombre };
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

  private searchEntries(text: string, path: string, query: string, keyToFilter: string, field: any) {
    const channelOptions = new BehaviorSubject<any>({ field });
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

  private handleSearchResponse(response: any) {
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
  }

  private populateSelectMultipleField(element: any, value: any) {
    element.valor = [];
    if (value.length > 0) {
      value.forEach((e1: any) =>
        element.opciones.forEach((e2: any) => {
          if (e1.Id === e2.Id) {
            element.valor.push(e2);
          }
        })
      );
    }
  }
}
