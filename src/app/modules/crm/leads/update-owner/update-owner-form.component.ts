import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LeadsService } from "../leads.service";
import { LeadActions } from "src/app/shared/helper";
import { User } from "src/app/core/models/auth.models";

@Component({
    selector: 'update-owner-form',
    templateUrl: 'update-owner-form.component.html',
    styleUrls: ['update-owner-form.component.scss']
})
export class UpdateOwnerComponent {
    @Input() leadId: number = 0
    submitted = false
    @Input() owner: number = 1
    newOwner: number | string = 1
    @Input() owners:User[] 

    constructor(private leadSrv: LeadsService, private modal: NgbModal) {
    }

    changeOwner() {
        this.submitted = true
        if (this.owner == this.newOwner) return
        this.leadSrv.updateLead({ leadOwner: parseInt(this.newOwner as string), action: LeadActions.UPDATE_SUPERVISOR }, this.leadId).subscribe(
            res => {
                this.modal.dismissAll()
            }
        )
    }

}