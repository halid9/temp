import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LeadsService } from "../leads.service";
import { Lead } from "src/app/core/models/lead.model";
import { LeadActions } from "src/app/shared/helper";
import { User } from "src/app/core/models/auth.models";

@Component({
    selector: 'update-supervisor-form',
    templateUrl: 'update-supervisor-form.component.html',
    styleUrls: ['update-supervisor-form.component.scss']
})
export class UpdateSupervisorComponent {
    @Input() leadId: number = 0
    submitted = false
    @Input() supervisor: number = 1
    newSupervisor: number | string = 1
    @Input() supervisors:User[] 

    constructor(private leadSrv: LeadsService, private modal: NgbModal) {
    }

    changeSupervisor() {
        this.submitted = true
        if (this.supervisor == this.newSupervisor) return
        this.leadSrv.updateLead({ supervisorId: parseInt(this.newSupervisor as string), action: LeadActions.UPDATE_SUPERVISOR }, this.leadId).subscribe(
            res => {
                this.modal.dismissAll()
            }
        )
    }

}