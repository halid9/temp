import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsAccountSelectOptionComponent } from './account-select-option.component';

describe('TransactionsAccountSelectOptionComponent', () => {
  let component: TransactionsAccountSelectOptionComponent;
  let fixture: ComponentFixture<TransactionsAccountSelectOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsAccountSelectOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsAccountSelectOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
