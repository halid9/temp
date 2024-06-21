import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AccountsService } from "src/app/core/services/accounts.service";
import { Dialogs } from "src/app/shared/dialogs";

@Component({
    selector: 'change-master-password-form',
    templateUrl: 'change-master-password-form.component.html',
    styleUrls: ['change-master-password-form.component.scss']
})
export class ChangeMasterPasswordComponent {
    @Input() accountId: number = 0
    submitted = false
    fieldTextType = false
    changePasswordForm: FormGroup
    constructor(private accountsService: AccountsService,
         private modal: NgbModal,
         private translate:TranslateService) {
        this.changePasswordForm = new FormGroup({
            masterPassword: new FormControl('', Validators.required)
        })
    }
    get f() { return this.changePasswordForm.controls }
    changeMasterPassword() {
        this.submitted = true
        if(!this.changePasswordForm.valid)return
        this.accountsService.changeMasterPassword(this.accountId, this.changePasswordForm.controls['masterPassword'].value).subscribe(

            {
                next: res => {
                    Dialogs.success('Your request has been sent',this.translate)
                    this.modal.dismissAll()
                },
                error: err => {
                    Dialogs.error(err,this.translate)
                }
            }  )
    }
    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }
    close(){
        this.modal.dismissAll()
    }
}