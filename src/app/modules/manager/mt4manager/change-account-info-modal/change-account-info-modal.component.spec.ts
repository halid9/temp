import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT4AccountChangeInfoModalComponent } from './change-account-info-modal.component';

describe('MT4AccountChangeInfoModalComponent', () => {
  let component: MT4AccountChangeInfoModalComponent;
  let fixture: ComponentFixture<MT4AccountChangeInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT4AccountChangeInfoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT4AccountChangeInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
