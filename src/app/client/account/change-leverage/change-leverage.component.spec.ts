import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLeverageComponent } from './change-leverage.component';

describe('ChangeLeverageComponent', () => {
  let component: ChangeLeverageComponent;
  let fixture: ComponentFixture<ChangeLeverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeLeverageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeLeverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
