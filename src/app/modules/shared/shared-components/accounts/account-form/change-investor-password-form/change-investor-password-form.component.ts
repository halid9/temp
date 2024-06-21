import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AccountsService } from "src/app/core/services/accounts.service";
import { Dialogs } from "src/app/shared/dialogs";

@Component({
    selector: 'change-investor-password-form',
    templateUrl: 'change-investor-password-form.component.html',
    styleUrls: ['change-investor-password-form.component.scss']
})
export class ChangeInvestorPasswordComponent {
    @Input() accountId: number = 0
    submitted = false
    fieldTextType = false
    changePasswordForm: FormGroup
    constructor(private accountsService: AccountsService,
         private modal: NgbModal,
         private translate:TranslateService) {
        this.changePasswordForm = new FormGroup({
            investorPassword: new FormControl('', Validators.required)
        })
    }
    get f() { return this.changePasswordForm.controls }
    changeInvestorPassword() {
        this.submitted = true
        if (!this.changePasswordForm.valid) return
            this.accountsService.changeInvestorPassword(this.accountId, this.changePasswordForm.controls['investorPassword'].value).subscribe(
                {
                    next: res => {
                        Dialogs.success('Your request has been sent',this.translate)
                        this.modal.dismissAll()
                    },
                    error: err => {
                        Dialogs.error(err,this.translate)
                    }
                }
            )
    }
    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }
    close(){
        this.modal.dismissAll()
    }
    
}
