import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AgentRoutingModule } from "./agent-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedComponentsModule } from "../shared/shared-components/shared-compoents.module";
import { CustomerCardComponent } from "./agent-customers/customer-card/customer-card.component";
import { CustomersComponent } from "./agent-customers/customers.component";
import { CustomerMtAccountHistoryComponent } from "./agent-customers/mt-account-history/mt-account-history.component";
import { SortByCrmPipe } from "./agent-customers/sort-by.pipe";
import { AgentDashboardComponent } from "./agent-dashboard/agent-dashboard.component";
import { AgentExternalAccountsComponent } from "./agent-external-accounts/agent-external-accounts.component";
import { ConnectExternalAccountsComponent } from "./agent-external-accounts/connect-external-accounts/connect-external-accounts.component";
import { ConnectingAccountsResultComponent } from "./agent-external-accounts/connecting-accounts-result/connecting-accounts-result.component";
import { ConnectingStatusComponent } from "./agent-external-accounts/connecting-status/connecting-status.component";
import { AgentRequestsComponent } from "./agent-requests/agent-requests.component";
import { DocumentsComponent } from "./documents-requests/documents.component";
import { TxRequestsComponent } from "./tx-requests/tx-requests.component";
import { FlatpickrModule } from "angularx-flatpickr";
import { TxRequestsHistoryComponent } from "./tx-requests-history/tx-requests-history.component";

@NgModule({
    declarations: [
        AgentDashboardComponent,
        CustomersComponent,
        AgentRequestsComponent,
        TxRequestsComponent,
        CustomerCardComponent,
        SortByCrmPipe,
        DocumentsComponent,
        AgentExternalAccountsComponent,
        ConnectExternalAccountsComponent,
        ConnectingAccountsResultComponent,
        ConnectingStatusComponent,
        CustomerMtAccountHistoryComponent,
        TxRequestsComponent,
        TxRequestsHistoryComponent
    ],
    imports: [
        AgentRoutingModule,
        SharedModule,
        SharedComponentsModule,
        FlatpickrModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AgentModule {

}