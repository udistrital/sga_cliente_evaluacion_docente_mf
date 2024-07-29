import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoevaluacionIiComponent } from './coevaluacion-ii.component';

describe('CoevaluacionIiComponent', () => {
  let component: CoevaluacionIiComponent;
  let fixture: ComponentFixture<CoevaluacionIiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoevaluacionIiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoevaluacionIiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
