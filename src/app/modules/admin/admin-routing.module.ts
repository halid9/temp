import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { RefreshUserGuard } from 'src/app/core/guards/refresh-user.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminSettingsCryptoPaymentsComponent } from './admin-settings/crypto-payments/crypto-payments.component';
import { RolesComponent } from './admin-settings/roles/roles.component';
import { AgentsCommissionsComponent } from './agents-commissions/agents-commissions.component';
import { AllUsersListComponent } from './all-users-list/all-users-list.component';
import { TransactionMethodsComponent } from './admin-settings/transaction-methods/transaction-methods.component.';


const routes: Routes = [
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [PermissionGuard], data: { requiredPermissions: ['admindashboard'],animation:'add' } },
    { path: 'admin-users', component: AllUsersListComponent, canActivate: [RefreshUserGuard],data:{animation:'au'} },
    { path: 'admin-roles', component: RolesComponent, canActivate: [RefreshUserGuard],data:{animation:'adminr'} },
    { path: 'admin/settings/crypto-payments', component: AdminSettingsCryptoPaymentsComponent, canActivate: [RefreshUserGuard],data:{animation:'cp'} },
    { path: 'admin/settings/transaction-methods', component: TransactionMethodsComponent, canActivate: [RefreshUserGuard],data:{animation:'cp'} },
    { path: 'agents-commissions', component: AgentsCommissionsComponent ,data:{animation:'ageco'}},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
