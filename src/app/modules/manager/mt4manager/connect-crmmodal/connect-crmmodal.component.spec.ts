import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MT4ConnectCRMModalComponent } from './connect-crmmodal.component';

describe('MT4ConnectCRMModalComponent', () => {
  let component: MT4ConnectCRMModalComponent;
  let fixture: ComponentFixture<MT4ConnectCRMModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MT4ConnectCRMModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MT4ConnectCRMModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
