import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoevaluacionIComponent } from './autoevaluacion-i.component';

describe('AutoevaluacionIComponent', () => {
  let component: AutoevaluacionIComponent;
  let fixture: ComponentFixture<AutoevaluacionIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoevaluacionIComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoevaluacionIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
