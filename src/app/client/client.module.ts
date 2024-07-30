import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { AccountComponent } from './account/account.component';
import { ChangeLeverageComponent } from './account/change-leverage/change-leverage.component';
import { ChangeNameComponent } from './account/change-name/change-name.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'accounts',
        pathMatch: 'full'
    },
    {
        path: 'accounts',
        component: AccountComponent
    }]
@NgModule({
    declarations: [AccountComponent, ChangePasswordComponent, ChangeNameComponent, ChangeLeverageComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        NgSelectModule, FormsModule,
        ReactiveFormsModule
    ],
    schemas: [
        // CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ClientModule { }
