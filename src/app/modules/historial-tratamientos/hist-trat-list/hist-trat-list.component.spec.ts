import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistTratListComponent } from './hist-trat-list.component';

describe('HistTratListComponent', () => {
  let component: HistTratListComponent;
  let fixture: ComponentFixture<HistTratListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistTratListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistTratListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
