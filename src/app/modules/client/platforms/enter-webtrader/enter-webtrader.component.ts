import { HttpClient } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { firstValueFrom } from "rxjs";
import { AccountCardModel } from "src/app/core/models/account.model";
import { AccountsService } from "src/app/core/services/accounts.service";
import { AccountStatus, AccountType, Platform } from "src/app/shared/helper";
import { environment } from "src/environments/environment";
import { Dialogs } from "src/app/shared/dialogs";
import { DataService } from "src/app/core/services/data.service";
import { TranslateService } from "@ngx-translate/core";
import { AccountFormComponent } from "src/app/modules/shared/shared-components/accounts/account-form/account-form.component";

@Component({
    selector: 'enter-webtrader',
    templateUrl: 'enter-webtrader.component.html',
    styleUrls: ['enter-webtrader.component.scss']
})
export class EnterWebtraderomponent {
    apiUrl = environment.apiUrl
    // url: string = this.apiUrl + '/account/webtrader-iframe/'
    src: SafeResourceUrl = ''
    id: any
    accounts: AccountCardModel[] = []
    loading = true
    constructor(private http: HttpClient,
         private satinizer: DomSanitizer,
          private dataService: DataService,
           private modal: NgbModal,
           private translate:TranslateService) {
    }
     ngOnInit() {
        this.dataService.refreshAccounts()
        this.dataService.accounts$.subscribe(async accounts=>{
            if(accounts && accounts.length){
                this.accounts = accounts.slice().filter(a=>a.status == AccountStatus.Active && a.platform != Platform.Wallet && a.login && a.id)
                // this.accounts.map(a=>a.status != AccountStatus.Pending && a.login)
                this.id = this.accounts[0].id
                await this.refreshUrl()
            }
        })
        
    }
    async refreshUrl() {
        this.loading = true
         await firstValueFrom(this.http.get<{ result: string, [key: string]: any }>(this.apiUrl + '/account/webtrader-iframe/' + this.id)).then(res => {
            this.src = this.satinizer.bypassSecurityTrustResourceUrl(res.result)
            this.loading = false
        }).catch(err => {
            Dialogs.error(err,this.translate)
            this.loading = false
        })
        // this.src = this.satinizer.bypassSecurityTrustResourceUrl(res.result)


    }
    showMessage(event: any) {
    }
    createAccount(type: string) {
        const modal = this.modal.open(AccountFormComponent, { centered: true })
        modal.componentInstance.type = type == 'live' ? AccountType.Live : AccountType.Demo
    }

}