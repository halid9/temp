import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { SupportTicketsComponent } from "./support-tickets/support-tickets.component";
import { LiveSupportComponent } from "./live-support/live-support.component";

const routes: Route[] = [

    {
        path: 'live-support', pathMatch:"full",
        component: LiveSupportComponent,
        data: { animation: 'ls' }
    },
    {
        path: 'support-tickets', pathMatch:"full",
        component: SupportTicketsComponent,
        data: { animation: 'st' }
    },

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SupportRoutingModule {

}