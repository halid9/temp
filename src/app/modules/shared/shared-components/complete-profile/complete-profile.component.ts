import { Component, QueryList, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbCarousel, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CookieService } from "ngx-cookie-service";
import { firstValueFrom } from "rxjs";
import { CountryCodes } from "src/app/core/helpers/country-code";
import { User } from "src/app/core/models/auth.models";
import { AccountsService } from "src/app/core/services/accounts.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Dialogs } from "src/app/shared/dialogs";
import { Functions } from "src/app/shared/functions";
import { AccountType, Address, Platform } from "src/app/shared/helper";
import { minMaxLengthValidator, preventConsecutiveLettersAndSequencesValidator } from "src/app/shared/validators";
// import { Country, State, City } from 'country-state-city';
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'complete-profile',
    templateUrl: 'complete-profile.component.html',
    styleUrls: ['complete-profile.component.scss']
})
export class CompleteProfileComponent {
    year: number = new Date().getFullYear();
    user: User
    completed = false
    profileForm: FormGroup
    consentForm: any = {}
    experienceForm: any = {}
countryCodes  = CountryCodes
    dir = 'ltr'
    cities = []
    docTitle = 'id';
    constructor(private auth: AuthenticationService,
        private accountsService: AccountsService,
        private modal: NgbModal,
    private cookie: CookieService,
        private translate:TranslateService
    ) {

        this.accountForm = new FormGroup({

            accountPlatform: new FormControl(this.platforms.find(p => p.name == 'MT5').value, Validators.required),
            leverage: new FormControl(this.leverages[3].value, Validators.required),
            accountType: new FormControl(AccountType.Demo, Validators.required),
            masterPassword: new FormControl('', [Validators.required, minMaxLengthValidator(8, 20)]),
            cMasterPassword: new FormControl('', [Validators.required, minMaxLengthValidator(8, 20)]),
            accountName: new FormControl('', [Validators.required, preventConsecutiveLettersAndSequencesValidator(), minMaxLengthValidator(0, 15)]),
            investorPassword: new FormControl('')


        })
        this.profileForm = new FormGroup({
            country: new FormControl('', Validators.required),
            city: new FormControl({ value: '', disabled: true }, Validators.required),
            zipCode: new FormControl('', Validators.required),
            streetAdress: new FormControl('', Validators.required)
        })

        this.consentForm.employment = ''
        this.consentForm.incomeSources = []
        this.consentForm.otherIncomeSource = ''

        this.experienceForm.financial_risk = 'no'
        this.experienceForm.financial_experience = 'no'
        this.experienceForm.experience_type = []
        this.experienceForm.otherExperienceType = ''
        this.experienceForm.experience_years = ''

    }

    async ngOnInit() {
        this.dir = this.cookie.get('lang') == 'ar' ? 'rtl' : 'ltr'
        if (!this.auth._currentUser) await this.auth.getCurrentUser()
        this.user = this.auth._currentUser
        const userState = this.user?.verificationState?.state
        if (this.user?.verificationState?.verified) this.completed = true
        if (userState?.completeProfile && userState?.requestLive && this.user?.documents?.length) this.completed = true
        this.countries = this.countryCodes.map(c => {
            const country = {
              name: c.name,
              isoCode: c.iso2
            }
            return country
      
          }) 
        this.profileForm.controls['country'].valueChanges.subscribe((country) => {
            this.profileForm.controls['city'].reset();
            this.profileForm.controls['city'].disable();
            if (country) {
                this.cities = this.countryCodes.find(c => c.iso2 == country).states.map(s => {
                    const city = {
                      name: s.name,
                      isoCode: s.state_code
                    }
                    return city
                  })
                this.profileForm.controls['city'].enable();
            }
        });
    }

    ngAfterViewInit() {
        // Password Validation set
        var passwordInput = document.getElementById("master-password") as HTMLInputElement;
        var cpasswordInput = document.getElementById("c-master-password") as HTMLInputElement;
        var letter = document.getElementById("pass-lower");
        var capital = document.getElementById("pass-upper");
        var number = document.getElementById("pass-number");
        var length = document.getElementById("pass-length");
        var match = document.getElementById("pass-match");
        // When the user clicks on the password field, show the message box
        var focus = function () {
            passwordInput.removeAttribute('readonly')
            let input = document.getElementById("password-contain") as HTMLElement;
            input.style.display = "block"

        };
        passwordInput.onfocus = focus
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
        passwordInput.addEventListener('focus', focus)

        cpasswordInput.onfocus = function () {
            cpasswordInput.removeAttribute('readonly')
        }
        // this.shepherdService.defaultStepOptions = defaultStepOptions;
        // this.shepherdService.modal = true;
        // this.shepherdService.confirmCancel = false;
        // this.shepherdService.addSteps(defaultSteps);
        // this.shepherdService.start();
    }
    
    master = true
    cMaster = true
    investor = true
    submitted = false
    creating = false
    //todo: define type
    platforms = [
        { name: 'MT4', value: Platform.MT4 },
        { name: 'MT5', value: Platform.MT5 },
        //   { name: 'Crypto', value: Platform.Crypto }
    ]
    leverages = [
        { value: 1, name: "1:1" }
        ,
        { value: 10, name: "1:10" }
        ,
        { value: 50, name: "1:50" }
        ,
        { value: 100, name: "1:100" }
    ]
    accountForm: FormGroup
    investorInvalid = false
    hideInvestor = true
    showNavigationArrows: any;
    account: any
    @ViewChildren('carouselInfo') carouselInfo: QueryList<NgbCarousel>;
    @ViewChildren('carouselForm') carouselForm: QueryList<NgbCarousel>;
    step = 1
    files: { image: any, type: string,title:string }[] = []
    saveDocs() {
        if (this.files.length < 3) return Dialogs.error(`You didn't upload all required documents`,this.translate)
        this.finalize()
    }
    addFile(event, type) {
        const file = event.target.files[0]
        const reader = new FileReader();
        reader.onloadend = async (e) => {
            const readerResult = e.target.result as string
            const documentFile = { image: readerResult, type, title:type == 'addressDoc'? 'addressDoc' :this.docTitle+type};
            this.files.some(f => f.type == type) ? this.files.find(f => f.type == type).image = readerResult : this.files.push(documentFile)
        };
        reader.readAsDataURL(file);
    }
    saveAccount() {
        this.submitted = true
        if (this.invalidInvestor()) return
        if (this.accountForm.valid && this.ValidatePassword()) {
            const account = {

                action: 'create',
                platform: parseInt(this.accountForm.controls['accountPlatform'].value),
                leverage: parseInt(this.accountForm.controls['leverage'].value),
                accountType: AccountType.Live,
                accountMasterPassword: this.accountForm.controls['masterPassword'].value,
                accountInvestorPassword: !this.hideInvestor ? this.accountForm.controls['investorPassword'].value : Functions.generateRandomPassword(8),
                currency: "USD",
                group: `demo\\alamiya-Hedged-USD`,
                accountName: this.accountForm.controls['accountName'].value,

            }

            this.account = { ...account }
            this.carouselInfo.forEach((c: NgbCarousel) => { c.next() })
            this.carouselForm.forEach((c: NgbCarousel) => { c.prev() })
            this.submitted = false
            this.step++

        }
    }

    ValidatePassword(): boolean {
        var passwordInput = document.getElementById("master-password") as HTMLInputElement;
        var cpasswordInput = document.getElementById("c-master-password") as HTMLInputElement;
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
    completeLater() {
        Dialogs.confirm('You need live account to start earning',this.translate, () => {
            this.modal.dismissAll()
        })
    }
    generateMasterPassword() {
        const password = Functions.generateRandomPassword()
        this.accountForm.controls['masterPassword'].setValue(password)
        this.accountForm.controls['cMasterPassword'].setValue(password)
        var passwordInput = document.getElementById("master-password") as HTMLInputElement;
        this.master = false
        this.cMaster = false

        passwordInput.value = password;

        // Create and dispatch a new input event
        const foucsEvent = new Event('focus', {
            bubbles: true,
            cancelable: true,
        });
        passwordInput.dispatchEvent(foucsEvent);
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
    }
    generateInvertorPassword() {
        this.accountForm.controls['investorPassword'].setValue(Functions.generateRandomPassword())
        this.investor = false
    }
    next() {
        this.carouselInfo.forEach((c: NgbCarousel) => { c.next() })
        this.carouselForm.forEach((c: NgbCarousel) => { c.prev() })
        this.step++

        console.log(this.step)
    }
    saveExperience() {
        this.submitted = true
        if ((this.experienceForm.financial_experience == 'yes' && this.experienceForm.experience_type.length == 0) ||
            (this.experienceForm.financial_experience == 'no') ||
            (this.experienceForm.experience_years == '') ||
            (this.experienceForm.financial_risk == 'no')) return
        this.submitted = false
        this.carouselInfo.forEach((c: NgbCarousel) => { c.next() })
        this.carouselForm.forEach((c: NgbCarousel) => { c.prev() })
        this.step++
    }
    saveConsent() {
        this.submitted = true
        if (this.consentForm.employment == '' || this.consentForm.incomeSources.length == 0) return
        this.submitted = false
        this.carouselInfo.forEach((c: NgbCarousel) => { c.next() })
        this.carouselForm.forEach((c: NgbCarousel) => { c.prev() })
        this.step++
    }
    toggelInvestor() {
        this.investor = !this.investor
    }
    toggelMaster() {
        this.master = !this.master
    }


    invalidInvestor(): Boolean {
        const length = this.accountForm.controls['investorPassword'].value?.length ?? 0
        this.investorInvalid = length < 8 && length > 0 ? true : false
        return this.investorInvalid
    }

    navToDashboard() {
        this.modal.dismissAll('done')
    }
    err = false
    msg = ''
    async finalize() {
        this.submitted = true
        const address: Address = {
            ...this.profileForm.value,
            country: this.countries.find(c=>c.isoCode == this.profileForm.controls['country'].value).name
        }
        this.carouselInfo.forEach((c: NgbCarousel) => { c.next() })
        this.carouselForm.forEach((c: NgbCarousel) => { c.prev() })
        this.step++
        await this.uploadDocs(this.files).then(async res => {
            if (res == 3) {
                await firstValueFrom(this.accountsService.createAccount(this.account))
                await firstValueFrom(this.auth.updateUser({ address, info: { consent: this.consentForm, experience: this.experienceForm } }))
                console.log(res)
                this.auth.getCurrentUser()
                this.submitted = false
            }

        }
        ).catch(err => {
            this.submitted = false
            this.err = true
            this.msg = err
        })

    }

    /////////to delete/////////
    countries = []
    saveProfile() {
        this.submitted = true
        if (this.profileForm.invalid) return
        this.carouselInfo.forEach((c: NgbCarousel) => { c.next() })
        this.carouselForm.forEach((c: NgbCarousel) => { c.prev() })
        this.step++
    }
    prev() {
        this.carouselInfo.forEach((c: NgbCarousel) => { c.prev() })
        this.carouselForm.forEach((c: NgbCarousel) => { c.next() })
        this.step--
    }

    type: string

    uploadDocs(files: { image: any, type: string,title:string }[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let success = 0
            files.forEach(async (documentFile) => {
                this.auth.updateUser({ documentFile }).subscribe({
                    next: res => {
                        if (res) {
                            console.log(res)
                            success++
                            if (success == files.length) resolve(success)
                        }
                    },
                    error: err => {
                        reject(err)
                    }
                })

            });
        })

    }

    onIncomeSourcesChange(e: Event, value: string) {
        this.submitted = false
        const checkbox = e.target as HTMLInputElement;

        if (checkbox.checked) {
            this.consentForm.incomeSources.push(value);
        } else {
            let index = this.consentForm.incomeSources.indexOf(value);
            this.consentForm.incomeSources.splice(index, 1)
        }
    }

    onExperienceTypeChange(e: Event, value: string) {
        this.submitted = false
        const checkbox = e.target as HTMLInputElement;

        if (checkbox.checked) {
            this.experienceForm.experience_type.push(value);
        } else {
            let index = this.experienceForm.experience_type.indexOf(value);
            this.experienceForm.experience_type.splice(index, 1)
        }
    }
}