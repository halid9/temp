import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT4AccountUserRightsModalComponent } from './account-user-rights-modal.component';

describe('MT4AccountUserRightsModalComponent', () => {
  let component: MT4AccountUserRightsModalComponent;
  let fixture: ComponentFixture<MT4AccountUserRightsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT4AccountUserRightsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT4AccountUserRightsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
