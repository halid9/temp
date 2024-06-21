import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Dialogs } from "src/app/shared/dialogs";
import { Functions } from "src/app/shared/functions";
import { UserStatus, UserTypes } from "src/app/shared/helper";
import { preventConsecutiveLettersAndSequencesValidator, minMaxLengthValidator, preventSymbols, preventNumbers } from "src/app/shared/validators";

@Component({
    selector: 'create-user',
    templateUrl: 'create-user.component.html',
    styleUrls: ['create-user.component.scss']
})
export class CreateUserComponent {
    @Input() userData?: { email: string, firstName: string, lastName: string, phoneNumber: string }

    submitted = false
    successmsg = false;
    error = '';
    createUserFrom: FormGroup
    visible = false
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
    @Input() userTypes = []
dir = 'ltr'

    constructor(private modal: NgbModal,
         private authenticationService: AuthenticationService,
          private activeModal: NgbActiveModal,
          private cookie:CookieService,
          private translate:TranslateService) {
        this.createUserFrom = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            firstName: new FormControl('', [Validators.required, preventConsecutiveLettersAndSequencesValidator(), minMaxLengthValidator(0, 15), preventSymbols(true), preventNumbers()]),
            lastName: new FormControl('', [Validators.required, preventConsecutiveLettersAndSequencesValidator(), minMaxLengthValidator(0, 15), preventSymbols(true), preventNumbers()]),
            password: new FormControl('', Validators.required),
            cpassword: new FormControl('', Validators.required),
            type: new FormControl<UserTypes>(UserTypes.Customer, Validators.required),
            phone: new FormControl(null, [Validators.required]),
        });
    }
    ngOnInit() {
        this.dir = this.cookie.get('lang') =="ar"?"rtl":'ltr'
        if (this.userData) {
            this.createUserFrom.patchValue({
                email: this.userData.email,
                firstName: this.userData.firstName,
                lastName: this.userData.lastName,
                phone: this.userData.phoneNumber
            })
        }
        // const phonInput = document.getElementById('phone') as HTMLInputElement
        // phonInput.addEventListener('keyup', () => {
        //   this.f['phone'].errors? phonInput.classList.add('is-invalid'):phonInput.classList.add('is-invalid')
        // })
        // Password Validation set
        var passwordInput = document.getElementById("userpassword") as HTMLInputElement;
        var cpasswordInput = document.getElementById("usercpassword") as HTMLInputElement;
        var letter = document.getElementById("pass-lower");
        var capital = document.getElementById("pass-upper");
        var number = document.getElementById("pass-number");
        var length = document.getElementById("pass-length");
        var match = document.getElementById("pass-match");

        // When the user clicks on the password field, show the message box
        passwordInput.onfocus = function () {
            let input = document.getElementById("password-contain") as HTMLElement;
            input.style.display = "block"
            passwordInput.removeAttribute('readonly')
        };
        function validate() {
            // Validate lowercase letters
            var lowerCaseLetters = /[a-z]/;
            if (passwordInput.value.match(lowerCaseLetters)) {
              letter?.classList.remove("invalid");
              letter?.classList.add("valid");
            } else {
              letter?.classList.remove("valid");
              letter?.classList.add("invalid");
            }
      
            // Validate capital letters
            var upperCaseLetters = /[A-Z]/;
            if (passwordInput.value.match(upperCaseLetters)) {
              capital?.classList.remove("invalid");
              capital?.classList.add("valid");
            } else {
              capital?.classList.remove("valid");
              capital?.classList.add("invalid");
            }
      
            // Validate numbers
            var numbers = /[0-9]/;
            if (passwordInput.value.match(numbers)) {
              number?.classList.remove("invalid");
              number?.classList.add("valid");
            } else {
              number?.classList.remove("valid");
              number?.classList.add("invalid");
            }
      
            // Validate length
            if (passwordInput.value.length >= 8) {
              length?.classList.remove("invalid");
              length?.classList.add("valid");
            } else {
              length?.classList.remove("valid");
              length?.classList.add("invalid");
            }
      
            //validate match
            if (passwordInput.value == cpasswordInput.value) {
              match?.classList.remove("invalid");
              match?.classList.add("valid");
            } else {
              match?.classList.remove("valid");
              match?.classList.add("invalid");
            }
          }
          var matches = function () {
            // Validate match
            if (passwordInput.value == cpasswordInput.value) {
              match?.classList.remove("invalid");
              match?.classList.add("valid");
            } else {
              match?.classList.remove("valid");
              match?.classList.add("invalid");
            }
          }
          // When the user starts to type something inside the password field
          passwordInput.onkeyup = validate;
          cpasswordInput.onkeyup = matches
          passwordInput.addEventListener('change', validate)
        cpasswordInput.onfocus = function () {
            let input = document.getElementById("password-contain") as HTMLElement;
            input.style.display = "block"
            cpasswordInput.removeAttribute('readonly')
        };


        // When the user clicks outside of the password field, hide the password-contain box
        // myInput.onblur = function () {
        //   let input = document.getElementById("password-contain") as HTMLElement;
        //   input.style.display = "none"
        // };
    }
    get f() { return this.createUserFrom.controls }
    getFlag(code) {
        return `assets/images/flags/${code}.svg`.toLocaleLowerCase()

    }
    changePreferredCountries() {
        this.preferredCountries = [CountryISO.India, CountryISO.Canada];
    }

    toggelShow(){
        this.visible = !this.visible
    }
    generatePassword() {
        var passwordInput = document.getElementById("userpassword") as HTMLInputElement;
        var cpasswordInput = document.getElementById("usercpassword") as HTMLInputElement;
        const password = Functions.generateRandomPassword()
        this.f['password'].setValue(password)
        this.f['cpassword'].setValue(password)
        // Set the input element's value property directly
        passwordInput.value = password;
    
        // Create and dispatch a new input event
        const event = new Event('input', {
          bubbles: true,
          cancelable: true,
        });
        passwordInput.dispatchEvent(event);
    
        // Create and dispatch a new change event
        const changeEvent = new Event('change', {
          bubbles: true,
          cancelable: true,
        });
        passwordInput.dispatchEvent(changeEvent);
        // Create and dispatch a new input event
        const foucsEvent = new Event('focus', {
            bubbles: true,
            cancelable: true,
        });
        passwordInput.dispatchEvent(foucsEvent);
        this.visible = true
      }
    ValidatePassword(): boolean {
        var passwordInput = document.getElementById("userpassword") as HTMLInputElement;
        var cpasswordInput = document.getElementById("usercpassword") as HTMLInputElement;
        var lowerCaseLetters = /[a-z]/g;
        var upperCaseLetters = /[A-Z]/g;
        var numbers = /[0-9]/g;
        if (passwordInput.value.match(lowerCaseLetters) &&
            passwordInput.value.match(upperCaseLetters) &&
            passwordInput.value.match(numbers) &&
            passwordInput.value.length >= 8 &&
            passwordInput.value == cpasswordInput.value
        ) return true
        else return false
    }
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.createUserFrom.invalid || !this.ValidatePassword()) {
            Dialogs.error('Check registration requirments!',this.translate)
            return
        }
        //Register Api
        this.authenticationService.register({
            email: this.f['email'].value,
            firstName: this.f['firstName'].value,
            lastName: this.f['lastName'].value,
            password: this.f['password'].value,
            phone: this.f['phone'].value.e164Number,
            status: UserStatus.Draft,
            type: parseInt(this.f['type'].value),
        }).subscribe(
            {
                next: res => {
                    Dialogs.success('user created successfully!',this.translate)
                    this.activeModal.close(res);
                },
                error: (error: any) => {
                    this.error = error ? error : '';
                    Dialogs.error(error,this.translate)
                }
            });

    }
    close() {
        this.activeModal.close();
    }
}