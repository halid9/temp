import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AccountsService } from "src/app/core/services/accounts.service";
import { Dialogs } from "src/app/shared/dialogs";

@Component({
    selector: 'change-leverage-form',
    templateUrl: 'change-leverage-form.component.html',
    styleUrls: ['change-leverage-form.component.scss']
})
export class ChangeLeverageComponent {
    @Input() accountId: number = 0
    @Input() external: boolean = false
    submitted = false
    @Input() leverage: number = 1
    newLeverage:number | string = 1
    leverages = [1, 10, 50, 100]

    constructor(private accountsService: AccountsService,
         private modal: NgbModal,
         private translate:TranslateService) {

    }

    ngOnInit() {
        this.newLeverage =this.external? this.accountsService.externalAccounts.find(a => a.id == this.accountId).leverage : this.accountsService.accounts.find(a => a.id == this.accountId).leverage;

    }
    
    changeLeverage() {
        this.submitted = true
        if (this.leverage == this.newLeverage) return
        this.accountsService.changeLeverage(this.accountId, parseInt(this.newLeverage as string)).subscribe(
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
    close(){
        this.modal.dismissAll()
    }

}