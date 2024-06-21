import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { PermissionGuard } from "../../core/guards/permission.guard";
import { RefreshUserGuard } from "../../core/guards/refresh-user.guard";
import { AccountsRequestsComponent } from "./accounts/accounts-requests/accounts-requests.component";
import { AccountsComponent } from "./accounts/accounts.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LearnComponent } from "./learn/learn.component";
import { ApplicationsDownloadComponent } from "./platforms/applications-download/applications-download.component";

const routes: Route[] = [
    {
        path: '', redirectTo: "dashboard", pathMatch: "full"
    },
    {
        path: 'dashboard', component: DashboardComponent,
        canActivate: [PermissionGuard, RefreshUserGuard],
        data: { requiredPermissions: [], animation: 'dashboardPage' }
    },
    {
        path: 'accounts/all-accounts', component: AccountsComponent,
        data: { requiredPermissions: [], animation: 'accounts' },
        canActivate: [RefreshUserGuard]
    },
    {
        path: 'accounts/accounts-requests', component: AccountsRequestsComponent,
        data: { requiredPermissions: [], animation: 'acc-req' },
        canActivate: [RefreshUserGuard]
    },
    {
        path: 'transactions', loadChildren: () => import('./transactions/transaction.module').then(m => m.TransactionModule),
        data: { requiredPermissions: [] },
        canActivate: [RefreshUserGuard]
    },

    // { path: 'transactions/mt-account-history', component: CustomerMtAccountHistoryComponent, canActivate: [RefreshUserGuard] ,data: { requiredPermissions: [],animation:'mtaccHis' }},
    {
        path: 'platforms/applications-download', component: ApplicationsDownloadComponent,
        canActivate: [RefreshUserGuard]
    },
    // {
    //     path: 'platforms/enter-webtrader', component: EnterWebtraderomponent,
    //     canActivate: [RefreshUserGuard], data: { animation: 'web-trader' }
    // },
    {
        path: 'copy-trading',
        redirectTo: '/coming-soon', pathMatch: 'full' //it has component but redirected to comming soon until it finish 
    },
    {
        path: 'economic-calendar', component: LearnComponent, pathMatch: 'full'
    },
    {
        path: 'settings',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        canActivate: [RefreshUserGuard]
    },
    {
        path: 'support',
        loadChildren: () => import('./support/support.module').then(m => m.SupportModule),
        data: { animation: 'ls' }
    },
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule {

}