import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT5AccountChangeInfoModalComponent } from './change-account-info-modal.component';

describe('MT5AccountChangeInfoModalComponent', () => {
  let component: MT5AccountChangeInfoModalComponent;
  let fixture: ComponentFixture<MT5AccountChangeInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT5AccountChangeInfoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT5AccountChangeInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
