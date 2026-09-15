import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteKnowageComponent } from './reporte-knowage.component';

describe('ReporteKnowageComponent', () => {
  let component: ReporteKnowageComponent;
  let fixture: ComponentFixture<ReporteKnowageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteKnowageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteKnowageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
