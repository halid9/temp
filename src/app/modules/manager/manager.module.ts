import { NgModule } from "@angular/core";
import { ManagerRoutingModule } from "./manager-routing.module";

import { Mt5AgentsCommissionsComponent } from './mt5manager/mt5-agents-commissions/mt5-agents-commissions.component';
import { Mt4AgentsCommissionsComponent } from './mt4manager/mt4-agents-commissions/mt4-agents-commissions.component';
import { MT5ConnectCRMModalComponent } from './mt5manager/connect-crmmodal/connect-crmmodal.component';
import { MT4ConnectCRMModalComponent } from './mt4manager/connect-crmmodal/connect-crmmodal.component';
import { MT4AccountChangePasswordModalComponent } from './mt4manager/change-password-modal/change-password-modal.component';
import { MT4AccountBalanceModalComponent } from './mt4manager/account-balance-modal/account-balance-modal.component';
import { MT4AccountUserRightsModalComponent } from './mt4manager/account-user-rights-modal/account-user-rights-modal.component';
import { MT4OnlineUsersModalComponent } from './mt4manager/online-users-modal/online-users-modal.component';
import { MT5OnlineUsersModalComponent } from './mt5manager/online-users-modal/online-users-modal.component';
import { MT4AccountChangeInfoModalComponent } from './mt4manager/change-account-info-modal/change-account-info-modal.component';
import { Mt4ManagerAccountsComponent } from './mt4manager/mt4accounts/mt4accounts.component';
import { Mt5ManagerAccountsComponent } from './mt5manager/mt5accounts/mt5accounts.component';
import { MT5AccountChangePasswordModalComponent } from './mt5manager/change-password-modal/change-password-modal.component';
import { MT5AccountChangeInfoModalComponent } from './mt5manager/change-account-info-modal/change-account-info-modal.component';
import { MT5AccountBalanceModalComponent } from './mt5manager/account-balance-modal/account-balance-modal.component';
import { MT5AccountUserRightsModalComponent } from './mt5manager/account-user-rights-modal/account-user-rights-modal.component';
import { SharedModule } from "src/app/shared/shared.module";

import { AccountsGroupsComponent } from "./accounts-groups/accounts-groups.component";
import { EditAccountGroupComponent } from "./accounts-groups/edit-account-group/edit-account-group.component";
import { LoadingComponent } from "./accounts-groups/loading.component";
import { Mt5AccountsAutomationComponent } from "./mt5-accounts-automation/mt5-accounts-automation.component";


@NgModule({
    declarations: [
        Mt5ManagerAccountsComponent,
        MT5AccountChangePasswordModalComponent,
        MT5AccountChangeInfoModalComponent,
        MT5AccountBalanceModalComponent,
        MT5AccountUserRightsModalComponent,
        Mt4ManagerAccountsComponent,
        MT4AccountChangeInfoModalComponent,
        MT4AccountChangePasswordModalComponent,
        MT4AccountBalanceModalComponent,
        MT4AccountUserRightsModalComponent,
        MT4OnlineUsersModalComponent,
        MT5OnlineUsersModalComponent,
        MT5ConnectCRMModalComponent,
        MT4ConnectCRMModalComponent,
        Mt5AgentsCommissionsComponent,
        Mt4AgentsCommissionsComponent,
        AccountsGroupsComponent,
        EditAccountGroupComponent,
        LoadingComponent,
        Mt5AccountsAutomationComponent
    ],
    imports: [
        ManagerRoutingModule,
        SharedModule
    ],
    schemas: []
})
export class ManagerModule {

}