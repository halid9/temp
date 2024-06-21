import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { DepositComponent } from "./deposit/deposit.component";
import { TransferAccWalletComponent } from "./transfer-acc-wallet/transfer-acc-wallet.component";
import { TxHistoryComponent } from "./tx-history/tx-history.component";
import { WithdrawComponent } from "./withdraw/withdraw.component";
import { DepoComponent } from "./depo/depo.component";

const routes:Route[] =[
    {
        path: 'deposit', component: DepoComponent, pathMatch:"full",
        data: { requiredPermissions: [], animation: 'deposit' },
    },
    {
        path: 'withdraw', component: WithdrawComponent, pathMatch:"full",
        data: { requiredPermissions: [], animation: 'withdraw' },
    },
    {
        path: 'transfer-btween-account-and-wallet', component: TransferAccWalletComponent, pathMatch:"full",
        data: { requiredPermissions: [], animation: 'transfer' }
    },
    {
        path: 'transactions-history', component: TxHistoryComponent, pathMatch:"full",
        data: { requiredPermissions: [], animation: 'tx' }
    },
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class TransactionsRoutingModule{

}