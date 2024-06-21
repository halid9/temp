import { Component, Input } from "@angular/core";
import { CustomerListModel } from "../../../../core/models/customers.model";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EmailSmsFormComponent } from "src/app/modules/shared/shared-components/email-sms-form/email-sms-form.component";
import { FileManagerService } from "src/app/core/services/file-manager.service";

@Component({
    selector: 'customer-card',
    templateUrl: 'customer-card.component.html',
    styleUrls: ['customer-card.component.scss']
})
export class CustomerCardComponent {
    @Input() customer?: CustomerListModel

    constructor(private fileService: FileManagerService, private modal: NgbModal) {

    }
    sendMsg(type: string) {
        const modal = this.modal.open(EmailSmsFormComponent, { centered: true, size: "lg" })
        modal.componentInstance.type = type
        modal.componentInstance.destinations = [this.customer[type == 'sms'?'phone':type]]
        
    }
}