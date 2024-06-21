import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { FavAccCardComponent } from "./accounts/fav-acc-card/fav-acc-card.component";
import { ChangeFavAccComponent } from "./accounts/fav-acc-card/change-fav-acc/change-fav-acc.component";
import { AccountsCardComponent } from "./accounts/account-card/accounts-card.component";
import { AccountFormComponent } from "./accounts/account-form/account-form.component";
import { ChangeFirstNameComponent } from "./accounts/account-form/change-first-name-form/change-first-name-form.component";
import { ChangeInvestorPasswordComponent } from "./accounts/account-form/change-investor-password-form/change-investor-password-form.component";
import { ChangeLastNameComponent } from "./accounts/account-form/change-last-name-form/change-last-name-form.component";
import { ChangeLeverageComponent } from "./accounts/account-form/change-leverage-form/change-leverage-form.component";
import { ChangeMasterPasswordComponent } from "./accounts/account-form/change-master-password-form/change-master-password-form.component";
import { ChangeNameComponent } from "./accounts/account-form/change-name-form/change-name-form.component";
import { ChangeNoteComponent } from "./accounts/account-form/change-note-form/change-note-form.component";
import { AddNoteComponent } from "./accounts/add-note/add-note.component";
import { ApproveAccountRequestModalComponent } from "./accounts/approve-modal/approve-modal.component";
import { ConnectAccountFormComponent } from "./accounts/connect-account-form/connect-account-form.component";
import { EmailSmsFormComponent } from "./email-sms-form/email-sms-form.component";
import { CreateUserComponent } from "./users/create-user/create-user.component";
import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { ComingSoonComponent } from "./coming-soon/coming-soon.component";
import { CompleteProfileComponent } from "./complete-profile/complete-profile.component";
import { CreditCardComponent } from "./credit-card/credit-card.component.";
import { VoipComponent } from "./voip/voip.component";
import { NgbCarouselModule, NgbHighlight, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { AccountsListComponent } from "./accounts/customer-accounts-list/account-list.component";
import { LoggedDevicesComponent } from "./logged-devices/logged-devices.component";
import { SharedModule } from "src/app/shared/shared.module";
import { IPv4ExtractorPipe } from "src/app/core/pipes/ip4extractos.pipe";
import { AccReqUserInfoComponent } from "./acc-req-user-info/acc-req-user-info.component";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { FlatpickrModule } from "angularx-flatpickr";
import { AccountSelectOptionComponent } from "./accounts/account-select-option/account-select-option.component";
import { QRCodeModule } from "angularx-qrcode";
import { CryptoNetworkSelectOptionComponent } from "./network-select-option/network-select-option.component";
import { SelectAccountGroupModalComponent } from "./accounts/account-form/select-account-group-modal.component";

const DECLARATIONS = [
    FavAccCardComponent,
    ChangeFavAccComponent,
    AccountsCardComponent,
    AccountFormComponent,
    ChangeFirstNameComponent,
    ChangeInvestorPasswordComponent,
    ChangeLastNameComponent,
    ChangeLeverageComponent,
    ChangeMasterPasswordComponent,
    ChangeNameComponent,
    ChangeNoteComponent,
    AddNoteComponent,
    ApproveAccountRequestModalComponent,
    ConnectAccountFormComponent,
    EmailSmsFormComponent,
    CreateUserComponent,
    AccessDeniedComponent,
    ComingSoonComponent,
    CompleteProfileComponent,
    CreditCardComponent,
    VoipComponent,
    AccountsListComponent,
    LoggedDevicesComponent,
    IPv4ExtractorPipe,  
    AccReqUserInfoComponent,
    DatePickerComponent,
    AccountSelectOptionComponent,
    CryptoNetworkSelectOptionComponent,
    SelectAccountGroupModalComponent
    
    
]

@NgModule({
    declarations: DECLARATIONS,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        NgbCarouselModule,
        NgbPaginationModule,
        NgbHighlight,
        SharedModule,
        NgxIntlTelInputModule,
        FlatpickrModule,
        QRCodeModule
    ],
    exports: DECLARATIONS
})
export class SharedComponentsModule {

}