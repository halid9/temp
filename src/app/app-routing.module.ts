import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';


// Auth

const routes: Routes = [
    { path: 'client', component: LayoutComponent, loadChildren: () => import('./client/client.module').then(m => m.ClientModule), canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
    //   { path: 'pages', loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule), canActivate: [AuthGuard] },
    { path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
