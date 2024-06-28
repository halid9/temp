import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AccountPlatform, AccountStatus, BreadcrumbItem } from 'src/app/shared/interfaces';
import { LocaleKeys } from 'src/app/shared/locale_keys';
import { RootReducerState } from 'src/app/store';
import { fetchAccountListData } from 'src/app/store/Account/account_action';
import { AccountModel } from 'src/app/store/Account/account_model';
import { selectAccountData, selectAccountLoading } from 'src/app/store/Account/account_selector';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss'
})
export class AccountComponent {
    isLoading = true;
    accounts: AccountModel[] = [];
    breadCrumbItems: BreadcrumbItem[];
    analyticsData: { name: string, icon: string, value: number, icon_bg_color: string }[] = [];
    constructor(private store: Store<{ data: RootReducerState }>) {

        this.breadCrumbItems = [
            { label: LocaleKeys.CLIENT, url: '/client' },
            { label: LocaleKeys.CLIENT_ACCOUNTS, active: true }
        ];

    }
    get localeKeys() {
        return LocaleKeys;
    }
    ngOnInit(): void {
        console.log('AccountComponent');
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

            this.accounts = data.filter((item) => item.platform !== AccountPlatform.Wallet);
            //   this.dataSource = cloneDeep(data);
        });

    }
}
