import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// otp module
import { NgOtpInputModule } from 'ng-otp-input';

// Component
import { TwoStepRoutingModule } from "./twostep-routing.module";
import { EmailStepComponent } from './email-step/email-step.component';
import { PhoneStepComponent } from './phone-step/phone-step.component';
import { TwostepsComponent } from './twosteps/twosteps.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EmailStepComponent,
    PhoneStepComponent,
    TwostepsComponent
  ],
  imports: [
    CommonModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    TwoStepRoutingModule,
    TranslateModule
  ]
})
export class TwostepModule { }
