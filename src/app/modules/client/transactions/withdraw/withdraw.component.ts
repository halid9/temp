import { Component, ViewChild } from "@angular/core";
import { AccountCardModel } from "src/app/core/models/account.model";
import { AccountsService } from "src/app/core/services/accounts.service";
import { NewTx } from "src/app/core/models/transaction.model";
import { AccountStatus, AccountType, Platform, TransactionType, TransferMethod } from "src/app/shared/helper";
import { TransactionsService } from "src/app/core/services/transactions.service";
import { DataService } from "src/app/core/services/data.service";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { WizardComponent } from "angular-archwizard";
import { trigger } from "@angular/animations";
import { Animations } from "src/app/shared/animations";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CountryCodes } from "src/app/core/helpers/country-code";
import { NotificationsService } from "src/app/core/services/notifications.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { VerificationDetailsComponent } from "../../dashboard/verification-details/verification-details.component";



type Withdraw = {
  transferMethod: TransferMethod,
  fromAccount: AccountCardModel,
  withdrawAmount: number,
  ToWalletAddress: string
}
@Component({
  selector: 'withdraw',
  templateUrl: 'withdraw.component.html',
  styleUrls: ['withdraw.component.scss'],
  animations: [
    trigger('fadeInOut', Animations.fadeInOutAnimation)
  ]
})
export class WithdrawComponent {
  currentStep = 1

  loading = true
  breadCrumbItems!: Array<{}>;
  @ViewChild('aw') wizard: WizardComponent;
  validWalletAddress = false
  transferMethods = TransferMethod
  accounts: AccountCardModel[] = []
  accountsToShow: AccountCardModel[] = []

  countryCodes = CountryCodes
  withdraw: Withdraw = {
    transferMethod: null,
    fromAccount: null,
    withdrawAmount: null,
    ToWalletAddress: null
  }
  countries = []
  cities = []
  states = []
  address = new FormGroup(
    {

      country: new FormControl(null, Validators.required),
      city: new FormControl({ value: null, disabled: true }, Validators.required),
      state: new FormControl({ value: null, disabled: true }, Validators.required)
    }

  )
  validAmount = true
  loadingTx = false
  error = false
  approved = false
  note = ''
  // allowWallet = true
  // allowCryptoGateway = true
  verified = false



  constructor(private dataService: DataService,
    private accountService: AccountsService,
    private auth: AuthenticationService,
    private txServ: TransactionsService,
    private notifications: NotificationsService,
    private router: Router,
    private modal: NgbModal) {
    this.dataService.refreshAccounts()
  }

  ngOnInit() {
    this.verified = this.auth._currentUser.verificationState.verified
    // this.countries = Country.getAllCountries()
    this.countries = this.countryCodes.map(c => {
      const country = {
        name: c.name,
        isoCode: c.iso2
      }
      return country

    })
    this.dataService.accounts$.subscribe(accounts => {
      accounts && accounts.length ? this.accounts = accounts.slice().filter(a => a.status == AccountStatus.Active && a.accountType == AccountType.Live && a.currency == 'USD') : this.accounts = []
      if (this.accounts && this.accounts?.length > 1) {
        this.accounts.sort((a, b) => {
          if (a.platform < b.platform) {
            return 1;
          }
          if (a.platform > b.platform) {
            return -1;
          }
          return 0;
        });
        this.accountsToShow = this.accounts.slice()
        this.loading = false
      }
      setTimeout(() => {
        this.loading = false
      }, 2000);
    })


    this.address.controls['country'].valueChanges.subscribe((country) => {
      console.log(country)
      this.address.controls['city'].reset();
      this.address.controls['city'].disable();
      this.address.controls['state'].reset();
      this.address.controls['state'].disable();

      if (country) {

        this.cities = this.countryCodes.find(c => c.iso2 == country).states.map(s => {
          const city = {
            name: s.name,
            isoCode: s.state_code
          }
          return city
        })

        this.address.controls['city'].enable();
      }
    });

    this.address.controls['city'].valueChanges.subscribe((city) => {
      console.log(city)
      this.address.controls['state'].reset();
      this.address.controls['state'].disable();
      if (city) {
        console.log(city)
        this.address.controls['state'].enable();
      }
    });
   

    /**
      * BreadCrumb
      */
    this.breadCrumbItems = [
      { label: 'TRANSACTIONS' },
      { label: 'WITHDRAW', active: true }
    ];

  }

  openVerificationInfo(){
    const modal = this.modal.open(VerificationDetailsComponent,{centered:true})
    modal.componentInstance.verificationState = this.auth._currentUser.verificationState
  
  }
  async onSubmit() {
    this.notifications.notifyAdmin({ title: "deposit", message: "User submitted for withdraw" })
    this.loadingTx = true
    this.error = false
    this.goToNextStep()
    const transaction: NewTx = {
      amount: this.withdraw.withdrawAmount,
      fromAccount: this.withdraw.fromAccount.id,
      transactionType: TransactionType.Withdraw,
      method: this.withdraw.transferMethod,
      currency: this.withdraw.fromAccount.currency,
      note: this.withdraw.ToWalletAddress,
    }
    await this.txServ.makeTx(transaction).then(result => {
      this.loadingTx = false;
      this.approved = result.approved ? true : false;
      this.error = result.success ? false : true;
    }).catch(err => {
      this.note = err
      this.error = true
      this.loadingTx = false
    })

  }

  checkAmount() {
    this.validAmount = this.withdraw.withdrawAmount > 0 ? true : false;
  }

  validateAmount() {
    if (this.withdraw.transferMethod == this.transferMethods.MONEY_TRANSFER && this.currentStep == 3 && this.withdraw.withdrawAmount <= this.withdraw.fromAccount?.balance && this.withdraw.withdrawAmount > 0) return true
    if (this.withdraw.transferMethod == this.transferMethods.MONEY_TRANSFER && this.address.valid && this.currentStep == 4 && this.withdraw.withdrawAmount <= this.withdraw.fromAccount?.balance && this.withdraw.withdrawAmount > 0) return true
    if (this.withdraw.transferMethod == this.transferMethods.USDT_TRANSFER && this.validWalletAddress &&
      this.withdraw.withdrawAmount <= this.withdraw.fromAccount?.balance && this.withdraw.withdrawAmount > 0) return true
    if (this.withdraw.transferMethod != this.transferMethods.USDT_TRANSFER && this.withdraw.transferMethod != this.transferMethods.MONEY_TRANSFER && this.withdraw.withdrawAmount <= this.withdraw.fromAccount?.balance && this.withdraw.withdrawAmount > 0) return true
    return false
  }
  goToAccounts() {
    this.router.navigate(['accounts/all-accounts'])
    this.modal.dismissAll()

  }
  goToTxHistory() {
    this.router.navigate(['transactions/transactions-history'])
    this.modal.dismissAll()

  }

  checkWalletAddress() {
    this.validWalletAddress = false

    this.accountService.checkTRC20WalletAddress(this.withdraw.ToWalletAddress).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.validWalletAddress = true
      } else {
        this.validWalletAddress = false
      }
    })
  }


  // ----------- wizard control ----------- //
  goToNextStep() {


    switch (this.currentStep) {
      case 1:
        if (this.withdraw.transferMethod) this.currentStep++
        break;
      case 2:
        if (this.withdraw.fromAccount) this.currentStep++
        break;
      case 3:
        if (this.validateAmount()) this.currentStep++
        break;
      case 4:
        if (this.withdraw.transferMethod == this.transferMethods.MONEY_TRANSFER && this.address.valid) this.currentStep++
        else if (this.withdraw.transferMethod != this.transferMethods.MONEY_TRANSFER) this.currentStep++
        break;
      case 5:
        this.currentStep++
        break;
      default:
        break;
    }
    console.log(this.currentStep)
    if (this.currentStep == 2 && this.withdraw.transferMethod == this.transferMethods.WALLET) {
      this.accountsToShow = this.accountsToShow.filter(a => a.platform != Platform.Wallet)
    }
    else this.accountsToShow = this.accounts.slice()
    this.wizard.goToNextStep()
  }
  goToPrevStep() {
    this.currentStep--
    this.wizard.goToPreviousStep()
    switch (this.currentStep) {
      case 1:
        this.withdraw.transferMethod = null
        break;
      case 3:
        this.withdraw.withdrawAmount = null
        this.validAmount = true
        break;
      case 4:
        if (this.withdraw.transferMethod == this.transferMethods.MONEY_TRANSFER) this.address.reset()
        break;
      default:
        break;
    }

  }
  goToStep(stepId: string) {
    const targetStep = this.wizard.getIndexOfStepWithId(stepId)
    this.wizard.goToStep(targetStep)
  }




  // ---------- handling changes functions ----------- //
  accountChanged(v) {
    this.withdraw.fromAccount = this.accounts.find(a => a.id == v)
  }


  // ------------ validators --------- //
  validateAccount(): boolean {
    if (this.withdraw.fromAccount) return true
    return false
  }
  resetWizard() {
    this.withdraw.ToWalletAddress = null
    this.withdraw.fromAccount = null
    this.withdraw.transferMethod = null
    this.withdraw.withdrawAmount = null
    this.wizard.reset()

  }

}