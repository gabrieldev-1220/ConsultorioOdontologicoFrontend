import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistTratFormComponent } from './hist-trat-form.component';

describe('HistTratFormComponent', () => {
  let component: HistTratFormComponent;
  let fixture: ComponentFixture<HistTratFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistTratFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistTratFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
