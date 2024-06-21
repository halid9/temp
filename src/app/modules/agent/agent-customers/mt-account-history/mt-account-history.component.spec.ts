import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMtAccountHistoryComponent } from './mt-account-history.component';

describe('CustomerMtAccountHistoryComponent', () => {
  let component: CustomerMtAccountHistoryComponent;
  let fixture: ComponentFixture<CustomerMtAccountHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerMtAccountHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMtAccountHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
