import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";
import { AccountGroup } from "src/app/core/models/account-group.model";
import { Method } from "src/app/core/models/method.model";
import { AccountGroupService } from "src/app/core/services/account-group.service";
import { CryptoDepositService } from "src/app/core/services/crypto-deposit.service";
import { TransferMethodsService } from "src/app/core/services/transfer-methods.service";
import { Dialogs } from "src/app/shared/dialogs";
import { Currency, TransferMethod } from "src/app/shared/helper";

@Component({
    selector: "edit-transfer-method",
    templateUrl: "edit-transfer-method.component.html"
})
export class EditTransferMethodComponent {
    @Input() method: Method
    @Input() newMethod = false
    currencies: Currency[]
    saving = false
    constructor(
        private activeModal: NgbActiveModal,
        private translate: TranslateService,
        private methodsService: TransferMethodsService,
        private cryptoDepositService: CryptoDepositService
    ) {

    }
    async ngOnInit() {
        if (this.newMethod) {
            this.method.transferMethod = TransferMethod.CRYPTO
            const currency = await firstValueFrom(this.cryptoDepositService.getAvailableCurrencies())
            this.currencies = currency
        }
    }

    newWarning = null

    networkChanged(currency: string) {
        const selectedCurrency = this.currencies.find(c => c.code == currency)
        this.method.currency = selectedCurrency
        this.method.name = selectedCurrency.name
        this.method.icon = selectedCurrency.logo_url
       
    }
    save() {
        // if(!this.accountGroup.leverages.length) return Dialogs.error("You must add at least 1 leverage!",this.translate)
        this.saving = true
        this.methodsService.addUpdateMethod(this.method).subscribe({
            next: res => {
                if (res)
                    this.activeModal.close()
                Dialogs.success('Transfer method updated!', this.translate)
            },

            error: err => {
                this.saving = false
                Dialogs.error(err, this.translate)

            }
        })
    }
    closeDialog() {
        this.activeModal.dismiss()
    }

    addWarning() {
        if (!this.method.warnings) this.method.warnings = []
        if (!this.newWarning) return Dialogs.error("You must add warning first!", this.translate)
        if (this.method.warnings.includes(this.newWarning)) return Dialogs.error("warning already added!", this.translate)
        this.method.warnings.push(this.newWarning)
        this.newWarning = null
    }
    removeWarning(warning: string) {
        this.method.warnings = this.method.warnings.filter(w => w != warning)
    }





}