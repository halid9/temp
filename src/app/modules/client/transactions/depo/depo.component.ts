import { Component, Input } from "@angular/core";
import { AccountStatus, AccountType, Currency, Platform, TransactionType, TransferMethod, TransferNetwork } from "src/app/shared/helper";
import { METHODS } from "./deposit-data";
import { AccountCardModel } from "src/app/core/models/account.model";
import { TranslateService } from "@ngx-translate/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { User } from "src/app/core/models/auth.models";
import { CryptoDepositService } from "src/app/core/services/crypto-deposit.service";
import { Dialogs } from "src/app/shared/dialogs";
import { AccountsService } from "src/app/core/services/accounts.service";
import { NotificationsService } from "src/app/core/services/notifications.service";
import { NewTx } from "src/app/core/models/transaction.model";
import { TransactionsService } from "src/app/core/services/transactions.service";
import { Router } from "@angular/router";
import { Method } from "src/app/core/models/method.model";
import { firstValueFrom } from "rxjs";
import { TransferMethodsService } from "src/app/core/services/transfer-methods.service";


export type Deposit = {
    transferMethod: TransferMethod | string
    toAccount: AccountCardModel,
    transferNetwork: string,
    depositAmount: number,
    transferWallet: string,
    moneyTransferInfo: {
        no: number
        passCode: number
    }
}

@Component({
    selector: "depo",
    templateUrl: 'depo.component.html'
})
export class DepoComponent {
    
    loading = true
    loadingTx = false
    txError = false
    txErrorNote = null
    approved = false
    error = false
    errorMsg = null
    user: User
    @Input() deposit: Deposit = {
        transferMethod: null,
        toAccount: null,
        transferNetwork: null,
        depositAmount: null,
        transferWallet: null,
        moneyTransferInfo: {
            no: null,
            passCode: null
        }
    }
    step = 1
    submitted = false
    methods: Method[] = METHODS
    platform = Platform
    transferMethods = TransferMethod
    accounts: AccountCardModel[] = null
    wallets: AccountCardModel[] = null
    selectedWallet: AccountCardModel = null
    accountsToShow: AccountCardModel[] = []
    selectedMethod: Method
    validAmount = true
    walletBalance = 0




    constructor(private translate: TranslateService,
        private modal: NgbModal,
        private notifications: NotificationsService,
        private router: Router,
        private auth: AuthenticationService,
        private cryptoDepositService: CryptoDepositService,
        private accountsService: AccountsService,
        private txServ: TransactionsService,
        private methodService:TransferMethodsService
    ) {

    }
    async ngOnInit() {
        const tMethods = await firstValueFrom(this.methodService.getMethods())
        this.methods = tMethods.filter(m=>m.active)
        this.getAvailableCurrency();
        this.getCryptoWallets()
        this.user = this.auth._currentUser
        this.accounts = this.sortAccounts(this.user.accounts)
        this.accountsToShow = this.accounts.slice()
        this.wallets = this.accounts.filter(a => a.platform == Platform.Wallet)
        if (this.wallets.length) this.selectedWallet = this.wallets[0]
    }


    //initializ functions
    sortAccounts(accounts: AccountCardModel[]): AccountCardModel[] {
        const filteredAccounts = accounts.filter(a => a.status == AccountStatus.Active && a.accountType == AccountType.Live && a.currency == 'USD')
        if (filteredAccounts && filteredAccounts?.length > 1) {
            filteredAccounts.sort((a, b) => {
                if (a.platform < b.platform) {
                    return 1;
                }
                if (a.platform > b.platform) {
                    return -1;
                }
                return 0;
            });
        }
        return filteredAccounts
    }




    // set valus
    accountChanged(e) {
        this.deposit.toAccount = this.accounts.find(a => a.id == e)

        // get wallet balance if transfer from wallet
        this.walletBalance = this.accounts.find(a => a.platform == Platform.Wallet && a.currency === this.deposit.toAccount.currency)?.balance
            - (this.deposit.toAccount.currency === 'USD' ? this.user?.usdMinBalance : this.user?.eurMinBalance)
        if (this.selectedMethod.transferMethod == this.transferMethods.CRYPTO && this.deposit.transferNetwork) this.submitAmount()
    }


    walletChanged(e?) {
        //filter accounts to show accourding to wallet currency
        if (e) {
            this.selectedWallet = e
        }
        this.accountsToShow = this.accounts.filter(a => a.currency == this.selectedWallet.currency && a.platform != this.selectedWallet.platform)
    }

    setMethod(method: Method) {
        this.deposit.transferMethod = method.transferMethod
        this.selectedMethod = method
        if (method.transferMethod === this.transferMethods.WALLET) {
            this.walletChanged()
        }

    }



    //steps control
    back() {
        //reset deposit
        this.deposit.transferMethod = null
        this.deposit.depositAmount = null
        this.deposit.moneyTransferInfo.no = null
        this.deposit.moneyTransferInfo.passCode = null
        this.deposit.toAccount = null
        this.deposit.transferWallet = null
        this.deposit.transferNetwork = null


        //reset accounts filter
        this.accountsToShow = this.accounts.slice()

        //reset flags
        this.submitted = false
        this.validAmount = true
        this.step = 1
    }

    nextStep() {
        this.step++
    }

    goToTxHistory() {
        this.router.navigate(['transactions/transactions-history'])
        this.modal.dismissAll()
    }

    async submit() {
        this.submitted = true
        switch (this.deposit.transferMethod) {
            case this.transferMethods.LOCAL_TRANSFER:

                if (!this.deposit.toAccount || !this.deposit.depositAmount) return

                break;
            case this.transferMethods.MONEY_TRANSFER:
                if (!this.deposit.toAccount || !this.deposit.depositAmount || !this.deposit.moneyTransferInfo.no || !this.deposit.moneyTransferInfo.passCode) return

                break;
            case this.transferMethods.WALLET:
                if (!this.selectedWallet || !this.deposit.toAccount) return
                break;
            default: return

        }

        this.loadingTx = true
        this.txError = false

        this.notifications.notifyAdmin({ title: "deposit", message: "User submitted for deposit" })

        const transaction: NewTx = {
            amount: this.deposit.depositAmount,
            toAccount: this.deposit.toAccount.id,
            transactionType: TransactionType.Deposit,
            method: this.deposit.transferMethod,
            currency: this.deposit.toAccount.currency,
            moneyTransferInfo: this.deposit.moneyTransferInfo
        }
        this.step++
        await this.txServ.makeTx(transaction).then(result => {
            this.loadingTx = false;
            this.approved = result.approved ? true : false;
            this.txError = result.success ? false : true;
            this.txErrorNote = result?.message

        }).catch(err => {
            this.txErrorNote = err
            this.txError = true
            this.loadingTx = false
        })

    }

    setMethodCrypto() {
        this.selectedMethod = this.methods.find(m => m.transferMethod == this.transferMethods.CRYPTO)
        this.deposit.transferMethod = this.selectedMethod.transferMethod
        this.networkChanged('USDTTRC20')

    }



    currencies: Currency[]
    payAddress = null
    paymentId = null
    selectedCurrency = null
    minDeposit = null
    payEstimateAmount = null
    estimatePriceTimeoutId = null
    payLoading = null
    paymentProcceced = null
    countdown = null
    expirationEstimateDate = new Date()
    payAmount = null
    USDT_TRC20_WalletBalance = null
    USDT_TRC20_ProcessingAmount = null
    USDT_TRC20_WalletAddress = null
    noPaymentReceived = null
    refreshFlag = true



    getAvailableCurrency() {
        this.cryptoDepositService.getAvailableCurrencies().subscribe(
            {
                next: res => {
                    if (res.currencies) {
                        this.currencies = res.currencies
                        this.loading = false
                    }
                },
                error: err => {
                    this.loading = false
                    this.error = true
                    this.errorMsg = err
                }
            }


        );
    }


    networkChanged(currencyCode: string) {
        this.deposit.transferNetwork = currencyCode
        const currency = this.currencies.find(c => c.code == currencyCode)
        this.selectCurrency(currency)
    }



    selectCurrency(currency: Currency) {
        this.payAddress = ''
        this.paymentId = ''
        this.selectedCurrency = currency
        this.deposit.transferNetwork = currency.code
        this.getMinDeposit()
        // I jjust want to skip the amount step for now
        this.deposit.depositAmount = 1000
        this.submitAmount()
    }
    getMinDeposit() {
        this.minDeposit = null
        this.payEstimateAmount = 0
        this.cryptoDepositService.getMinDeposit(this.selectedCurrency.code.toLowerCase()).subscribe(res => {
            if (res.success) {
                this.minDeposit = +res.min_amount
            } else {
                this.minDeposit = null
            }
            console.log(res)
        });
    }
    submitAmount() {
        this.payLoading = true
        if (this.deposit.toAccount) {

            this.cryptoDepositService.getPaymentInfo(this.selectedCurrency.code.toLowerCase(), this.deposit.toAccount?.id, this.deposit.depositAmount).subscribe(res => {
                if (res.success) {
                    this.payAddress = res.data.pay_address
                    this.paymentId = res.data.payment_id
                    this.payAmount = res.data.pay_amount
                    if (this.selectedCurrency.code.toLowerCase() !== 'usdttrc20') {
                        this.expirationEstimateDate = new Date(res.data.expiration_estimate_date)
                        this.startCountdown();
                    }
                    this.payLoading = false
                } else {
                    this.payLoading = false
                    Dialogs.error(res.message, this.translate);
                }
            }, error => {
                this.payLoading = false
                Dialogs.error('An error occurred while getting payment info.', this.translate);
            });
        }

    }



    estimatePrice() {
        clearTimeout(this.estimatePriceTimeoutId);
        this.estimatePriceTimeoutId = setTimeout(() => {
            this.cryptoDepositService.getEstimatedPrice(this.selectedCurrency.code.toLowerCase(), this.deposit.depositAmount).subscribe(res => {
                if (res.success) {
                    this.payEstimateAmount = res.data.estimated_amount;
                } else {
                    console.log(res.message);
                }
            });
        }, 500); // Wait for 500ms before making the request
    }

    confirmDeposit() {
        this.payLoading = true
        this.cryptoDepositService.updatePaymentInfo(this.paymentId).subscribe(res => {
            if (res.success) {
                if (res.data.proccessed) {
                    this.paymentProcceced = true
                    this.step++
                } else {
                    Dialogs.error('Payment not processed yet, Please try again later. Note that some crypto payments may take more time to be processed.', this.translate);
                }
                this.payLoading = false
            } else {
                this.payLoading = false
                Dialogs.error(res.message, this.translate);
            }
        }, error => {
            this.payLoading = false
            Dialogs.error('An error occurred while getting payment info.', this.translate);
        });
    }
    startCountdown() {
        const intervalId = setInterval(() => {
            const now = new Date();
            const diff = this.expirationEstimateDate.getTime() + 60000 - now.getTime();

            if (diff < 0) {
                clearInterval(intervalId);
                this.countdown = 'Expired, Please try again';
                this.payAddress = ''
                this.paymentId = ''
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
                const minutes = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
                const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');

                if (hours === '00') {
                    this.countdown = `${minutes}:${seconds}`;
                } else {
                    this.countdown = `${hours}:${minutes}:${seconds}`;
                }
            }
        }, 1000);
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

    refreshTRC20(): void {
        this.getCryptoWallets()
        this.refreshFlag = true
        this.noPaymentReceived = false
    }

    addToWalletTRC20(): void {
        this.accountsService.processTRC20USDT().subscribe(res => {
            if (res.success) {
                Dialogs.success(res.message, this.translate);
                this.auth.getCurrentUser()

            } else {
                Dialogs.error(res.message, this.translate);
            }
            this.refreshTRC20()
        })
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

        // if (this.deposit.transferNetwork['code'].toLocaleLowerCase().includes('usdt')) {
        this.notifications.notifyAdmin({ title: "deposit", message: "User copied wallet address" })
        // }

    }


}