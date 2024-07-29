import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoevaluacionIComponent } from './coevaluacion-i.component';

describe('CoevaluacionIComponent', () => {
  let component: CoevaluacionIComponent;
  let fixture: ComponentFixture<CoevaluacionIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoevaluacionIComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoevaluacionIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
