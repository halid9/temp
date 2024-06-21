import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT5OnlineUsersModalComponent } from './online-users-modal.component';

describe('MT5OnlineUsersModalComponent', () => {
  let component: MT5OnlineUsersModalComponent;
  let fixture: ComponentFixture<MT5OnlineUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT5OnlineUsersModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT5OnlineUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
