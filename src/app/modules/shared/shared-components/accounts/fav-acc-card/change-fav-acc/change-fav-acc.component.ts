import { Component } from "@angular/core";
import { NgbActiveModal, NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { User } from "src/app/core/models/auth.models";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Dialogs } from "src/app/shared/dialogs";
import { Platform } from "src/app/shared/helper";

@Component({
    selector: "change-fav-acc",
    templateUrl: "change-fav-acc.component.html"
})
export class ChangeFavAccComponent {
    user: User = null
    accounts = null
    account = null
    saving = false
    constructor(private auth: AuthenticationService, private modal: NgbModalConfig, private activeModal: NgbActiveModal, private translate: TranslateService) {

    }
    ngOnInit() {
        this.user = this.auth._currentUser
        this.accounts = this.user.accounts.slice().filter(a => a.platform != Platform.Wallet)
        this.account = this.user.favAccountId
    }

    select(account) {
        this.account = account
    }

    save() {
        this.saving = true
        this.modal.keyboard = true
        this.auth.updateUser({ favAccountId: this.account }).subscribe({
            next: res => {
                this.saving = false
                this.modal.keyboard = false

                this.activeModal.close({ success: true ,id:this.account})

            },
            error: err => {
                this.saving = false
                this.modal.keyboard = false

                Dialogs.error(err, this.translate)
            }
        })
    }

    closeModal() {
        this.activeModal.dismiss()
    }

}