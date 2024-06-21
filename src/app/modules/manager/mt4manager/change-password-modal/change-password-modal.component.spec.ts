import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT4AccountChangePasswordModalComponent } from './change-password-modal.component';

describe('MT4AccountChangePasswordModalComponent', () => {
  let component: MT4AccountChangePasswordModalComponent;
  let fixture: ComponentFixture<MT4AccountChangePasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT4AccountChangePasswordModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT4AccountChangePasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
