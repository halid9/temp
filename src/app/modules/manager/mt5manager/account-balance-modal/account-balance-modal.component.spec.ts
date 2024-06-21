import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT5AccountBalanceModalComponent } from './account-balance-modal.component';

describe('MT5AccountBalanceModalComponent', () => {
  let component: MT5AccountBalanceModalComponent;
  let fixture: ComponentFixture<MT5AccountBalanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT5AccountBalanceModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT5AccountBalanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
