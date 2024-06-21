import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mt4AgentsCommissionsComponent } from './mt4-agents-commissions.component';

describe('Mt4AgentsCommissionsComponent', () => {
  let component: Mt4AgentsCommissionsComponent;
  let fixture: ComponentFixture<Mt4AgentsCommissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mt4AgentsCommissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mt4AgentsCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
