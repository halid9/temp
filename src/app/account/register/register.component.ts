import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4, validate } from 'uuid';

// Register Auth
import { AuthenticationService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserStatus, UserTypes } from 'src/app/shared/helper';
import { Dialogs } from 'src/app/shared/dialogs';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { minMaxLengthValidator, preventConsecutiveLettersAndSequencesValidator, preventNumbers, preventSymbols } from 'src/app/shared/validators';
import { Functions } from 'src/app/shared/functions';
import { matches } from 'lodash';
import { LanguageService } from 'src/app/core/services/language.service';
import { CookieService } from 'ngx-cookie-service';
import { dir } from 'console';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

/**
 * Register Component
 */
export class RegisterComponent implements OnInit {
  visible = false
  dir = 'ltr'

  // Login Form
  signupForm!: FormGroup;
  submitted = false;
  successmsg = false;
  error = '';
  valueset: any
  affiliateUserId: number
  // set the current year
  year: number = new Date().getFullYear();
  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private languageService: LanguageService,
    public _cookiesService: CookieService,
    
    private route: ActivatedRoute,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    
    try {
      const url = window.location.href;
      const queryString = decodeURIComponent(url.split('?')[1] ?? '');
      const affiliateUserId = parseInt(atob(queryString));

      // if there is affiliate user id in the url, set it in the local storage and setit to expire after 30 days
      if (affiliateUserId) {
        localStorage.setItem('affiliateUserId', affiliateUserId.toString());
        const date = new Date();
        date.setDate(date.getDate() + 30);
        localStorage.setItem('affiliateUserIdExpireDate', date.toISOString());
      }
    } catch (e) {
      this.affiliateUserId = 0
    }

    // check if local storage has affiliate user id and if it is expired, remove it
    const affiliateUserId = localStorage.getItem('affiliateUserId');
    const affiliateUserIdExpireDate = localStorage.getItem('affiliateUserIdExpireDate');
    if (affiliateUserId && affiliateUserIdExpireDate) {
      const expireDate = new Date(affiliateUserIdExpireDate);
      if (expireDate < new Date()) {
        localStorage.removeItem('affiliateUserId');
        localStorage.removeItem('affiliateUserIdExpireDate');
      }
    }

    this.affiliateUserId = parseInt(localStorage.getItem('affiliateUserId') ?? '0');

    console.log(this.affiliateUserId);

    /**
     * Form Validatyion
     */
    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    this.cookieValue == 'ar' ? this.dir = 'rtl' : this.dir = "ltr"
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.svg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }

    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required, preventConsecutiveLettersAndSequencesValidator(), minMaxLengthValidator(0, 15), preventSymbols(true), preventNumbers()]),
      // username: new FormControl('', [Validators.required, preventConsecutiveLettersAndSequences(), minMaxLengthValidator(0, 15), preventSymbols(false)],),
      lastName: new FormControl('', [Validators.required, preventConsecutiveLettersAndSequencesValidator(), minMaxLengthValidator(0, 15), preventSymbols(true), preventNumbers()]),
      password: new FormControl('', Validators.required),
      cpassword: new FormControl('', Validators.required),
      // new FormControl(country: [this.countries[0].phone_code, Validators.required],
      phone: new FormControl(null, [Validators.required]),
    });

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
    }

  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }



  /**
   * Register submit form
   */
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.signupForm.invalid || !this.ValidatePassword()) {
      Dialogs.error('Check registration requirments!',this.translate)
      return
    }
    //Register Api
    this.authenticationService.register({
      // username: this.f['username'].value.toLocaleLowerCase(),
      email: this.f['email'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      password: this.f['password'].value,
      phone: this.f['phone'].value.e164Number,
      status: UserStatus.Draft,
      type: UserTypes.Customer,
      affiliate: this.affiliateUserId,
      lang:this.translate.currentLang
    }).subscribe(
      {
        next: () => {
          Dialogs.success('Registration success!',this.translate)
          const uuid = uuidv4()
          localStorage.setItem('uuid', uuid)
          this.authenticationService.login(this.f['email'].value.toLocaleLowerCase(), this.f['password'].value, true, uuid).subscribe(
            {
              next: (res: any) => {
                if (res.success) {
                  localStorage.setItem('verificationState', JSON.stringify(res.payload))
                  localStorage.setItem('token', res.payload.access_token);
                  localStorage.setItem('userId', res.payload.id)
                  this.authenticationService.getCurrentUser().then(() => { this.router.navigate(['']) })
                }
                if (!res.success) {
                  localStorage.setItem('verificationState', JSON.stringify(res.payload))
                  this.router.navigate(['auth', 'twostep', 'email'])

                }
              },
              error: err => { Dialogs.error(err,this.translate) }
            }
          )

        },
        error: (error: any) => {
          this.error = error ? error : '';
          Dialogs.error(error,this.translate)
        }
      });

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
  getFlag(code) {
    return `assets/images/flags/${code}.svg`.toLocaleLowerCase()

  }
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];


  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  toggelShow() {
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
    this.visible = true
  }

  countryName: any
  flagvalue: any
  cookieValue: any
  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    // { text: 'Española', flag: 'assets/images/flags/spain.svg', lang: 'es' },
    // { text: 'Deutsche', flag: 'assets/images/flags/germany.svg', lang: 'de' },
    // { text: 'Italiana', flag: 'assets/images/flags/italy.svg', lang: 'it' },
    // { text: 'русский', flag: 'assets/images/flags/russia.svg', lang: 'ru' },
    // { text: '中国人', flag: 'assets/images/flags/china.svg', lang: 'ch' },
    // { text: 'français', flag: 'assets/images/flags/french.svg', lang: 'fr' },
    { text: 'Arabic', flag: 'assets/images/flags/ae.svg', lang: 'ar' },
  ];

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
    this.cookieValue == 'ar' ? this.dir = 'rtl' : this.dir = "ltr"

  }
}
