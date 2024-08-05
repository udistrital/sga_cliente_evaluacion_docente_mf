import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinirEscalasComponent } from './definir-escalas.component';

describe('DefinirEscalasComponent', () => {
  let component: DefinirEscalasComponent;
  let fixture: ComponentFixture<DefinirEscalasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinirEscalasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefinirEscalasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
