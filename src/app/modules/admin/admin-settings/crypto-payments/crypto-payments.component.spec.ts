import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsCryptoPaymentsComponent } from './crypto-payments.component';

describe('AdminSettingsCryptoPaymentsComponent', () => {
  let component: AdminSettingsCryptoPaymentsComponent;
  let fixture: ComponentFixture<AdminSettingsCryptoPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSettingsCryptoPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSettingsCryptoPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
