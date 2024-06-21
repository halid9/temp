import { NgModule } from "@angular/core";
import { SettingsComponent } from "./settings/settings.component";
import { ProfileComponent } from "./profile/profile.component";
import { forgetPasswordComponent } from "./settings/forget-password/forget-password.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivityLogsComponent } from "./profile/activity-logs/activity-logs.component";
import { DealsComponent } from "./profile/deals/deals.component";
import { LoginHistoryComponent } from "./profile/login-history/login-history.component";
import { UploadDocsComponent } from "./profile/upload-docs/upload-docs.component";
import { UploadFormComponent } from "./profile/upload-form/upload-form.component";
import { SharedModule } from "src/app/shared/shared.module";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxUsefulSwiperModule } from "ngx-useful-swiper";
import { QRCodeModule } from "angularx-qrcode";
import { UserRoutingModule } from "./user-routing.module";
import { SharedComponentsModule } from "../../shared/shared-components/shared-compoents.module";
import { FlatpickrModule } from "angularx-flatpickr";

@NgModule({
    declarations: [
        ProfileComponent,
        SettingsComponent,
        forgetPasswordComponent,
        ActivityLogsComponent,
        DealsComponent,
        LoginHistoryComponent,
        UploadDocsComponent,
        UploadFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgbNavModule,
        NgSelectModule,
        NgxUsefulSwiperModule,
        QRCodeModule,
        UserRoutingModule,
        SharedComponentsModule,
        FlatpickrModule

    ],
    
})
export class UserModule {

}