import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinicionFormulariosComponent } from './definicion-formularios.component';

describe('DefinicionFormulariosComponent', () => {
  let component: DefinicionFormulariosComponent;
  let fixture: ComponentFixture<DefinicionFormulariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinicionFormulariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefinicionFormulariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
