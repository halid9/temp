import { Component, QueryList, ViewChildren } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { AccountCardModel } from "src/app/core/models/account.model";
import { ContentService } from "src/app/core/services/content.service";
import { DataService } from "src/app/core/services/data.service";
import { ConnectExternalAccountsComponent } from "./connect-external-accounts/connect-external-accounts.component";
import { ConnectingAccountsResultComponent } from "./connecting-accounts-result/connecting-accounts-result.component";
import { ConnectAccountModel } from "src/app/core/models/connect-account.model";
import { AccountsService } from "src/app/core/services/accounts.service";
import { AccountType, Platform } from "src/app/shared/helper";
import { ConnectingStatusComponent } from "./connecting-status/connecting-status.component";
import { Dialogs } from "src/app/shared/dialogs";
import { TranslateService } from "@ngx-translate/core";
import { NgbdCustomSortableHeader, SortEvent } from "src/app/core/directives/custom-sortable.directive";
import { AccountFormComponent } from "src/app/modules/shared/shared-components/accounts/account-form/account-form.component";
import { ChangeNameComponent } from "../../shared/shared-components/accounts/account-form/change-name-form/change-name-form.component";
import { ChangeLeverageComponent } from "../../shared/shared-components/accounts/account-form/change-leverage-form/change-leverage-form.component";
import { ChangeMasterPasswordComponent } from "../../shared/shared-components/accounts/account-form/change-master-password-form/change-master-password-form.component";
import { ChangeInvestorPasswordComponent } from "../../shared/shared-components/accounts/account-form/change-investor-password-form/change-investor-password-form.component";

@Component({
    selector: 'agent-external-accounts',
    templateUrl: 'agent-external-accounts.component.html',
    styleUrls: ['agent-external-accounts.component.scss'],
    providers: [ContentService]
})
export class AgentExternalAccountsComponent {
    sortCol = ''
    sortClass = ''
    breadCrumbItems!: Array<{}>;
    title: 'External accounts'
    externalAccounts$: Observable<AccountCardModel[]>
    loading$: Observable<boolean>
    total$: Observable<any>
    Platform = Platform
    AccountType = AccountType
    @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;

    constructor(private dataService: DataService,
        public contentService: ContentService,
        private modal: NgbModal,
        private accountsService: AccountsService,
        private translate:TranslateService) {
        this.externalAccounts$ = contentService.contentToVeiw$
        this.total$ = contentService.total$
        this.loading$ = contentService.loading$
    }

    ngOnInit() {
        // this.modal.open(ConnectingStatusComponent,{ centered: true, size: 'md' ,backdrop:'static',keyboard:false})
        this.dataService.refreshAccounts()
        this.dataService.accounts$.subscribe(accounts => {
            const externalAccounts = accounts.filter(a => a.external)

            externalAccounts.map(a=>{
                a.platform  == Platform.MT4? a.platform = 'MT4': a.platform  == Platform.MT5? a.platform = 'MT5' : 'Wallet'
            })
            if (accounts && accounts.length)
            {

                this.contentService.initContent(externalAccounts)
                this.accountsService.externalAccounts = externalAccounts.slice()
            } 
        })
        this.contentService.pageSize = 10
        
        this.breadCrumbItems = [
            { label: 'Agent' },
            { label: 'External accounts', active: true }
        ];
        this.contentService.filter = ''
    }
    openConnectAccounts() {
        const failedConnectins: ConnectAccountModel[] = []
        let success = 0
        const modal = this.modal.open(ConnectExternalAccountsComponent, { centered: true, size: 'xl' })
        modal.dismissed.subscribe((result: ConnectAccountModel[]) => {
            if (result && result.length == 0) Dialogs.error('No accounts to connect',this.translate)
            else if( result?.length > 0) {
                const connecting = this.modal.open(ConnectingStatusComponent, { centered: true, size: 'md', backdrop: 'static', keyboard: false })
                connecting.componentInstance.accounts = result

                connecting.dismissed.subscribe(r => {
                    if (r?.length) {
                        const results = this.modal.open(ConnectingAccountsResultComponent, { centered: true, size: 'xl',backdrop: 'static', keyboard: false })
                        results.componentInstance.accounts = r
                    }
                    else Dialogs.success('All accounts connected successfully!',this.translate)

                    this.dataService.refreshAccounts()
                })
            }
        }
        )
    }

    setType(type){
        this.contentService.filter = type
    }
    onSort({ column, direction }: SortEvent) {
        // resetting other headers
        this.headers.forEach(header => {
          if (header.sortable !== column) {
            header.direction = '';
          }
        });
        this.sortClass = direction
        this.sortCol = column as string
        this.contentService.sortColumn = column;
        this.contentService.sortDirection = direction;
      }
      OpenNewAccount(){
        const modal = this.modal.open(AccountFormComponent,{centered:true})
        modal.componentInstance.external = true
      }

      changeName(id) {
        const modal = this.modal.open(ChangeNameComponent, { centered: true })
        modal.componentInstance.accountId = id
        modal.componentInstance.external = true
    
        modal.dismissed.subscribe({
          next: () => {
            this.dataService.refreshAccounts()
          }
        });
      }
      changeLeverage(id,leverage) {
        const modal = this.modal.open(ChangeLeverageComponent, { centered: true })
        modal.componentInstance.accountId = id
        modal.componentInstance.leverage = leverage
        modal.componentInstance.external = true
    
        modal.dismissed.subscribe({
          next: () => {
            this.dataService.refreshAccounts()
          }
        });
    
      }
      deleteAccount(id) {
        Dialogs.confirm(this.accountsService.delete(id), this.translate, () => {
          this.dataService.refreshAccounts()
        })
    
      }
      changeMasterPassword(id) {
        const modal = this.modal.open(ChangeMasterPasswordComponent, { centered: true })
        modal.componentInstance.accountId = id
        modal.componentInstance.external = true

      }
      changeInvestorPassword(id) {
        const modal = this.modal.open(ChangeInvestorPasswordComponent, { centered: true })
        modal.componentInstance.accountId = id
        modal.componentInstance.external = true

      }
}