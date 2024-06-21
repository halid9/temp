import { Component } from "@angular/core";
// import { AccountCardModel } from "../../../core/models/account.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountStatus, Platform } from "../../../shared/helper";
// import { AccountsService } from "../../../core/services/accounts.service";
import { AuthenticationService } from "../../../core/services/auth.service";
// import { User } from "core/models/auth.models";
// import { DataService } from "../../../core/services/data.service";
import { TranslateService } from '@ngx-translate/core';
import { Dialogs } from "../../../shared/dialogs";
import { ConnectAccountFormComponent } from "../../shared/shared-components/accounts/connect-account-form/connect-account-form.component";
import { AccountFormComponent } from "../../shared/shared-components/accounts/account-form/account-form.component";
import { DepositComponent } from "../transactions/deposit/deposit.component";
import { User } from "../../../store/Authentication/auth.models";

@Component({
  selector: 'accounts',
  templateUrl: 'accounts.component.html',
  styleUrls: ['accounts.component.scss']
})
export class AccountsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  masterSelected!: boolean;
  checkedList: any;
  USDT_TRC20_WalletBalance: number = 0
  USDT_TRC20_ProcessingAmount: number = 0
  USDT_TRC20_WalletAddress: string = ''
  refreshFlag = false;
  noPaymentReceived = false;

  config = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 25,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
      1599: {
        slidesPerView: 4,
      }
    }
  };
  mt4Accounts: AccountCardModel[] = []
  mt5Accounts: AccountCardModel[] = []

  user: User

  walletAccounts: AccountCardModel[] = []
  deletedAccounts: AccountCardModel[] = []

  accounts: AccountCardModel[] = []
  status = AccountStatus
  constructor(
    public translate: TranslateService,
    private modal: NgbModal,
    private accountsService: AccountsService,
    private auth: AuthenticationService,
    private dataService: DataService,
    ) {

    this.initAccounts()
    this.getCryptoWallets()
    this.getDeletedAccounts()
  }
  ngOnInit() {
    this.user = this.auth._currentUser
    /**
      * BreadCrumb
      */
    this.breadCrumbItems = [
      { label: 'ACCOUNTS' }

    ];

  }

  initAccounts(accounts?: AccountCardModel[]) {
    if (!accounts) {
      this.dataService.refreshAccounts()
      this.dataService.accounts$.subscribe(accounts => {
        const internalAccounts = accounts.filter(a => !a.external)
        // if (accounts && accounts.length) {
        // this.accountsService.accounts = accounts.slice()

        // Sort accounts so thatmaster accounts come first
        this.accountsService.accounts = internalAccounts.slice().sort((a, b) => {
          // Define the sorting logic
          const isAMaster = a.masterAccountMT5 || a.masterAccountMT4;
          const isBMaster = b.masterAccountMT5 || b.masterAccountMT4;

          if (isAMaster && !isBMaster) {
            // a should come before b
            return -1;
          } else if (!isAMaster && isBMaster) {
            // b should come before a
            return 1;
          }
          // If neither or both are master accounts, maintain original order
          return 0;
        });

        this.accounts = this.accountsService.accounts.filter(a => a.platform != Platform.Wallet && a.status != this.status.Pending)
        // this.mt4Accounts = this.accounts.filter(a => a.platform == Platform.MT4 && a.status != this.status.Pending)
        // this.mt5Accounts = this.accounts.filter(a => a.platform == Platform.MT5 && a.status != this.status.Pending)
        this.walletAccounts = this.accountsService.accounts.filter(a => a.platform == Platform.Wallet && a.status != this.status.Pending && a.currency == 'USD')
        // return
        // }
      })

    }
    else {

      this.walletAccounts = accounts.filter(a => a.platform == Platform.Wallet && a.status != this.status.Pending)
      this.accounts = accounts.filter(a => a.platform != Platform.Wallet && a.status != this.status.Pending)
      // this.mt4Accounts = accounts.filter(a => a.platform == Platform.MT4 && a.status != this.status.Pending)
      // this.mt5Accounts = accounts.filter(a => a.platform == Platform.MT5 && a.status != this.status.Pending)
    }

  }
  connectAccountForm() {
    this.modal.open(ConnectAccountFormComponent, { centered: true })

  }

  opendialog() {
    const modal = this.modal.open(AccountFormComponent, { centered: true })
    modal.componentInstance.verified = this.user.verificationState.verified ? true : this.user.verificationState.state.verifyDocs
  }

  getCryptoWallets() {
    this.accountsService.getUserCryptoWallets().subscribe(res => {
      // res is array of wallets  
      // search for TRC20 USDT wallet
      const wallet = res.find(w => w.network == 'TRC20')
      if (!wallet) return

      this.USDT_TRC20_WalletBalance = +wallet.last_usdt_balance
      this.USDT_TRC20_ProcessingAmount = +wallet.used_usdt_balance
      this.USDT_TRC20_WalletAddress = wallet.address
      this.noPaymentReceived = this.refreshFlag && this.USDT_TRC20_ProcessingAmount == 0 && this.USDT_TRC20_WalletBalance == 0
    })
  }
  openDepositForm(fromVerify?: boolean) {

    const modal = this.modal.open(DepositComponent, { centered: true, size: 'xl' })
    modal.componentInstance.isDialog = true

  }
  copyToClipboard(): void {
    const walletAddress = document.getElementById('walletAddress') as HTMLInputElement;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(walletAddress);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();

  }

  refreshTRC20(): void {
    this.getCryptoWallets()
    this.refreshFlag = true
    this.noPaymentReceived = false
  }

  addToWalletTRC20(): void {
    this.accountsService.processTRC20USDT().subscribe(res => {
      if (res.success) {
        Dialogs.success(res.message,this.translate);
        this.dataService.refreshAccounts()
      } else {
        Dialogs.error(res.message,this.translate);
      }
      this.refreshTRC20()
    })
  }

  getDeletedAccounts() {
    this.accountsService.getDeletedAccounts().subscribe(res => {
      this.deletedAccounts = res
    })
  }
}