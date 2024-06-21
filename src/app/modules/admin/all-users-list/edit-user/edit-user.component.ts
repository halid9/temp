import { Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "src/app/core/models/auth.models";
import { UserTypes } from "src/app/shared/helper";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { CountryCodes } from "src/app/core/helpers/country-code";
import { Dialogs } from "src/app/shared/dialogs";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "src/app/core/services/data.service";

@Component({
    selector: 'edit-user',
    templateUrl: 'edit-user.component.html',
    styleUrls: ['edit-user.component.scss']
})
export class EditUserComponent {
    @Input() isTab = false
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
    countries = CountryCodes
    @Input() user: Partial<User>
    userForm: FormGroup
    submitted = false
    applying = false
    userTypes = [
        { name: 'Admin', value: UserTypes.Admin },
        { name: 'Agent', value: UserTypes.Agent },
        { name: 'Manager', value: UserTypes.Manager },
        { name: 'Customer', value: UserTypes.Customer },
        { name: 'Call center', value: UserTypes.CallCenter },
    ]
    constructor(private modal: NgbModal,
        private activeModal: NgbActiveModal,
        private authService:AuthenticationService,
        private ds:DataService,
        private translate:TranslateService) {
        this.userForm = new FormGroup({
            firstName: new FormControl(),
            lastName: new FormControl(),
            email: new FormControl(),
            phone: new FormControl(),
            type: new FormControl(),
            country: new FormControl(),
            city: new FormControl(),
            zipCode: new FormControl(),
            streetAdress: new FormControl(),
            verified: new FormControl(),
            verifyEmailAndPhone: new FormControl(),
        })
    }

    get currentUserIsAdmin() {
        return this.authService._currentUser.type === UserTypes.Admin
    }

    get f() { return this.userForm.controls }

    ngOnInit() {
        if (this.user) {
            this.f['firstName'].setValue(this.user.firstName)
            this.f['lastName'].setValue(this.user.lastName)
            this.f['email'].setValue(this.user.email)
            this.f['phone'].setValue(this.user.phone)
            // this.f['type'].setValue(this.userTypes.find(t => t.name == this.user.type).value)
            this.f['type'].setValue(this.user.type)
            this.f['country'].setValue(this.user.address?.country)
            this.f['city'].setValue(this.user.address?.city)
            this.f['zipCode'].setValue(this.user.address?.zipCode)
            this.f['streetAdress'].setValue(this.user.address?.streetAdress)
            this.f['verified'].setValue(this.user?.verificationState?.verified ?? false)
            this.f['verifyEmailAndPhone'].setValue(this.user?.emailVerified && this.user.phoneVerified ? true : false)
        }
    }
    close() {
        this.activeModal.close()
    }
    onSubmit() {
        this.submitted = true
        if (this.userForm.invalid) return Dialogs.error('please complete form requirnments!',this.translate)
        const u: Partial<User> = {
            firstName: this.f['firstName'].value,
            lastName: this.f['lastName'].value,
            email: this.f['email'].value,
            verificationState: { verified: this.f['verified'].value === true || this.f['verified'].value === 'true' },
            verifyEmailAndPhone: this.f['verifyEmailAndPhone'].value === true || this.f['verifyEmailAndPhone'].value === 'true',
            phone: this.f['phone'].value.e164Number,
            type: parseInt(this.f['type'].value),
            address: {
                country: this.f['country'].value,
                city: this.f['city'].value,
                zipCode: this.f['zipCode'].value,
                streetAdress: this.f['streetAdress'].value,
            }
        }
        switch (this.isTab) {
            case true:
                this.applying = true
                this.authService.updateUserById(this.user.id, u).subscribe({
                    next: res => {
                      if (res) {
                        this.ds.refreshAllUsers()
                        Dialogs.success(`User #${this.user.id} updated successfully!`,this.translate)
                        this.applying = false
                      }
                    },
                    error: err => {
                      Dialogs.error(err,this.translate)
                      this.applying = false
                    }
                  })
                break;
                case false:
                    this.activeModal.close(u)
                break;
            default:
                break;
        }


    }
}