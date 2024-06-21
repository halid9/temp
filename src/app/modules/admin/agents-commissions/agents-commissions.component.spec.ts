import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsCommissionsComponent } from './agents-commissions.component';

describe('AgentsCommissionsComponent', () => {
  let component: AgentsCommissionsComponent;
  let fixture: ComponentFixture<AgentsCommissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentsCommissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
