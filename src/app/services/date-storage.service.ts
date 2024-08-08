import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateStorageService {
  private date: string | null = null;

  setDate(date: string): void {
    this.date = date;
    console.log(date);
  }

  getDate(): string | null {
    return this.date;
  }
}