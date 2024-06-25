import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastsContainer } from './login/toasts-container.component';

// Load Icons
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';

import { TranslateModule } from '@ngx-translate/core';
import { AccountRoutingModule } from './account-routing.module';
import { SigninModule } from "./auth/signin/signin.module";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [
        RegisterComponent,
        LoginComponent,
        ToastsContainer
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AccountRoutingModule,
        TranslateModule.forChild(),
        SigninModule,
        NgbToastModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule {
    constructor() {
        defineElement(lottie.loadAnimation);
    }
}
