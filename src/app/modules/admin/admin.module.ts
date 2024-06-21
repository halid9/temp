import { NgModule } from "@angular/core";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { AdminSettingsCryptoPaymentsComponent } from "./admin-settings/crypto-payments/crypto-payments.component";
import { AddRoleComponent } from "./admin-settings/roles/add-role-form/add-role-form.component";
import { EditPermissionsComponent } from "./admin-settings/roles/edit-permissions/edit-permissions.component";
import { RolesComponent } from "./admin-settings/roles/roles.component";
import { AgentsCommissionsComponent } from "./agents-commissions/agents-commissions.component";
import { AllAccountsRequestsComponent } from "./all-accounts-requests/all-accounts-requests.component";
import { AddUserRoleComponent } from "./all-users-list/add-user-role/add-user-role.component";
import { AllUsersListComponent } from "./all-users-list/all-users-list.component";
import { ChangeAgentSettingsComponent } from "./all-users-list/change-user-min-balance/change-user-min-balance.component";
import { ChangeUserTypeComponent } from "./all-users-list/change-user-type/change-user-type.component";
import { EditUserComponent } from "./all-users-list/edit-user/edit-user.component";
import { AllowedGatewaysCompenent } from "./all-users-list/manage-user/allowed-gateways/allowed-gateways.component";
import { ManageUserComponent } from "./all-users-list/manage-user/manage-user.component";
import { UserAccountsRequests } from "./all-users-list/manage-user/user-acc-reqs/user-acc-reqs.component";
import { UserDocsComponent } from "./all-users-list/manage-user/user-docs/user-docs.component";
import { UserTransactionsRequests } from "./all-users-list/manage-user/user-tx-reqs/user-tx-reqs.component";
import { SharedModule } from "src/app/shared/shared.module";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { QRCodeModule } from "angularx-qrcode";
import { SharedComponentsModule } from "../shared/shared-components/shared-compoents.module";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { TransactionMethodsComponent } from "./admin-settings/transaction-methods/transaction-methods.component.";
import { EditTransferMethodComponent } from "./admin-settings/transaction-methods/edit-transfer-method/edit-transfer-method.component";



@NgModule({
    declarations: [
        AdminDashboardComponent,
        AllUsersListComponent,
        AddRoleComponent,
        EditPermissionsComponent,
        AddUserRoleComponent,
        AllAccountsRequestsComponent,
        ChangeUserTypeComponent,
        RolesComponent,
        EditUserComponent,
        ChangeAgentSettingsComponent,
        AgentsCommissionsComponent,
        AdminSettingsCryptoPaymentsComponent,
        AllowedGatewaysCompenent,
        UserDocsComponent,
        ManageUserComponent,
        UserAccountsRequests,
        UserTransactionsRequests,
        TransactionMethodsComponent,
        EditTransferMethodComponent
    ],
    imports: [AdminRoutingModule,
        SharedModule,
        NgbNavModule,
        QRCodeModule,
        SharedComponentsModule,
        NgxIntlTelInputModule
    ],
})
export class AdminModule {

}