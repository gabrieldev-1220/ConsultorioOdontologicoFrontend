import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialFormComponent } from './historial-form.component';

describe('HistorialFormComponent', () => {
  let component: HistorialFormComponent;
  let fixture: ComponentFixture<HistorialFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
