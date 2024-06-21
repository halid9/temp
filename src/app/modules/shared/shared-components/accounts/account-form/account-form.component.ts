import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountsService } from "src/app/core/services/accounts.service";
import { AccountType, Platform } from "src/app/shared/helper";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Dialogs } from "src/app/shared/dialogs";
import { minMaxLengthValidator, preventConsecutiveLettersAndSequencesValidator } from "src/app/shared/validators";
import { DataService } from "src/app/core/services/data.service";
import { Functions } from "src/app/shared/functions";
import { CookieService } from "ngx-cookie-service";
import { TranslateService } from "@ngx-translate/core";
import { AccountGroup } from "src/app/core/models/account-group.model";
import { SelectAccountGroupModalComponent } from "./select-account-group-modal.component";


export type NewAccount = {
  accountPlatform: Platform
  firstName: string
  lastName: string
  leverage: number
  accountType: AccountType
  depositAmount: number
  masterPassword: string
  investorPassword: string
  name?: string
  accountName: string
}


@Component({
  selector: 'account-form',
  templateUrl: 'account-form.component.html',
  styleUrls: ['account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
  external = false
  master = true
  dir = 'ltr'
  cMaster = true
  investor = true
  submitted = false
  creating = false
  @Input() forUser: any
  //todo: define type
  platform = Platform
  accountType = AccountType
  selectedCurrency = null
  platforms = [
    { name: 'MT4', value: Platform.MT4 },
    { name: 'MT5', value: Platform.MT5 },
    //   { name: 'Crypto', value: Platform.Crypto }
  ]
  types = [{ name: 'Demo', value: AccountType.Demo }, { name: 'Live', value: AccountType.Live }]
  leverages = [
    { value: 1, name: "1:1" }
    ,
    { value: 10, name: "1:10" }
    ,
    { value: 50, name: "1:50" }
    ,
    { value: 100, name: "1:100" }
  ]
  amounts = [500, 1000, 10000, 100000]
  mt4accountsGroups: AccountGroup[] = []
  mt5accountsGroups: AccountGroup[] = []

  mt4filterdAccountsGroups: AccountGroup[] = []
  mt5filterdAccountsGroups: AccountGroup[] = []
  selectedAccountGroup: AccountGroup = null
  currencies: string[] = []
  @Input() edit = false
  @Input() account: Partial<NewAccount> = {}
  @Input() type: AccountType
  @Input() verified = true
  accountForm: FormGroup
  investorInvalid = false
  hideInvestor = true
  constructor(
    private accountsService: AccountsService,
    private modalRef: NgbModal,
    private auth: AuthenticationService,
    private dataService: DataService,
    public cookieService: CookieService,
    private translate: TranslateService
  ) {

  }


  ngOnInit() {
    this.accountForm = new FormGroup({

      accountPlatform: new FormControl(Platform.MT5, Validators.required),
      leverage: new FormControl(this.leverages[3].value, Validators.required),
      accountType: new FormControl({ value: this.external ? AccountType.Live : AccountType.Demo, disabled: this.external }, Validators.required),
      depositAmount: new FormControl(this.amounts[2]),
      masterPassword: new FormControl('', [Validators.required, minMaxLengthValidator(8, 20)]),
      cMasterPassword: new FormControl('', [Validators.required, minMaxLengthValidator(8, 20)]),
      accountName: new FormControl('', [Validators.required, preventConsecutiveLettersAndSequencesValidator(), minMaxLengthValidator(0, 15)]),
      investorPassword: new FormControl('')


    })
    this.dataService.refresAccountsGroups()
    this.dataService.accountsGroups$.subscribe(groups => {
      this.mt4accountsGroups = groups.filter(g => g.platform == Platform.MT4 && g.enabled)
      this.mt5accountsGroups = groups.filter(g => g.platform == Platform.MT5 && g.enabled)
      const groupsCurrencies = groups.map(g => { return g.currency })
      this.currencies = groupsCurrencies.filter((item, index) => new Set(groupsCurrencies.slice(0, index)).has(item) === false);
      this.currencies = this.currencies.filter(g => g)
      this.selectedCurrency = this.currencies[0]
      this.currencyChanged()
    })

    if (this.type != undefined || this.type != null) this.accountForm.controls['accountType'].setValue(this.type)


    this.dir = this.cookieService.get('lang') == 'ar' ? 'rtl' : 'ltr'

  }
  currencyChanged() {
    this.mt4filterdAccountsGroups = this.mt4accountsGroups.filter(g => g.currency == this.selectedCurrency)
    this.mt5filterdAccountsGroups = this.mt5accountsGroups.filter(g => g.currency == this.selectedCurrency)
    this.selectedAccountGroup = this.accountForm.controls['accountPlatform'].value == Platform.MT4 ? this.mt4filterdAccountsGroups[0] : this.mt5filterdAccountsGroups[0]
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
  }
  saveAccount() {
    this.submitted = true
    if (this.accountForm.controls['accountType'].value == 1 && !this.verified) return Dialogs.error(`Your Account is not verified yet! you can't create live accounts`, this.translate)
    if (this.invalidInvestor()) return

    if (this.accountForm.valid && this.ValidatePassword()) {
      this.creating = true
      const account = {

        action: 'create',
        platform: parseInt(this.accountForm.controls['accountPlatform'].value),
        leverage: parseInt(this.accountForm.controls['leverage'].value),
        accountType: parseInt(this.accountForm.controls['accountType'].value),
        balance: parseInt(this.accountForm.controls['accountType'].value) == 0 ? this.accountForm.controls['depositAmount'].value : null,
        accountMasterPassword: this.accountForm.controls['masterPassword'].value,
        accountInvestorPassword: !this.hideInvestor ? this.accountForm.controls['investorPassword'].value : Functions.generateRandomPassword(8),
        currency: "USD",
        group: (parseInt(this.accountForm.controls['accountType'].value) == 1 && this.selectedAccountGroup && this.selectedAccountGroup.name) ? this.selectedAccountGroup.name : `demo\\alamiya-Hedged-USD`,
        accountName: this.accountForm.controls['accountName'].value,
        user_Id: this.forUser,
        external: this.external

      }
      this.accountsService.createAccount(account).subscribe({
        next: res => {
          if (res)

            this.dataService.refreshAccounts()
          Dialogs.success('Account created successfully!', this.translate)
          this.modalRef.dismissAll()
        },
        error: err => {
          this.creating = false
          Dialogs.error(err, this.translate)
        }
      })



    }
  }
  close() {
    this.modalRef.dismissAll()
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
  selectAcountGroup() {
    const modal = this.modalRef.open(SelectAccountGroupModalComponent, { centered: true, size: 'xl' })
    modal.componentInstance.accountGroups = this.accountForm.controls["accountPlatform"].value == 0 ? this.mt4filterdAccountsGroups : this.mt5filterdAccountsGroups


    modal.closed.subscribe(res => {
      this.selectedAccountGroup = res
    })
  }
}