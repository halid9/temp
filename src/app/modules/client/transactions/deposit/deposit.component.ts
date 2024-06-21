import { Component, Input, ViewChild } from "@angular/core";
import { AccountsService } from "src/app/core/services/accounts.service";
import { AccountStatus, AccountType, Platform, TransactionType, TransferMethod, TransferNetwork } from "src/app/shared/helper";
import { AccountCardModel } from "src/app/core/models/account.model";
import { NewTx } from "src/app/core/models/transaction.model";
import { Router } from "@angular/router";
import { TransactionsService } from "src/app/core/services/transactions.service";
import { DataService } from "src/app/core/services/data.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { WizardComponent } from 'angular-archwizard';
import { trigger } from "@angular/animations";
import { TranslateService } from "@ngx-translate/core";
import { Dialogs } from "src/app/shared/dialogs";
import { Animations } from "src/app/shared/animations";
import { CryptoDepositService } from "src/app/core/services/crypto-deposit.service";
import { NotificationsService } from "src/app/core/services/notifications.service";
import { VerificationDetailsComponent } from "../../dashboard/verification-details/verification-details.component";



export type Deposit = {
    transferMethod: TransferMethod | string
    toAccount: AccountCardModel,
    transferNetwork: TransferNetwork | string,
    depositAmount: number,
    transferWallet: string,
    moneyTransferInfo: {
        no: number
        passCode: number
    }
}


@Component({
    selector: 'deposit',
    templateUrl: 'deposit.component.html',
    styleUrls: ['deposit.component.scss'],
    animations: [
        trigger('fadeInOut', Animations.fadeInOutAnimation),
        trigger('slideInOut', Animations.slideInOutAnimation),
    ],
})
export class DepositComponent {

    //------- inputs -------//
    @Input() isDialog = false

    verified = false
    //  ----- initials ------ //
    breadCrumbItems!: Array<{}>;
    transferMethods = TransferMethod
    transferNetworks = TransferNetwork
    cryptoCurrency: string = 'USDT'
    USDT_TRC20_WalletBalance: number = 0
    USDT_TRC20_ProcessingAmount: number = 0
    USDT_TRC20_WalletAddress: string = ''
    refreshFlag = false;
    noPaymentReceived = false;

    //  ------- state --------  //
    @ViewChild('aw') wizard: WizardComponent;
    allowWallet = true
    allowCryptoGateway = true
    error = false
    errorNote: string = ''
    loading = true
    validAmount = true
    currentStep = 1
    walletBalance: number = 0
    accounts: AccountCardModel[]
    accountsToShow: AccountCardModel[]
    serviceCenters = [
        {
            id: 1,
            name: 'center1',
            phone: '084981',
            country: "country",
            city: "city",
            street: "street",
            location: {
                longtude: "",
                latitude: ""
            }
        }
    ]


    // -------- deposit form requirments -------- //
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

    creditCard = {}
    submitted = false
    loadingTx = false
    approved = false

    constructor(private dataService: DataService,
        private txServ: TransactionsService,
        private router: Router,
        private modal: NgbModal,
        private cryptoDepositService: CryptoDepositService,
        private auth: AuthenticationService,
        private notifications: NotificationsService,
        public translate: TranslateService,
        private accountsService: AccountsService) {
    }

    ngOnInit() {
        this.verified = this.auth._currentUser.verificationState.verified
        // this.allowCryptoGateway = this.auth._currentUser.id != 1;
        this.getAvailableCurrency();
        this.getCryptoWallets()
        this.dataService.refreshAccounts()
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
                // this.loading = false
            }
        })

        //  const depositTemp = localStorage.getItem('depositTemp')

        //  if(depositTemp) Dialogs.confirm('you have unfinished deposit do you want to containue?',()=>{
        //     const deposit = JSON.parse(depositTemp)
        //     this.deposit = {...deposit?.deposit}
        //     this.currentStep = deposit.currentStep
        //     this.wizard.goToStep(+this.currentStep-1)
        //  })


        setTimeout(() => {
            this.loading = false
        }, 1500);


        this.breadCrumbItems = [
            { label: 'TRANSACTIONS' },
            { label: 'DEPOSIT', active: true }
        ];
    }

    openVerificationInfo() {
        const modal = this.modal.open(VerificationDetailsComponent, { centered: true })
        modal.componentInstance.verificationState = this.auth._currentUser.verificationState

    }
    accountChanged(v) {
        const currentUser = this.auth._currentUser;

        this.deposit.toAccount = this.accounts.find(a => a.id == v)
        this.walletBalance = this.accounts.find(a => a.platform == Platform.Wallet && a.currency === this.deposit.toAccount.currency)?.balance
            - (this.deposit.toAccount.currency === 'USD' ? currentUser?.usdMinBalance : currentUser?.eurMinBalance)
        // if the account is wallet, then only local transfer is allowed
        // if (this.deposit.toAccount.platform == Platform.Wallet && this.walletBalance > 0) {
        //     this.transferMethod = this.transferMethods.LOCAL_TRANSFER
        //     this.allowWallet = false
        // } else {
        //     this.allowWallet = true
        // }

        // this.allowCryptoGateway = this.deposit.toAccount.currency === 'USD' && false; // disable crypto gateway for now
    }

    goToNextStep() {
        switch (this.currentStep) {
            case 1:
                if (this.deposit.transferMethod) {
                    this.currentStep++
                    this.wizard.goToNextStep()
                    if (this.deposit.transferMethod == this.transferMethods.MONEY_TRANSFER) {
                        this.notifications.notifyAdmin({ title: "deposit", message: "User choosed money transfer" })
                    }

                }

                break;
            case 2:
                if (this.deposit.toAccount) {
                    this.currentStep++
                    this.wizard.goToNextStep()
                }

                break;
            case 3:
                if (this.deposit.transferMethod == this.transferMethods.MONEY_TRANSFER && this.deposit.moneyTransferInfo.no && this.deposit.moneyTransferInfo.passCode) {
                    this.currentStep++
                    this.wizard.goToNextStep()

                }
                else if (this.deposit.transferMethod == this.transferMethods.WALLET && this.validateAmount()) {
                    this.currentStep++
                    this.wizard.goToNextStep()
                }
                else if (this.deposit.transferMethod == this.transferMethods.USDT_TRANSFER && this.deposit.transferNetwork != null) {
                    this.currentStep++
                    this.wizard.goToNextStep()
                }
                else if (this.deposit.transferMethod != this.transferMethods.USDT_TRANSFER &&
                    this.deposit.transferMethod != this.transferMethods.WALLET &&
                    this.deposit.transferMethod != this.transferMethods.MONEY_TRANSFER) {
                    this.currentStep++
                    this.wizard.goToNextStep()

                }
                break;
            case 4:
                this.currentStep++
                this.wizard.goToNextStep()

                break;
            case 5:
                this.currentStep++
                this.wizard.goToNextStep()

                break;
            default:
                break;
        }

        if (this.currentStep == 2 && this.deposit.transferMethod == this.transferMethods.WALLET) {
            this.accountsToShow = this.accountsToShow.filter(a => a.platform != Platform.Wallet)
        }
        else this.accountsToShow = this.accounts.slice()

        console.log(this.currentStep)


        // const depositTemp = {
        //     currentStep: this.currentStep,
        //     deposit:{...this.deposit}
        // }
        // localStorage.setItem('depositTemp',JSON.stringify(depositTemp))
    }

    goToPervStep() {
        this.currentStep--
        if (this.currentStep < 2) {
            this.accountsToShow = this.accounts.slice()
            this.deposit.transferMethod = null
        }

        console.log(this.currentStep)
        this.wizard.goToPreviousStep()
    }
    resetDeposit() {
        this.deposit.toAccount = null
        this.deposit.transferMethod = null
        this.deposit.transferNetwork = null
        this.deposit.transferWallet = null
        this.deposit.depositAmount = null

        this.currentStep = 1
        this.wizard.reset()
    }




    // ------- STEPS VALIDATOR ------ //
    validateMethod(): boolean {
        if (this.deposit.transferMethod) return true
        return false
    }
    validateAccount(): boolean {
        if (this.deposit.toAccount) return true
        return false

    }
    validateAccNetwork(): boolean {
        if (this.deposit.transferMethod == this.transferMethods.USDT_TRANSFER && this.deposit.transferNetwork) return true
        else return this.validateAccount()
    }
    validateAmount() {
        if (this.deposit.depositAmount > 0 &&
            !(this.deposit.transferMethod === this.transferMethods.WALLET && +this.deposit.depositAmount > this.walletBalance)
        ) return true
        if (this.deposit.transferMethod === this.transferMethods.MONEY_TRANSFER) return true
        return false
    }
    validateLastStep() {
        if (this.deposit.transferMethod == this.transferMethods.MONEY_TRANSFER && (!this.deposit.moneyTransferInfo.no || !this.deposit.moneyTransferInfo.passCode)) return false
        if (this.validAmount && this.deposit.transferMethod == this.transferMethods.WALLET && this.deposit.depositAmount > this.walletBalance) return false
        if (this.deposit.transferMethod == this.transferMethods.WALLET && !this.validAmount) return false
        return true
    }


    checkAmountAndGoToNextStep() {
        this.validAmount = this.deposit.depositAmount > 0 ? true : false;

        if (this.validAmount && this.deposit.transferMethod == this.transferMethods.WALLET && this.deposit.depositAmount <= this.walletBalance) {
            this.onSubmit()
        }
        if (this.validAmount && this.deposit.transferMethod != this.transferMethods.USDT_TRANSFER) this.goToNextStep()
        if (this.deposit.transferMethod == this.transferMethods.MONEY_TRANSFER) {
            this.validAmount = true
            this.goToNextStep()
        }

    }



    // -------- SUBMITION ------- //
    async onSubmit() {
        this.notifications.notifyAdmin({ title: "deposit", message: "User submitted for deposit" })
        this.submitted = true
        this.loadingTx = true
        this.error = false
        if (this.deposit.transferMethod == this.transferMethods.MONEY_TRANSFER && (!this.deposit.moneyTransferInfo.no || !this.deposit.moneyTransferInfo.passCode)) return
        const lastStep = this.wizard.getIndexOfStepWithId('last')
        this.wizard.goToStep(lastStep)
        if (this.deposit.transferMethod === this.transferMethods.USDT_TRANSFER) { this.deposit.transferMethod = 'crypto-' + this.deposit.transferNetwork + '-' + this.cryptoCurrency }

        const transaction: NewTx = {
            amount: this.deposit.depositAmount,
            toAccount: this.deposit.toAccount.id,
            transactionType: TransactionType.Deposit,
            method: this.deposit.transferMethod,
            currency: this.deposit.toAccount.currency,
            moneyTransferInfo: this.deposit.moneyTransferInfo

        }


        this.deposit.transferWallet = ''

        await this.txServ.makeTx(transaction).then(result => {
            this.loadingTx = false;
            this.approved = result.approved ? true : false;
            this.error = result.success ? false : true;
            if (this.deposit.transferMethod === this.transferMethods.USDT_TRANSFER && result.success && result.wallet) {
                this.deposit.transferWallet = result.wallet;
            }
            if (this.deposit.transferMethod === this.transferMethods.USDT_TRANSFER && result.success && result.goto) {
                // goto crypto gateway at url result.goto
                window.location.href = result.goto;
                return;
            }

        }).catch(err => {
            this.errorNote = err
            this.error = true
            this.loadingTx = false
        })


    }


    close() {
        this.modal.dismissAll()
    }






    setCreditCard(creditCard) {
        this.creditCard = { ...creditCard }
    }




    goToAccounts() {
        this.router.navigate(['accounts/all-accounts'])
        this.modal.dismissAll()
    }
    goToTxHistory() {
        this.router.navigate(['transactions/transactions-history'])
        this.modal.dismissAll()

    }



    // -------- USDT Control Section -------- // 
    copyToClipboard(): void {
        const walletAddress = document.getElementById('walletAddress') as HTMLInputElement;
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(walletAddress);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();

        if (this.deposit.transferNetwork['code'].toLocaleLowerCase().includes('usdt')) {
            this.notifications.notifyAdmin({ title: "deposit", message: "User copied wallet address" })
        }

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
                this.dataService.refreshAccounts()
            } else {
                Dialogs.error(res.message, this.translate);
            }
            this.refreshTRC20()
        })
    }




    // ---------------------- file upload ----------------- //


    // addFile(event) {
    //     this.dekont = event.target.files[0]
    //     this.validFile = true
    // }

    // handleInputChange(file) {
    //     var file = file;
    //     // var pattern = /image-*/;
    //     var reader = new FileReader();
    //     // if (!file.type.match(pattern)) {
    //     //     alert('invalid format');
    //     //     return;
    //     // }
    //     reader.onloadend = this._handleReaderLoaded.bind(this);
    //     return reader.readAsDataURL(file);
    // }
    // async _handleReaderLoaded(e) {
    //     let reader = e.target;
    //     this.dekontB64 = reader.result

    // }
    // checkDekont(): boolean {

    //     if ((this.later && this.deposit.transferMethod == this.transferMethods.MONEY_TRANSFER) || this.deposit.transferMethod === this.transferMethods.WALLET || this.deposit.transferMethod === this.transferMethods.USDT_TRANSFER || this.deposit.transferMethod == this.transferMethods.VISA_CARD) return true
    //     if (!this.later && this.dekont) return true
    //     return false
    // }









    /////////////////// Crypto Section ///////////////////////
    payLoading: boolean = false
    currencyLoading: boolean = true
    currencies: any[] = []
    filteredNetworks: any[] = []
    searchCurrency: string
    Platform = Platform
    selectedCurrency: any
    payAddress: string = ''
    paymentId: string = ''
    payEstimateAmount: number
    payAmount: number
    minDeposit: number | '' = ''
    expirationEstimateDate: Date
    countdown: string = ''
    paymentProcceced: boolean = false
    private estimatePriceTimeoutId: any;
    networks = []
    filteredCurrencies = []

    getAvailableCurrency() {
        this.cryptoDepositService.getAvailableCurrencies().subscribe(
            {
                next: res => {
                    if (res.currencies) {
                        this.currencies = res.currencies

                        //to group currencies to their networks
                        const groupedCurrencies = res.currencies.reduce((grouped, currency) => {
                            const key = currency.network;
                            if (!grouped[key]) {
                                grouped[key] = [];
                            }
                            grouped[key].push(currency);
                            return grouped;
                        }, {});

                        const sortedCurrencies = Object.entries(groupedCurrencies)
                            .sort((a: [string, any[]], b: [string, any[]]) => b[1].length - a[1].length)
                            .map(([network, currencies]) => ({ network, currencies }));

                        this.networks = sortedCurrencies;
                        this.filterCurrencies();
                        this.currencyLoading = false
                    }
                },
                error: err => {
                    console.log(err)
                    this.networks = []
                }
            }


        );
    }

    filterCurrencies() {
        if (this.searchCurrency) {
            this.filteredNetworks = this.networks.map(network => ({
                network: network.network,
                currencies: network.currencies.filter(currency =>
                    currency.name.toLowerCase().includes(this.searchCurrency.toLowerCase()) || currency.code.toLowerCase().includes(this.searchCurrency.toLowerCase()) ||
                    currency.network?.toLowerCase().includes(this.searchCurrency.toLowerCase())
                )
            })).filter(network => network.currencies.length > 0);
        } else {
            this.filteredNetworks = this.currencies;
        }
    }

    selectCurrency(currency: string) {
        this.payAddress = ''
        this.paymentId = ''
        this.selectedCurrency = currency
        this.deposit.transferNetwork = currency
        this.getMinDeposit()
        // I jjust want to skip the amount step for now
        this.deposit.depositAmount = 1000
        this.submitAmount()
    }

    submitAmount() {
        this.payLoading = true
        this.cryptoDepositService.getPaymentInfo(this.selectedCurrency.code.toLowerCase(), this.deposit.toAccount.id, this.deposit.depositAmount).subscribe(res => {
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

    startCountdown() {
        const intervalId = setInterval(() => {
            const now = new Date();
            const diff = this.expirationEstimateDate.getTime() + 60000 - now.getTime();

            if (diff < 0) {
                clearInterval(intervalId);
                this.countdown = 'Expired, Please try again';
                this.payAddress = ''
                this.paymentId = ''
                this.goToPervStep()
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

    confirmDeposit() {
        this.payLoading = true
        this.cryptoDepositService.updatePaymentInfo(this.paymentId).subscribe(res => {
            if (res.success) {
                if (res.data.proccessed) {
                    this.paymentProcceced = true
                    const lastStep = this.wizard.getIndexOfStepWithId('last')
                    this.wizard.goToStep(lastStep)
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

    getMinDeposit() {
        this.minDeposit = ''
        this.payEstimateAmount = 0
        this.cryptoDepositService.getMinDeposit(this.selectedCurrency.code.toLowerCase()).subscribe(res => {
            if (res.success) {
                this.minDeposit = +res.min_amount
            } else {
                this.minDeposit = ''
            }
            console.log(res)
        });
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
    networkChanged(network) {
        console.log(network)
        this.deposit.transferNetwork = network
        console.log(this.deposit.transferNetwork)
        const currency = this.currencies.find(c => c.code == network)
        this.selectCurrency(currency)
    }
}