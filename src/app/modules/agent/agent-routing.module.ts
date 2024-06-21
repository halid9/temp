import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { RefreshUserGuard } from 'src/app/core/guards/refresh-user.guard';
import { CustomersComponent } from './agent-customers/customers.component';
import { CustomerMtAccountHistoryComponent } from './agent-customers/mt-account-history/mt-account-history.component';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { AgentExternalAccountsComponent } from './agent-external-accounts/agent-external-accounts.component';
import { AgentRequestsComponent } from './agent-requests/agent-requests.component';
import { DocumentsComponent } from './documents-requests/documents.component';
import { TxRequestsComponent } from './tx-requests/tx-requests.component';
import { TxRequestsHistoryComponent } from './tx-requests-history/tx-requests-history.component';

const routes: Routes = [
    
    { path: 'agent-dashboard', component: AgentDashboardComponent, canActivate: [RefreshUserGuard] ,data:{animation:'ad'}},
    { path: 'agent-customers', component: CustomersComponent, canActivate: [RefreshUserGuard],data:{animation:'ac'} },
    { path: 'agent-external-accounts', component: AgentExternalAccountsComponent, canActivate: [RefreshUserGuard] ,data:{animation:'aea'}},
    { path: 'transactions/mt-account-history', component: CustomerMtAccountHistoryComponent, canActivate: [RefreshUserGuard] ,data: { requiredPermissions: [],animation:'mtaccHis' }},
    { path: 'all-accounts-requests', component: AgentRequestsComponent, canActivate: [RefreshUserGuard],data:{animation:'aaar'} },
    { path: 'all-transactions-requests', component: TxRequestsComponent, canActivate: [RefreshUserGuard] ,data:{animation:'aatr'}},
    { path: 'all-transactions-requests-history', component: TxRequestsHistoryComponent, canActivate: [RefreshUserGuard] ,data:{animation:'aatr'}},
    { path: 'all-documents', component: DocumentsComponent, canActivate: [RefreshUserGuard],data:{animation:'aaa'} },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
