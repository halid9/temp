import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT4AccountBalanceModalComponent } from './account-balance-modal.component';

describe('MT4AccountBalanceModalComponent', () => {
  let component: MT4AccountBalanceModalComponent;
  let fixture: ComponentFixture<MT4AccountBalanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT4AccountBalanceModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT4AccountBalanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
