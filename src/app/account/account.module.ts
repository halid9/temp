import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';




// Load Icons


import { AccountRoutingModule } from './account-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    // ToastsContainer,
  ],
  imports: [
    AccountRoutingModule,
    SharedModule,
    NgxIntlTelInputModule,
    NgbDropdownModule
   

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule { 
  constructor() {
  }
}
