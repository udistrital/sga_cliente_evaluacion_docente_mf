import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionFechasComponent } from './asignacion-fechas.component';

describe('AsginacionFechasComponent', () => {
  let component: AsignacionFechasComponent;
  let fixture: ComponentFixture<AsignacionFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionFechasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignacionFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
