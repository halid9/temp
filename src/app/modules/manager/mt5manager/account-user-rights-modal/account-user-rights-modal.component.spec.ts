import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT5AccountUserRightsModalComponent } from './account-user-rights-modal.component';

describe('MT5AccountUserRightsModalComponent', () => {
  let component: MT5AccountUserRightsModalComponent;
  let fixture: ComponentFixture<MT5AccountUserRightsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT5AccountUserRightsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT5AccountUserRightsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
