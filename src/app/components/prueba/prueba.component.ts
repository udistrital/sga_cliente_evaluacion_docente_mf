import { Component, OnInit } from '@angular/core';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',  
  styleUrls: ['./prueba.component.scss']
})
export class PruebaComponent implements OnInit {
  dateHeader: string | null = null;

  constructor(private dateService: DateService) { }

  ngOnInit(): void {
    this.dateService.getDateHeader().subscribe(
      date => {
        this.dateHeader = date;
        console.log('DateHeader:', this.dateHeader);
      },
      error => console.error('Error:', error),
    );
  }
}
