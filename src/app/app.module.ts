import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { LayoutsModule } from './layouts/layouts.module';
import { rootReducer } from './store';
import { ApikeyEffects } from './store/APIKey/apikey_effect';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';
import { CRMEffects } from './store/CRM/crm_effect';
import { CryptoEffects } from './store/Crypto/crypto_effect';
import { EcommerceEffects } from './store/Ecommerce/ecommerce_effect';
import { FileManagerEffects } from './store/File Manager/filemanager_effect';
import { InvoiceEffects } from './store/Invoice/invoice_effect';
import { ApplicationEffects } from './store/Jobs/jobs_effect';
import { ProjectEffects } from './store/Project/project_effect';
import { TaskEffects } from './store/Task/task_effect';
import { TicketEffects } from './store/Ticket/ticket_effect';
import { TodoEffects } from './store/Todo/todo_effect';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { NgPipesModule } from 'ngx-pipes';
const routes: Routes = [
    { path: '', component: LayoutComponent, loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule), canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
    // { path: 'pages', loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule), canActivate: [AuthGuard] },
    // { path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) },
];

export function createTranslateLoader(http: HttpClient): any {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}


@NgModule({
    declarations: [],
    imports: [
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }), RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        // HttpClientModule,
        BrowserModule,
        // AppRoutingModule,
        LayoutsModule,
        StoreModule.forRoot(rootReducer),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        EffectsModule.forRoot([
            AuthenticationEffects,
            EcommerceEffects,
            ProjectEffects,
            TaskEffects,
            CRMEffects,
            CryptoEffects,
            InvoiceEffects,
            TicketEffects,
            FileManagerEffects,
            TodoEffects,
            ApplicationEffects,
            ApikeyEffects]),
        NgPipesModule
    ]
})
export class AppModule { }
