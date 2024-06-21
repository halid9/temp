import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT4OnlineUsersModalComponent } from './online-users-modal.component';

describe('MT4OnlineUsersModalComponent', () => {
  let component: MT4OnlineUsersModalComponent;
  let fixture: ComponentFixture<MT4OnlineUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT4OnlineUsersModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT4OnlineUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
