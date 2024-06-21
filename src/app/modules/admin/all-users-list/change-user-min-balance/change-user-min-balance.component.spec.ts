import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAgentSettingsComponent } from './change-user-min-balance.component';

describe('ChangeAgentSettingsComponent', () => {
  let component: ChangeAgentSettingsComponent;
  let fixture: ComponentFixture<ChangeAgentSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAgentSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeAgentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
