import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusCampaginFormModalComponent } from './form-modal.component';

describe('BonusCampaginFormModalComponent', () => {
  let component: BonusCampaginFormModalComponent;
  let fixture: ComponentFixture<BonusCampaginFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusCampaginFormModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusCampaginFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
