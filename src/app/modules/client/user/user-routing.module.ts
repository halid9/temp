import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { RefreshUserGuard } from "src/app/core/guards/refresh-user.guard";
import { ProfileComponent } from "./profile/profile.component";
import { SettingsComponent } from "./settings/settings.component";



const routes: Route[] = [
   
    {
        path: 'profile',
        component: ProfileComponent, pathMatch:"full",
        data: { animation: 'profile' }
    },
    {
        path: 'edit-profile',
        component: SettingsComponent, pathMatch:"full",
        data: { animation: 'edit-pro' }
    },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {

}