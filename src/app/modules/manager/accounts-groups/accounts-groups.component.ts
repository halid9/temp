import { Component, QueryList, ViewChildren } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "src/app/core/services/data.service";
import { Mt5ManagerService } from "../services/mt5manager.service";
import { Mt4managerService } from "../services/mt4manager.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { ContentService } from "src/app/core/services/content.service";
import { Platform } from "src/app/shared/helper";
import { Observable, firstValueFrom } from "rxjs";
import { NgbdCustomSortableHeader, SortEvent } from "src/app/core/directives/custom-sortable.directive";
import { AccountGroup } from "src/app/core/models/account-group.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountGroupService } from "src/app/core/services/account-group.service";
import { Dialogs } from "src/app/shared/dialogs";
import { EditAccountGroupComponent } from "./edit-account-group/edit-account-group.component";
import { LoadingComponent } from "./loading.component";


@Component({
    selector: "accounts-groups",
    templateUrl: "accounts-groups.component.html"
})
export class AccountsGroupsComponent {
    breadCrumbItems!: Array<{}>;
    platforms: { name: string, value: Platform }[] = [{ name: "MT4", value: Platform.MT4 }, { name: "MT5", value: Platform.MT5 }]
    selectedPlatform: Platform = Platform.MT4
    currencies: string[] = []
    selectedCurrency: string = ""
    mt4AccountsGroups: any[] = []
    mt5AccountsGroups: any[] = []
    selectedGroup: string = ''
    accountsGroupsToView$: Observable<AccountGroup[]>
    loading$: Observable<boolean>
    total$: Observable<number>;

    @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;

    constructor(
        private translate: TranslateService,
        private ds: DataService,
        private mt5manager: Mt5ManagerService,
        private mt4manager: Mt4managerService,
        private accountGroupService: AccountGroupService,
        public contentService: ContentService,
        private modal: NgbModal,


    ) {
        this.accountsGroupsToView$ = contentService.contentToVeiw$
        this.total$ = contentService.total$
        this.loading$ = contentService.loading$
    }

    async ngOnInit() {


        this.mt4AccountsGroups = await firstValueFrom(this.mt4manager.getMt4AccountsGroupsNames())
        this.mt5AccountsGroups = await firstValueFrom(this.mt5manager.getMt5AccountsGroupsNames())
        this.ds.refresAccountsGroups()
        this.ds.accountsGroups$.subscribe(groups => {
            this.initGroupsToView(groups)
        })
    }
    initGroupsToView(groups: AccountGroup[]) {
        let groupsToView: AccountGroup[] = []
        if (this.selectedPlatform == Platform.MT4) {
            this.mt4AccountsGroups.forEach(g => {
                const currentGroup = groups.find(group => group.name == g.group)
                currentGroup ? groupsToView.push(currentGroup) : groupsToView.push({
                    name: g.group,
                    title: null,
                    details: [],
                    description: null,
                    currency: g.currency,
                    leverages: [],
                    rules: null,
                    platform:Platform.MT4,
                    minDepositAmount: null,
                    enabled: false,
                })
            })
            const groupsCurrencies = this.mt4AccountsGroups.map(g => { return g.currency })
            this.currencies = groupsCurrencies.filter((item, index) => new Set(groupsCurrencies.slice(0, index)).has(item) === false);
        }
        else {
            this.mt5AccountsGroups.forEach(g => {
                const currentGroup = groups.find(group => group.name == g.group)
                currentGroup ? groupsToView.push(currentGroup) : groupsToView.push({
                    name: g.group,
                    title: null,
                    details: [],
                    description: null,
                    currency: g.currency,
                    leverages: [],
                    platform:Platform.MT5,
                    rules: null,
                    minDepositAmount: null,
                    enabled: false,
                })
            })
            const groupsCurrencies = this.mt4AccountsGroups.map(g => { return g.currency })
            this.currencies = groupsCurrencies.filter((item, index) => new Set(groupsCurrencies.slice(0, index)).has(item) === false);

        }
        if (this.selectedCurrency) groupsToView = groupsToView.filter(g => g.currency == this.selectedCurrency)

        this.contentService.initContent(groupsToView)

    }

    platformChaned() {
        //filter according to platform
        if (this.selectedCurrency) this.currencyChanged()
        this.ds.refresAccountsGroups()
    }

    currencyChanged() {
        this.ds.refresAccountsGroups()

    }

    editAccountGroup(accountGroup: AccountGroup) {
        const modal = this.modal.open(EditAccountGroupComponent, { centered: true, size: "lg" })
        modal.componentInstance.accountGroup = accountGroup
    }

    onSort({ column, direction }: SortEvent) {
        // resetting other headers
        this.headers.forEach(header => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        this.contentService.sortColumn = column;
        this.contentService.sortDirection = direction;
    }

    setAsEnabled(accountGroup: AccountGroup) {
const loadingModal = this.modal.open(LoadingComponent,
{
    centered: true
}
) 
        this.accountGroupService.addGroup(accountGroup).subscribe(
            {
                next: res => {
                    if (res) Dialogs.success("Group updated successfully!", this.translate)
                        loadingModal.close()
                },
                error: err => {
                    accountGroup.enabled = !accountGroup.enabled
                    loadingModal.close()
                    Dialogs.error(err, this.translate)
                }
            }
        )
    }
}