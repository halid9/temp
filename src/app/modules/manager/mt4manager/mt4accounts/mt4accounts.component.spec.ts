import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mt4ManagerAccountsComponent } from './mt4accounts.component';

describe('Mt4ManagerAccountsComponent', () => {
  let component: Mt4ManagerAccountsComponent;
  let fixture: ComponentFixture<Mt4ManagerAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mt4ManagerAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mt4ManagerAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
