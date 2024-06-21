import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { EmailStepComponent } from "./email-step/email-step.component";
import { PhoneStepComponent } from "./phone-step/phone-step.component";
import { DeviceVerifyGuard, EmailVerifyGuard, PhoneVerifyGuard } from '../pass-reset/otp/otp.guard';
import { TwostepsComponent } from './twosteps/twosteps.component';

const routes: Routes = [
  {
    path:'',component:TwostepsComponent,
    canActivate:[DeviceVerifyGuard]
  },
  {
    path: "email",
    component: EmailStepComponent,
    canActivate:[EmailVerifyGuard]
  },
  {
    path: "phone",
    component: PhoneStepComponent,
    canActivate:[PhoneVerifyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwoStepRoutingModule { }
