import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoevaluacionIiComponent } from './autoevaluacion-ii.component';

describe('AutoevaluacionIiComponent', () => {
  let component: AutoevaluacionIiComponent;
  let fixture: ComponentFixture<AutoevaluacionIiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoevaluacionIiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoevaluacionIiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
