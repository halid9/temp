import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AccountGroup } from "src/app/core/models/account-group.model";
import { AccountGroupService } from "src/app/core/services/account-group.service";
import { Dialogs } from "src/app/shared/dialogs";

@Component({
    selector: "edit-account-group",
    templateUrl: "edit-account-group.component.html"
})
export class EditAccountGroupComponent {
    @Input() accountGroup: AccountGroup
    saving = false
    constructor(
        private activeModal: NgbActiveModal,
        private accountGroupService: AccountGroupService,
        private translate: TranslateService
    ) {

    }

    newLeverage = null
    save() {
        if(!this.accountGroup.leverages.length) return Dialogs.error("You must add at least 1 leverage!",this.translate)
        this.saving = true
        this.accountGroupService.addGroup(this.accountGroup).subscribe({
            next: res => {
                if (res)
                    this.activeModal.close()
                Dialogs.success('Account group updated!', this.translate)
            },

            error: err => {
                this.saving = false
                Dialogs.error(err, this.translate)

            }
        })
    }
    closeDialog() {
        this.activeModal.dismiss()
    }

    addLeverage() {
        if (!this.newLeverage) return Dialogs.error("You must add leverage first!", this.translate)
        if (this.newLeverage <= 0) return Dialogs.error("Leverage must be bigger than 0!", this.translate)
        if (this.accountGroup.leverages.includes(this.newLeverage)) return Dialogs.error("Leverage already added!", this.translate)
        this.accountGroup.leverages.push(this.newLeverage)
        this.newLeverage = null
    }
    removeLeverage(leverage: number) {
        this.accountGroup.leverages = this.accountGroup.leverages.filter(l => l != leverage)
    }


    newDetail = null
    addDetail() {
        this.accountGroup.details.push(this.newDetail)
        this.newDetail = null
    }
    removeDetail(detail: string) {
        this.accountGroup.details = this.accountGroup.details.filter(l => l != detail)
    }



}