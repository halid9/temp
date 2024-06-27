import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AccountComponent } from './account/account.component';


const routes: Routes = [
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
    ]
})
export class ClientModule { }
