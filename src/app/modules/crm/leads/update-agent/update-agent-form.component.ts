import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "src/app/core/models/auth.models";
import { AllUsersService } from "src/app/core/services/all-users-list.service";

@Component({
    selector: 'update-agent-form',
    templateUrl: 'update-agent-form.component.html',
    styleUrls: ['update-agent-form.component.scss']
})
export class UpdateAgentComponent {
    @Input() leadId: number = 0
    submitted = false
    @Input() agent: number = 1
    newAgent: number | string = 1
    @Input() agents: User[]

    constructor(private usersService: AllUsersService,  private modal: NgbModal) {
    }

    changeAgent() {
        this.submitted = true
        if (this.agent == this.newAgent) return
        this.usersService.updateAgent(this.leadId, parseInt(this.newAgent as string)).subscribe({
            next: res => {
                this.modal.dismissAll()
            }
        })

    }

}