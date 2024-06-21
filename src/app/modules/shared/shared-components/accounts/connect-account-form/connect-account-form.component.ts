import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AccountsService } from "src/app/core/services/accounts.service";
import { Platform } from "src/app/shared/helper";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Dialogs } from "src/app/shared/dialogs";
import { DataService } from "src/app/core/services/data.service";
import { TranslateService } from "@ngx-translate/core";





@Component({
    selector: 'connect-account-form',
    templateUrl: 'connect-account-form.component.html',
    styleUrls: ['connect-account-form.component.scss']
})
export class ConnectAccountFormComponent {

    submitted = false
    //todo: define type
    platforms = [{ name: 'MT4', value: Platform.MT4 }, { name: 'MT5', value: Platform.MT5 },/* { name: 'Wallet', value: Platform.Wallet }*/]
    @Input() forUser: any

    accountForm: FormGroup
    constructor(private route: ActivatedRoute,
        private router: Router,
        private accountsService: AccountsService,
        private modalRef: NgbModal,
        private auth: AuthenticationService,
        private dataService: DataService,
        private translate:TranslateService
    ) {
        this.accountForm = new FormGroup({
            login: new FormControl('', Validators.required),
            platform: new FormControl('', Validators.required),
            masterPassword: new FormControl('', Validators.required),
            // investorPassword: new FormControl('', Validators.required),
        })
    }

    connectAccount() {
        this.submitted = true

        if (this.accountForm.valid) {
            const account = {
                login: parseInt(this.accountForm.controls['login'].value),
                accountMasterPassword: this.accountForm.controls['masterPassword'].value,
                action: "connect",
                accountInvestorPassword: this.accountForm.controls['masterPassword'].value, //this.accountForm.controls['investorPassword'].value,
                platform: parseInt(this.accountForm.controls['platform'].value),
                user_Id: this.forUser
            }

            this.accountsService.connectAccount(account).subscribe({
                next: res => {
                    if (res) Dialogs.success('Account connected!',this.translate)
                    this.dataService.refreshAccounts()
                },
                error: err => {
                    Dialogs.error(err,this.translate)
                }
            })
            this.modalRef.dismissAll()
        }
    }
    close() {
        this.modalRef.dismissAll()
    }

}