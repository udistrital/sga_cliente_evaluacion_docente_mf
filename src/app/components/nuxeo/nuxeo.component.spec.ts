import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuxeoComponent } from './nuxeo.component';

describe('NuxeoComponent', () => {
  let component: NuxeoComponent;
  let fixture: ComponentFixture<NuxeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuxeoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuxeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
