import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { CrmDashboardComponent } from "./crm-dashboard/crm-dashboard.component";
import { LeadsComponent } from "./leads/leads.component";
import { RefreshUserGuard } from "src/app/core/guards/refresh-user.guard";
import { BonusCampaignsComponent } from "./bonus-campaigns/bonus-campaigns.component";

const routes:Route[] = [
    { path: 'dashboard', component: CrmDashboardComponent, canActivate: [RefreshUserGuard],data:{animation:'crmd'} },
    // { path: 'lead-sources', redirectTo: '../../coming-soon', pathMatch: 'full' },//it has component but redirected to comming soon until it finish 
    { path: 'leads-list', component: LeadsComponent, canActivate: [RefreshUserGuard],data:{animation:'ll'} },
    { path: 'leads-list/:query', component: LeadsComponent, canActivate: [RefreshUserGuard],data:{animation:'ll'} },
    // { path: 'campaigns', redirectTo: '../coming-soon', pathMatch: 'full' },//it has component but redirected to comming soon until it finish 
    { path: 'campaigns/bonus', component: BonusCampaignsComponent, pathMatch:"full", canActivate: [RefreshUserGuard] ,data:{animation:'comppro'}},
   
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[]
})
export class CrmRoutingModule{

}