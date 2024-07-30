import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AccountPlatform, AccountStatus, AccountType, BreadcrumbItem } from 'src/app/shared/interfaces';
import { LocaleKeys } from 'src/app/shared/locale_keys';
import { RootReducerState } from 'src/app/store';
import { fetchAccountListData } from 'src/app/store/Account/account_action';
import { AccountModel } from 'src/app/store/Account/account_model';
import { selectAccountData, selectAccountLoading } from 'src/app/store/Account/account_selector';
import { ChangeLeverageComponent } from './change-leverage/change-leverage.component';
import { ChangeNameComponent } from './change-name/change-name.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CreateAccountComponent } from './create-account/create-account.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss'
})
export class AccountComponent {
    filterAccounts(type: 'all' | 'demo' | 'live' | 'active' | 'inactive' | 'pending') {
        // this.allAccounts = this.accounts;
        this.accounts = this.allAccounts.filter((item) => {
            switch (type) {
                case 'demo':
                    this.filterType = 'demo';
                    return item.accountType === AccountType.Demo;
                case 'live':
                    this.filterType = 'live';
                    return item.accountType === AccountType.Live;
                case 'active':
                    this.filterType = 'active';
                    return item.status === AccountStatus.Active;
                case 'inactive':
                    this.filterType = 'inactive';
                    return item.status === AccountStatus.Inactive;
                case 'pending':
                    this.filterType = 'pending';
                    return item.status === AccountStatus.Pending;
                default:
                    this.filterType = 'all';
                    return true;
            }
        });
    }
    addAccount() {
        const modal = this.modalService.open(CreateAccountComponent, { centered: true, size: 'sm', backdrop: 'static', keyboard: false });
    }
    filterType: 'all' | 'demo' | 'live' | 'active' | 'inactive' | 'pending' = 'all';
    isLoading = true;
    allAccounts: AccountModel[] = [];
    accounts: AccountModel[] = [];
    breadCrumbItems: BreadcrumbItem[];
    analyticsData: { name: string, icon: string, value: number, icon_bg_color: string }[] = [];
    constructor(private store: Store<{ data: RootReducerState }>,
        private modalService: NgbModal
    ) {

        this.breadCrumbItems = [
            { label: LocaleKeys.CLIENT, url: '/client' },
            { label: LocaleKeys.CLIENT_ACCOUNTS, active: true }
        ];

    }
    get localeKeys() {
        return LocaleKeys;
    }
    ngOnInit(): void {
        // console.log('AccountComponent');
        // Todo Data Get
        this.store.dispatch(fetchAccountListData());
        this.store.select(selectAccountLoading).subscribe((data) => {
            if (data == false) {
                this.isLoading = false;
                // document.getElementById('elmLoader')?.classList.add('d-none');
            }
        });

        this.store.select(selectAccountData).subscribe((data) => {
            // console.log(data);
            const balance = data.filter((item) => item.platform === AccountPlatform.Wallet && item.currency.toLocaleLowerCase() == "usd").map((item) => item.balance).reduce((a, b) => a + b, 0);
            this.analyticsData = [
                { name: LocaleKeys.CLIENT_ACCOUNTS_ACTIVE, icon: 'check-circle', value: data.filter((item) => item.status === AccountStatus.Active && item.platform !== AccountPlatform.Wallet).length, icon_bg_color: 'success' },
                { name: LocaleKeys.CLIENT_ACCOUNTS_INACTIVE, icon: 'x-circle', value: data.filter((item) => item.status === AccountStatus.Inactive && item.platform !== AccountPlatform.Wallet).length, icon_bg_color: 'danger' },
                { name: LocaleKeys.CLIENT_ACCOUNTS_PENDING, icon: 'clock', value: data.filter((item) => item.status === AccountStatus.Pending && item.platform !== AccountPlatform.Wallet).length, icon_bg_color: 'warning' },
                { name: LocaleKeys.GLOBAL_BALANCE, icon: 'dollar-sign', value: balance, icon_bg_color: 'primary' }
            ];

            this.allAccounts = data.filter((item) => item.platform !== AccountPlatform.Wallet);
            this.accounts = this.allAccounts;
            //   this.dataSource = cloneDeep(data);
        });

    }
    changePassword(accountId: number) {
        const modal = this.modalService.open(ChangePasswordComponent, { centered: true, size: 'sm', backdrop: 'static', keyboard: false });
        modal.componentInstance.data = this.allAccounts.find((item) => item.id === accountId);
    }
    changeName(accountId: number) {
        const modal = this.modalService.open(ChangeNameComponent, { centered: true, size: 'sm', backdrop: 'static', keyboard: false });
        modal.componentInstance.data = this.allAccounts.find((item) => item.id === accountId);
    }
    changeLeverage(accountId: number) {
        const modal = this.modalService.open(ChangeLeverageComponent, { centered: true, size: 'sm', backdrop: 'static', keyboard: false });
        modal.componentInstance.data = this.allAccounts.find((item) => item.id === accountId);
    }
}
