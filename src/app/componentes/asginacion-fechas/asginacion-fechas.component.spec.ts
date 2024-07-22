import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsginacionFechasComponent } from './asginacion-fechas.component';

describe('AsginacionFechasComponent', () => {
  let component: AsginacionFechasComponent;
  let fixture: ComponentFixture<AsginacionFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsginacionFechasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsginacionFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
