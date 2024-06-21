import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClientRoutingModule } from "./client-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { VerificationDetailsComponent } from "./dashboard/verification-details/verification-details.component";
// import { CountToModule } from "angular-count-to";
import { NgbAccordionModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedComponentsModule } from "../shared/shared-components/shared-compoents.module";
import { AccountsComponent } from "./accounts/accounts.component";
import { ApplicationsDownloadComponent } from "./platforms/applications-download/applications-download.component";
import { EnterWebtraderomponent } from "./platforms/enter-webtrader/enter-webtrader.component";
// import { QRCodeModule } from "angularx-qrcode";
import { SharedModule } from "../../shared/shared.module";
import { AccountsRequestsComponent } from "./accounts/accounts-requests/accounts-requests.component";
import { LearnComponent } from "./learn/learn.component";



@NgModule({
    declarations: [

        // main components
        DashboardComponent,
        AccountsComponent,
        AccountsRequestsComponent,
        EnterWebtraderomponent,
        ApplicationsDownloadComponent,
        LearnComponent,

        // helpers components
        VerificationDetailsComponent,

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClientRoutingModule,
        // CountToModule,
        SharedModule,
        SharedComponentsModule,

        //to move
        NgbAccordionModule,
        NgbModalModule,
    ],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ClientModule {

}