import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientosListComponent } from './tratamientos-list.component';

describe('TratamientosListComponent', () => {
  let component: TratamientosListComponent;
  let fixture: ComponentFixture<TratamientosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TratamientosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TratamientosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
