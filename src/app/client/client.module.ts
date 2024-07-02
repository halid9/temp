import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AccountComponent } from './account/account.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'accounts',
    },
    {
        path: 'accounts',
        component: AccountComponent
    }]
@NgModule({
    declarations: [AccountComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ClientModule { }
