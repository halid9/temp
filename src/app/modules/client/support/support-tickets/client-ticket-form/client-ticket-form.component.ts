import { Component, EventEmitter, Output } from '@angular/core';
import { CreateTicketDTO } from '../support-ticket.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-client-ticket-form',
  templateUrl: './client-ticket-form.component.html',
  styleUrls: ['./client-ticket-form.component.scss']
})
export class ClientTicketFormComponent {
  @Output() ticketSubmitted = new EventEmitter<CreateTicketDTO>();

  ticket: CreateTicketDTO = {
    _id: 0,
    customerEmail: '',
    agentId: '',
    agentName: '',
    channelId: 'General',
    status: 'Open',
    topic: '',
    description: '',
    customerId: 0
  }

  isSubmitted: boolean = false;

  constructor(public activeModal: NgbActiveModal,private auth: AuthenticationService) { }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.isValid()) return;
    this.ticket.customerId = this.auth._currentUser.id
    console.log(this.ticket)
    this.activeModal.close();
    this.ticketSubmitted.emit(this.ticket); // Emit the submitted ticket value
  }

  closeModal() {
    this.activeModal.close();
  }

  isValid() {
    if (!this.ticket.topic) return false;
    if (!this.ticket.description) return false;
    if (!this.ticket.channelId) return false;

    return true;
  }
}
