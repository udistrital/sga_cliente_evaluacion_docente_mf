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
  init = true;
   // Preguntas del ámbito 01
  questions01 = [
    "01. Demuestra conocimiento de los contenidos que se van a enseñar en mi espacio curricular",
    "02. Demuestra habilidades para conducir procesos de enseñanza-aprendizaje según los contenidos de mi espacio curricular",
    "03. Demuestra comprensión de ritmos de aprendizaje diferenciados y adapta el aula de clase a estas necesidades",
    "04. Demuestra habilidades para organizar y explicar ideas",
    "05. Demuestra habilidades para observar su aula, diagnosticar necesidades y adaptarse al contexto"
  ];

  // Preguntas del ámbito 02
  questions02 = [
    "06. Me da a conocer lo que debo saber, comprender y ser capaz de hacer en mi espacio curricular",
    "07. Me enseña lo que debo saber, comprender y ser capaz de hacer en mi espacio curricular",
    "08. Integra en la enseñanza las competencias, la didáctica y la evaluación",
    "09. Logra que sepa actuar de manera competente en contextos particulares señalados por el contenido de mi espacio curricular",
    "10. Me enseña a relacionar las competencias y los resultados de aprendizaje de mi espacio curricular"
  ];

  // Preguntas del ámbito 03
  questions03 = [
    "11. Desarrolla las unidades de aprendizaje de mi espacio curricular",
    "12. Evalúa mis evidencias de aprendizaje y me proporciona devoluciones claras para mi mejoramiento",
    "13. Demuestra compromiso general con el ambiente de aprendizaje de mi salón",
    "14. Demuestra respeto por diversidades y diferencias sexo-genéricas, cognitivas, lingüísticas, raciales y culturales dentro y fuera de mi salón",
    "15. Me motiva para el alcance de competencias y resultados de aprendizaje",
    "16. Promueve el desarrollo de autoconceptos positivos para el estudiantado",
    "17. Realiza actividades apropiadas para la consecución de los resultados de aprendizaje y el desarrollo de competencias",
    "18. Recibe y maneja positivamente preguntas, ideas y opiniones que mantienen al estudiantado pendiente e involucrado en clase",
    "19. Se adapta a niveles y ritmos de aprendizaje diferenciados tanto míos como de mis compañer@s de clase",
    "20. Es evidente que prepara sus clases y actividades para estimular mi logro de resultados de aprendizaje y competencias"
  ];

  // Preguntas de la autoevaluación del aprendizaje
  questionsAutoevaluacion = [
    {
      text: "01. Asumo las actividades que me plantea este espacio curricular en cada unidad de aprendizaje",
      options: [
        { value: "Evito hacer las actividades", text: "Evito hacer las actividades" },
        { value: "A veces me animan las actividades", text: "A veces me animan las actividades" },
        { value: "Con frecuencia hago las actividades del espacio curricular", text: "Con frecuencia hago las actividades del espacio curricular" },
        { value: "Me encanta las actividades si he tenido éxito en actividades similares", text: "Me encanta las actividades si he tenido éxito en actividades similares" },
        { value: "Espero con positivismo el próximo reto", text: "Espero con positivismo el próximo reto" }
      ]
    },
    {
      text: "02. Siento que puedo lograr los resultados de aprendizaje esperados",
      options: [
        { value: "Nunca", text: "Nunca" },
        { value: "A veces", text: "A veces" },
        { value: "Con alguna frecuencia", text: "Con alguna frecuencia" },
        { value: "La mayor parte del tiempo", text: "La mayor parte del tiempo" },
        { value: "Siempre", text: "Siempre" }
      ]
    },
    {
      text: "03. Acepto los resultados de la evaluación que realiza mi docente",
      options: [
        { value: "Me siento mal con los resultados negativos", text: "Me siento mal con los resultados negativos" },
        { value: "Me siento bien solo si me interesa el espacio curricular", text: "Me siento bien solo si me interesa el espacio curricular" },
        { value: "Con frecuencia miro las devoluciones de mi docente positivamente", text: "Con frecuencia miro las devoluciones de mi docente positivamente" },
        { value: "La mayor parte del tiempo miro las devoluciones de mi docente positivamente", text: "La mayor parte del tiempo miro las devoluciones de mi docente positivamente" },
        { value: "Siempre miro las devoluciones de mi docente positivamente", text: "Siempre miro las devoluciones de mi docente positivamente" }
      ]
    },
    {
      text: "04. Estrategias de autoaprendizaje (I)",
      options: [
        { value: "No movilizo recursos personales para mi aprendizaje en este espacio curricular", text: "No movilizo recursos personales para mi aprendizaje en este espacio curricular" },
        { value: "A veces movilizo recursos personales para mi aprendizaje en este espacio curricular", text: "A veces movilizo recursos personales para mi aprendizaje en este espacio curricular" },
        { value: "Con frecuencia movilizo recursos personales para mi aprendizaje en este espacio curricular", text: "Con frecuencia movilizo recursos personales para mi aprendizaje en este espacio curricular" },
        { value: "La mayor parte de las veces movilizo recursos personales para mi aprendizaje en este espacio curricular", text: "La mayor parte de las veces movilizo recursos personales para mi aprendizaje en este espacio curricular" },
        { value: "Siempre movilizo recursos personales para mi aprendizaje en este espacio curricular", text: "Siempre movilizo recursos personales para mi aprendizaje en este espacio curricular" }
      ]
    },
    {
      text: "05. Estrategias de autoaprendizaje (II)",
      options: [
        { value: "No me animo a usar redes para mi aprendizaje en este espacio curricular", text: "No me animo a usar redes para mi aprendizaje en este espacio curricular" },
        { value: "A veces me animo a usar redes para mi aprendizaje en este espacio curricular", text: "A veces me animo a usar redes para mi aprendizaje en este espacio curricular" },
        { value: "Con frecuencia me animo a usar redes para mi aprendizaje en este espacio curricular", text: "Con frecuencia me animo a usar redes para mi aprendizaje en este espacio curricular" },
        { value: "La mayor parte de las veces me animo a usar redes para mi aprendizaje en este espacio curricular", text: "La mayor parte de las veces me animo a usar redes para mi aprendizaje en este espacio curricular" },
        { value: "Siempre me animo a usar redes para mi aprendizaje en este espacio curricular", text: "Siempre me animo a usar redes para mi aprendizaje en este espacio curricular" }
      ]
    }
  ];

  // Comentarios para acciones a tomar
  commentsAutoevaluacion = [
    "1. ",
    "2. ",
    "3. "
  ];


  get allQuestions() {
    return [...this.questions01, ...this.questions02, ...this.questions03];
  }

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {
    this.initializeForm();
    this.initializeData();
  }
  
  ngOnInit() {
    if (!this.normalform.tipo_formulario) {
      this.normalform.tipo_formulario = 'mini';
      this.normalform.tipo_formulario = 'autoevaluacion-i';
    }
    this.initializeFormFields();
  }

  ngOnChanges(changes: any) {
    if (changes.normalform && changes.normalform.currentValue) {
      this.normalform = changes.normalform.currentValue;
      this.initializeFormFields();
    }
  }

  private initializeForm() {
    const formGroup: { [key: string]: any } = {};
    this.questionsAutoevaluacion.forEach((_, index) => {
      formGroup['question_' + index] = new FormControl('');
    });
    this.commentsAutoevaluacion.forEach((_, index) => {
      formGroup['comment_' + index] = new FormControl('');
    });
    this.form = this.fb.group(formGroup);
  }

  private initializeData() {
    this.data = {
      valid: true,
      data: {},
      percentage: 0,
      files: [],
    };
  }

  /*private setupSearchSubscription() {
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
  }*/

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
    if (this.normalform && Array.isArray(this.normalform.campos)) {
      const formGroup: { [key: string]: any } = {};
      this.normalform.campos.forEach((c: any) => {
        formGroup[c.nombre] = [c.valor || ''];
      });
      this.form = this.fb.group(formGroup);
    }
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
    this.form.reset();
  }
  
  /*private resetField(d: any) {
    if (d.etiqueta === 'file' || d.etiqueta === 'fileRev') {
      this.resetFileField(d);
    }
    if (d.etiqueta === 'autocomplete') {
      this.resetAutocompleteField();
    }
    d.alerta = '';
    d.clase = 'form-control form-control-success';
  }*/

  /*private resetFileField(d: any) {
    const nativeElement = this.DocumentoInputVariable?.nativeElement || null;
    if (nativeElement) nativeElement.value = '';
    d.File = undefined;
    d.url = '';
    d.urlTemp = '';
  }*/

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
    if (this.form.valid) {
      console.log("Formulario válido:", this.form.value);
      this.result.emit(this.form.value);
    } else {
      console.log("Formulario no válido");
    }
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
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
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

  /*handleKeyUp(event: KeyboardEvent, c: any) {
    const target = event.target as HTMLInputElement;
    this.searchTerm$.next({
      text: target.value,
      path: c.path,
      query: c.query,
      field: c,
      keyToFilter: c.keyToFilter,
    });
  }*/

  /*private searchEntries(text: string, path: string, query: string, keyToFilter: string, field: any) {
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
  }*/

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
