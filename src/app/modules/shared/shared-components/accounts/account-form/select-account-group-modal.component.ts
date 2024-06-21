import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountGroup } from "src/app/core/models/account-group.model";

@Component({
    selector: 'select-account-group',
    template: `
    <div class="modal-body">
        <div class="row">
            <div class="col-12 col-lg-4 cursor-pointer mb-3" *ngFor="let g of accountGroups" (click)="selectGroup(g)">   
            <account-group-card  [accountGroup]="g"></account-group-card>
        </div>
    </div>
    </div>
    `
})
export class SelectAccountGroupModalComponent {
    @Input() accountGroups: AccountGroup[]
    constructor(
        private activeModal: NgbActiveModal
    ) {

    }


    selectGroup(group: AccountGroup) {
        this.activeModal.close(group)
    }
}