import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT5ConnectCRMModalComponent } from './connect-crmmodal.component';

describe('MT5ConnectCRMModalComponent', () => {
  let component: MT5ConnectCRMModalComponent;
  let fixture: ComponentFixture<MT5ConnectCRMModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT5ConnectCRMModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT5ConnectCRMModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
