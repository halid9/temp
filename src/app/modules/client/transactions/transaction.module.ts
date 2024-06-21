import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { TransactionsRoutingModule } from "./transaction-routing.module";
import { UploadDekontComponent } from "./tx-history/upload-dekont/upload-dekont.component";
import { DepositComponent } from "./deposit/deposit.component";
import { ServiceCentersComponent } from "./service-centers/service-centers.component";
import { TransferAccWalletComponent } from "./transfer-acc-wallet/transfer-acc-wallet.component";
import { TxHistoryComponent } from "./tx-history/tx-history.component";
import { WithdrawComponent } from "./withdraw/withdraw.component";
import { SharedModule } from "src/app/shared/shared.module";
import { QRCodeModule } from "angularx-qrcode";
import { SharedComponentsModule } from "../../shared/shared-components/shared-compoents.module";
import { NgSelectModule } from "@ng-select/ng-select";
// import { CryptoNetworkSelectOptionComponent } from "./network-select-option/network-select-option.component";
import { TransactionsAccountSelectOptionComponent } from "./account-select-option/account-select-option.component";
import { FormsModule } from "@angular/forms";
import { DepoComponent } from "./depo/depo.component";

@NgModule({
    declarations: [
        DepositComponent,
        WithdrawComponent,
        TransferAccWalletComponent,
        TxHistoryComponent,
        ServiceCentersComponent,
        UploadDekontComponent,
        // CryptoNetworkSelectOptionComponent,
        TransactionsAccountSelectOptionComponent,

        //test new deposit component
        DepoComponent,
    ],
    imports: [TransactionsRoutingModule,
        FormsModule,
        SharedModule,
        QRCodeModule,
        SharedComponentsModule,
        NgSelectModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionModule {

}