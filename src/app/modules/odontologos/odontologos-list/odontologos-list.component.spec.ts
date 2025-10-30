import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdontologosListComponent } from './odontologos-list.component';

describe('OdontologosListComponent', () => {
  let component: OdontologosListComponent;
  let fixture: ComponentFixture<OdontologosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OdontologosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdontologosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
