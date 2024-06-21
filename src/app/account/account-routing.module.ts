import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  {
    path: 'pass-reset', loadChildren: () => import('./auth/pass-reset/pass-reset.module').then(m => m.PassResetModule)
  },
  {
    path: 'pass-create', loadChildren: () => import('./auth/pass-create/pass-create.module').then(m => m.PassCreateModule)
  },
  {
    path: 'lockscreen', loadChildren: () => import('./auth/lockscreen/lockscreen.module').then(m => m.LockscreenModule)
  },
  {
    path: 'twostep', loadChildren: () => import('./auth/twostep/twostep.module').then(m => m.TwostepModule)
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "login",
    component: LoginComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
