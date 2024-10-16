import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinicionPlantillasComponent } from './definicion-plantillas.component';

describe('DefinicionPlantillasComponent', () => {
  let component: DefinicionPlantillasComponent;
  let fixture: ComponentFixture<DefinicionPlantillasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinicionPlantillasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefinicionPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
