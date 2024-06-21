import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AccountsService } from "src/app/core/services/accounts.service";
import { DataService } from "src/app/core/services/data.service";
import { Dialogs } from "src/app/shared/dialogs";
import Swal from "sweetalert2";

@Component({
    selector: 'change-name-form',
    templateUrl: 'change-name-form.component.html',
    styleUrls: ['change-name-form.component.scss']
})
export class ChangeNameComponent {
    @Input() accountId: number = 0
    @Input() external: boolean = false
    submitted = false
    accountName: string = ''
    changeNameForm: FormGroup
    constructor(private accountsService: AccountsService,
        private modal: NgbModal,
        private translate: TranslateService,
    ) {

        this.changeNameForm = new FormGroup({
            name: new FormControl('', Validators.required)
        })
    }

    ngOnInit() {
        //console.log(this.accountId, this.accountsService.accounts)

        
        const accountName =this.external? this.accountsService.externalAccounts.find(a => a.id == this.accountId).accountName : this.accountsService.accounts.find(a => a.id == this.accountId).accountName;

        this.accountName = accountName;
    }

    get f() { return this.changeNameForm.controls; }

    onSubmit() {
        this.submitted = true
        if (!this.changeNameForm.valid) return
        this.accountsService.changeName(this.accountId, this.accountName).subscribe({
            next: res => {
                Dialogs.success('Your request has been sent', this.translate)
                this.modal.dismissAll()
            },
            error: err => {
                Dialogs.error(err, this.translate)
            }
        })
    }
    close() {
        this.modal.dismissAll()
    }
}