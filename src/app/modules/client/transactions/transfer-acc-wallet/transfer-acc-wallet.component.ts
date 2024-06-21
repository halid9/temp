import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AccountsService } from "src/app/core/services/accounts.service";
import { AccountCardModel } from "src/app/core/models/account.model";
import { NewTx } from "src/app/core/models/transaction.model";
import { AccountStatus, AccountType, Platform, TransactionType } from "src/app/shared/helper";
import { firstValueFrom } from "rxjs";
import { TransactionsService } from "src/app/core/services/transactions.service";
import { DataService } from "src/app/core/services/data.service";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'transfer-acc-wallet',
    templateUrl: 'transfer-acc-wallet.component.html',
    styleUrls: ['transfer-acc-wallet.component.scss']
})
export class TransferAccWalletComponent {
    breadCrumbItems!: Array<{}>;
    fromAccount: AccountCardModel
    toAccount: AccountCardModel
    // transferForm: FormGroup
    accounts: AccountCardModel[] = []
    toAccounts: AccountCardModel[] = []
    typeError: boolean = false
    loading = true
    loadingTx = false
    error = false
    approved = false
    note = ''
    validAmount = true
    amount: number = 0

    constructor(private dataService: DataService, private txServ: TransactionsService, private router: Router, private modal: NgbModal) {
        this.dataService.refreshAccounts()
    }

    ngOnInit() {
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
            }
            this.loading = false
        })

        /**
          * BreadCrumb
          */
        this.breadCrumbItems = [
            { label: 'TRANSACTIONS' },
            { label: 'TRANSFERBTWEENACCOUNTSANDWALLETS', active: true }
        ];
    }

    // get f() { return this.transferForm.controls }
    async onSubmit() {
        // if (this.transferForm.valid) {
        this.loadingTx = true
        this.error = false

        const transaction: NewTx = {
            // amount: this.transferForm.controls['amount'].value,
            // fromAccount: this.transferForm.controls['from'].value,
            // toAccount: this.transferForm.controls['to'].value,
            amount: this.amount,
            fromAccount: this.fromAccount.id,
            toAccount: this.toAccount.id,
            transactionType: TransactionType.Transfer,
            method: 'internalTransfer',
            currency: this.fromAccount.currency
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
        //     this.transferForm.reset()
        // }

    }
    validateFrom(): boolean {
        if (this.fromAccount && this.fromAccount.balance > 0) return true
        return false
    }
    validateTo(): boolean {
        if (this.fromAccount && this.toAccount && this.fromAccount.currency == this.toAccount.currency && this.fromAccount.id != this.toAccount.id) return true
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
    FromAccountChanged(v: number) {
        this.fromAccount = this.accounts.find(a => a.id == v)
        this.toAccounts = this.accounts.filter(a => a.id != this.fromAccount.id && a.currency == this.fromAccount.currency)
        // this.f['to'].setValue(this.toAccounts[0].id)
    }
    ToAccountChanged(v) {
        this.toAccount = this.accounts.find(a => a.id == v)
    }

    validateAmount() {
        if (this.amount > 0 && this.amount <= this.fromAccount?.balance) return true
        // if (this.f['amount'].value > 0 && this.f['amount'].value <= this.fromAccount?.balance) return true
        return false
    }

    checkAmount() {
        this.validAmount = this.amount > 0 && this.amount < this.fromAccount.balance ? true : false;
        // this.validAmount = this.transferForm.get('amount').value && this.transferForm.get('amount').value > 0 && this.transferForm.get('amount').value < this.fromAccount.balance ? true : false;
    }

    typeCheck() {
        if (this.fromAccount && this.toAccount && this.fromAccount.currency !== this.toAccount.currency) this.typeError = true
    }

    accountDescription(account: AccountCardModel): string {
        if (account.platform == Platform.Wallet) {
            return account.currency + ' Wallet - Balance: ' + account.balance + account.currency
        } else {
            return (account.login ?? "#NO LOGIN FOUND!") +
                (account.accountName ? '- ' + account.accountName : "") +
                ' - Balance: ' + account.balance + account.currency + ' ' +
                (account.platform == Platform.MT4 ? 'MT4' : 'MT5') + ' ' +
                (account.accountType == AccountType.Demo ? 'Demo' : 'Live');
        }
    }
}