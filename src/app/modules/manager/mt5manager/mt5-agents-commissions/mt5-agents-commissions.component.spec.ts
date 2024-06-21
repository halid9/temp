import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mt5AgentsCommissionsComponent } from './mt5-agents-commissions.component';

describe('Mt5AgentsCommissionsComponent', () => {
  let component: Mt5AgentsCommissionsComponent;
  let fixture: ComponentFixture<Mt5AgentsCommissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mt5AgentsCommissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mt5AgentsCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
