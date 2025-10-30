import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientosFormComponent } from './tratamientos-form.component';

describe('TratamientosFormComponent', () => {
  let component: TratamientosFormComponent;
  let fixture: ComponentFixture<TratamientosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TratamientosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TratamientosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
