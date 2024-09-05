import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import {
  HETEROEVALUACION,
  AUTOEVALUACION_I,
  AUTOEVALUACION_II,
  COEVALUACION_I,
  COEVALUACION_II,
  EVALUACION_OPTIONS,
} from "src/app/models/formularios-data";

// Definir las interfaces
interface Pregunta {
  text: string;
  tipo: string;
  options: { valor: string; texto: string }[];
}

interface Ambito {
  nombre: string;
  titulo: string;
  preguntas: Pregunta[];
}


@Component({
  selector: "ngx-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.scss"],
})
export class DynamicFormComponent implements OnInit {
  stepperForm!: FormGroup; // Inicializa el FormGroup correctamente
  formularios = [
    HETEROEVALUACION,
    AUTOEVALUACION_I,
    AUTOEVALUACION_II,
    COEVALUACION_I,
  ]; // Lista de formularios disponibles
  selectedForm: any; // Variable para almacenar el formulario seleccionado
  ambitos: Ambito[] = []; // Tipar los ámbitos correctamente
  comentarioCounter = 1; // Contador para numerar los comentarios de forma continua

  @ViewChild("mainStepper") mainStepper!: MatStepper;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Inicializar el formulario principal
    this.stepperForm = this.fb.group({});

    // Seleccionar el formulario por defecto para la vista inicial
    this.selectForm("heteroevaluacion"); // Se puede cambiar según las necesidades
  }

  // Método para inicializar el formulario seleccionado
  selectForm(tipo_formulario: string) {
    // Reiniciar el formulario completamente
    this.stepperForm = this.fb.group({}); // Crear un nuevo grupo de formularios vacío

    // Buscar el formulario seleccionado
    this.selectedForm = this.formularios.find(
      (f) => f.tipo_formulario === tipo_formulario
    );

    // Si se encontró el formulario, cargar sus ámbitos
    if (this.selectedForm) {
      this.ambitos = this.selectedForm.ambitos;
      this.initializeForm(); // Crear los controles del formulario dinámico
    }
    console.log(this.ambitos); // Verifica que los ámbitos se cargan correctamente
  }

  // Inicializa el formulario dinámico creando los controles para cada pregunta
  initializeForm() {
    this.ambitos.forEach((ambito: Ambito, index: number) => {
      const group = this.fb.group({}); // Grupo para las preguntas de cada ámbito

      // Crear controles para cada pregu  nta
      ambito.preguntas.forEach((pregunta: Pregunta) => {
        const controlName = this.generateControlName(pregunta.text);

        // Si el formulario es Heteroevaluación o Autoevaluación I, cambiar 'select' a 'radio'
        if (
          (this.selectedForm.tipo_formulario === "heteroevaluacion" ||
            this.selectedForm.tipo_formulario === "autoevaluacion-i") &&
          pregunta.tipo === "select"
        ) {
          pregunta.tipo = "radio"; // Cambiamos el tipo a radio
        }

        // Agregar control para preguntas de tipo radio con validación requerida
        if (pregunta.tipo === "radio") {
          group.addControl(
            `pregunta_${controlName}`,
            this.fb.control("", Validators.required)
          );
        } else {
          group.addControl(`pregunta_${controlName}`, this.fb.control(""));
        }
      });

      // Añadir el grupo de preguntas al formulario
      this.stepperForm.addControl(`ambito_${index}`, group);
    });
  }

  // Agregamos la función calculateComentarioIndex
  calculateComentarioIndex(
    ambitoIndex: number,
    comentarioIndex: number
  ): number {
    // Asegúrate de que los índices se calculen de manera que no se repitan
    return ambitoIndex * 10 + comentarioIndex; // Ajuste este valor si es necesario
  }

  // Método para obtener un control
  getFormControl(ambitoIndex: number, controlName: string): AbstractControl {
    const ambitoControl = this.stepperForm.get("ambito_" + ambitoIndex);
    if (ambitoControl) {
      const control = ambitoControl.get(controlName);
      if (control) {
        return control;
      } else {
        console.error(`Control not found for ${controlName}`);
        return new FormControl();
      }
    }
    return new FormControl();
  }

  // Método para manejar la selección de una opción
  onSelectOption(
    preguntaIndex: number,
    ambitoIndex: number,
    innerStepper: MatStepper
  ) {
    const control = this.getFormControl(
      ambitoIndex,
      `pregunta_${this.ambitos[ambitoIndex].preguntas[preguntaIndex].text}`
    );

    // Si la respuesta es válida (se ha seleccionado una opción)
    if (control.valid) {
      // Avanzar automáticamente a la siguiente pregunta si existe
      if (preguntaIndex < this.ambitos[ambitoIndex].preguntas.length - 1) {
        innerStepper.next(); // Avanzar a la siguiente pregunta
      } else {
        // Si es la última pregunta, se queda en el mismo ámbito hasta que el usuario decida avanzar
        console.log(
          "Última pregunta del ámbito, el usuario debe avanzar manualmente al siguiente ámbito"
        );
      }
    }
  }

  // Método para manejar el evento de submit
  submit() {
    if (this.stepperForm.valid) {
      console.log("Formulario enviado:", this.stepperForm.value);
      // Aquí puedes añadir la lógica para enviar los datos, como hacer una petición HTTP
    } else {
      console.log("Formulario no válido");
    }
  }

  // Función para transformar un texto en una clave válida (remueve espacios y caracteres especiales)
  generateControlName(text: string): string {
    return text.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase(); // Reemplaza caracteres especiales y convierte a minúsculas
  }

  getDropdownOptions(campo: string): string[] {
    if (campo === "Espacio Curricular") {
      return ["Curricular A", "Curricular B"];
    } else if (campo === "Código del Espacio Curricular") {
      return ["Cód. 101", "Cód. 202"];
    } else if (campo === "Grupo") {
      return ["Grupo 1", "Grupo 2"];
    }
    return [];
  }

  onNext(innerStepper: MatStepper, ambitoIndex: number, preguntaIndex: number) {
    const control = this.getFormControl(
      ambitoIndex,
      "pregunta_" +
        this.generateControlName(
          this.ambitos[ambitoIndex].preguntas[preguntaIndex].text
        )
    );

    if (control.valid) {
      // Si es la última pregunta del ámbito actual, avanza al siguiente ámbito
      if (preguntaIndex < this.ambitos[ambitoIndex].preguntas.length - 1) {
        innerStepper.next(); // Avanzar a la siguiente pregunta
      } else {
        this.mainStepper.next(); // Si es la última pregunta, avanzar al siguiente ámbito
      }
    }
  }
}
