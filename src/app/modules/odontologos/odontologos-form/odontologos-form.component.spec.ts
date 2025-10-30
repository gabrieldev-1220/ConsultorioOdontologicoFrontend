import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdontologosFormComponent } from './odontologos-form.component';

describe('OdontologosFormComponent', () => {
  let component: OdontologosFormComponent;
  let fixture: ComponentFixture<OdontologosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OdontologosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdontologosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
