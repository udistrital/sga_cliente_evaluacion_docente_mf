import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  OnChanges, SimpleChanges
} from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-pdf-viewer",
  templateUrl: "./pdf-viewer.component.html",
  styleUrls: ["./pdf-viewer.component.scss"],
})
export class PdfViewerComponent implements OnInit {
  @ViewChild("pdfCanvas", { static: true })
  pdfCanvas!: ElementRef<HTMLCanvasElement>;

  pdfLoaded = false;
  pdfSrc: Uint8Array | undefined;

  @Input() base64Document: string = "";
  
  ngOnInit() {
    this.cargarPdfDeBase64(this.base64Document); 

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['base64Document'] && this.base64Document) {
      this.cargarPdfDeBase64(this.base64Document);  
    }
  }

  cargarPdfDeBase64(base64: string) {
    try {
      const arrayBuffer = this.base64ToArrayBuffer(base64);
      this.pdfSrc = new Uint8Array(arrayBuffer);
      this.pdfLoaded = true;
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64); 
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer; 
  }
}