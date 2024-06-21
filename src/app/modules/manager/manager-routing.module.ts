import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Mt5ManagerAccountsComponent } from './mt5manager/mt5accounts/mt5accounts.component';
import { Mt4ManagerAccountsComponent } from './mt4manager/mt4accounts/mt4accounts.component';
import { Mt5AgentsCommissionsComponent } from './mt5manager/mt5-agents-commissions/mt5-agents-commissions.component';
import { Mt4AgentsCommissionsComponent } from './mt4manager/mt4-agents-commissions/mt4-agents-commissions.component';

import { AccountsGroupsComponent } from './accounts-groups/accounts-groups.component';
import { Mt5AccountsAutomationComponent } from './mt5-accounts-automation/mt5-accounts-automation.component';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { Permissions } from 'src/app/shared/helper';
const routes: Routes = [
  { path: 'accounts-groups', component: AccountsGroupsComponent ,data:{animation:'ag'}},
    { path: 'mt5manager/accounts', component: Mt5ManagerAccountsComponent ,data:{animation:'mta'}},
    { path: 'mt5manager/agents-commissions', component: Mt5AgentsCommissionsComponent,data:{animation:'maac'} },
    { path: 'mt5manager/automations', component: Mt5AccountsAutomationComponent,canActivate: [PermissionGuard], data:{requiredPermissions: [Permissions.UpdateMt5AccountsAutomationOptions],animation:'maac'} },
    { path: 'mt4manager/accounts', component: Mt4ManagerAccountsComponent,data:{animation:'mtac'} },
    { path: 'mt4manager/agents-commissions', component: Mt4AgentsCommissionsComponent ,data:{animation:'mtaco'}},

];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
