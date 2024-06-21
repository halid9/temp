import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusCampaignsComponent } from './bonus-campaigns.component';

describe('BonusCampaignsComponent', () => {
  let component: BonusCampaignsComponent;
  let fixture: ComponentFixture<BonusCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusCampaignsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
