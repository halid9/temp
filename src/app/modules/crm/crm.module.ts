import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { LeadsComponent } from "./leads/leads.component";
import { BonusCampaignsComponent } from "./bonus-campaigns/bonus-campaigns.component";
import { LeadForm } from "./lead-form/lead-form.component";
import { LeadSourceComponent } from "./leads-source/leads-source.component";
import { HeaderMapComponent } from "./leads/header-map/header-map.component";
import { LeadCardComponent } from "./leads/lead-card/lead-card.component";
import { ManageLeadComponent } from "./leads/manage-lead/manage-lead.component";
import { UpdateAgentComponent } from "./leads/update-agent/update-agent-form.component";
import { UpdateOwnerComponent } from "./leads/update-owner/update-owner-form.component";
import { UpdateSupervisorComponent } from "./leads/update-supervisor/update-supervisor-form.component";
import { ConvertToDemoForm } from "./leads/convert-to-demo-form/convert-to-demo-form.component";
import { CrmDashboardComponent } from "./crm-dashboard/crm-dashboard.component";
import { BonusCampaginFormModalComponent } from "./bonus-campaigns/form-modal/form-modal.component";
import { CrmRoutingModule } from "./crm-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedComponentsModule } from "../shared/shared-components/shared-compoents.module";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { PdfViewerModule } from "ng2-pdf-viewer";




@NgModule({
declarations:[
LeadsComponent,
BonusCampaignsComponent,
LeadForm,
LeadSourceComponent,
HeaderMapComponent,
LeadCardComponent,
ManageLeadComponent,
UpdateAgentComponent,
UpdateOwnerComponent,
UpdateSupervisorComponent,
ConvertToDemoForm,
CrmDashboardComponent,
BonusCampaginFormModalComponent


],
imports:[
    PdfViewerModule,
    CrmRoutingModule,
    SharedModule,
    SharedComponentsModule,
    NgxIntlTelInputModule
],
schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmModule{

}