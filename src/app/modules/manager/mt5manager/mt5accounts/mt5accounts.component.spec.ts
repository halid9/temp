import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mt5ManagerAccountsComponent } from './mt5accounts.component';

describe('Mt5ManagerAccountsComponent', () => {
  let component: Mt5ManagerAccountsComponent;
  let fixture: ComponentFixture<Mt5ManagerAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mt5ManagerAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mt5ManagerAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
