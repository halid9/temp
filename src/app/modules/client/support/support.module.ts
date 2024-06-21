import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { SupportTicketsComponent } from "./support-tickets/support-tickets.component";
import { LiveSupportComponent } from "./live-support/live-support.component";
import { TicketForm } from "./support-tickets/ticket-form/ticket-form.component";
import { ClientTicketFormComponent } from "./support-tickets/client-ticket-form/client-ticket-form.component";
import { FormsModule } from "@angular/forms";
import { SupportRoutingModule } from "./support-routing.module";

@NgModule({
    declarations:[
        SupportTicketsComponent,
        LiveSupportComponent,
        TicketForm,
        ClientTicketFormComponent
    ],
    imports:[
        SupportRoutingModule,
        FormsModule,
        SharedModule
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class SupportModule{

}