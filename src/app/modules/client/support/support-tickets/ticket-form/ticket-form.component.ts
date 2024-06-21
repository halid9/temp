import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CreateTicketDTO, SupportTicketModel } from "../support-ticket.model";
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'ticket-form',
    templateUrl: 'ticket-form.component.html',
    styleUrls: ['ticket-form.component.scss']
})
export class TicketForm {
    ticketSubmitted: EventEmitter<CreateTicketDTO> = new EventEmitter<CreateTicketDTO>();
    @Input() isDialog: boolean = true
    @Input() title:string = 'New ticket'
    @Input() ticket: CreateTicketDTO = {
        _id: 0,
        customerEmail: '',
        agentId:'',
        agentName: '',
        channelId: '',
        status: 'Open',
        topic:'',
        description:''
    }
    ticketForm: FormGroup
    @Input() statuses:any = ['Open', 'Closed']


    constructor(private modalRef:NgbModal) {
        this.ticketForm = new FormGroup({
            customerEmail: new FormControl(this.ticket.customerEmail, Validators.required),
            agentId: new FormControl(this.ticket.agentId),
            agentName: new FormControl(this.ticket.agentName),
            channelId: new FormControl(this.ticket.channelId),
            topic: new FormControl(this.ticket.topic, Validators.required),
            description: new FormControl(this.ticket.description),

        })

    }
    ngOnInit() {

    }
    get f() { return this.ticketForm.controls }

    checkFormValidity(){
        console.log("ticketForm", this.ticketForm);
    }
    onSubmit() {
        
        const ticket: CreateTicketDTO = { ...this.ticketForm.value }
        console.log(ticket)
        this.modalRef.dismissAll()
        this.ticketSubmitted.emit(ticket); // Emit the submitted ticket value

    }
    closeDialog(){
        this.modalRef.dismissAll()

    }
}