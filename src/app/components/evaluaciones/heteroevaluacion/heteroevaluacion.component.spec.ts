import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeteroevaluacionComponent } from './heteroevaluacion.component';

describe('HeteroevaluacionComponent', () => {
  let component: HeteroevaluacionComponent;
  let fixture: ComponentFixture<HeteroevaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeteroevaluacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeteroevaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
