import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTicketFormComponent } from './client-ticket-form.component';

describe('ClientTicketFormComponent', () => {
  let component: ClientTicketFormComponent;
  let fixture: ComponentFixture<ClientTicketFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientTicketFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientTicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
