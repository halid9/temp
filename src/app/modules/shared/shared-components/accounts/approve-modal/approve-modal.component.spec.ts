import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveAccountRequestModalComponent } from './approve-modal.component';

describe('ApproveAccountRequestModalComponent', () => {
  let component: ApproveAccountRequestModalComponent;
  let fixture: ComponentFixture<ApproveAccountRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveAccountRequestModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveAccountRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
