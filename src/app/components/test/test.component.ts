import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateStorageService } from '../../services/date-storage.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  date: string | null = null;

  constructor(
    private http: HttpClient,
    private dateStorageService: DateStorageService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    const apiUrl = this.configService.getApiUrl(); // Obtén la URL completa del servicio

    this.http.get(apiUrl, { observe: 'response' })
      .subscribe(response => {
        // Recupera la fecha almacenada por el interceptor
        this.date = this.dateStorageService.getDate();
        console.log('Date in component:', this.date); // Verifica en la consola que la fecha se recupera
      }, error => {
        console.error('Error al realizar la solicitud HTTP:', error);
      });
  }
}
