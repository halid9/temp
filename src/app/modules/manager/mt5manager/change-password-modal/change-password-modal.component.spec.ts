import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT5AccountChangePasswordModalComponent } from './change-password-modal.component';

describe('MT5AccountChangePasswordModalComponent', () => {
  let component: MT5AccountChangePasswordModalComponent;
  let fixture: ComponentFixture<MT5AccountChangePasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT5AccountChangePasswordModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT5AccountChangePasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
