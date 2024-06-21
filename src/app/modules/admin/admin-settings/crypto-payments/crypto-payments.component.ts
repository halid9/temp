import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { Dialogs } from 'src/app/shared/dialogs';

@Component({
  selector: 'app-admin-settings-crypto-payments',
  templateUrl: './crypto-payments.component.html',
  styleUrls: ['./crypto-payments.component.scss']
})
export class AdminSettingsCryptoPaymentsComponent {

  systemWallets: any[] = [];
  totalTrxBalance: number = 0;
  totalUsdtBalance: number = 0;
  totalUsdtProcessing: number = 0;
  TRX_TRC20_WalletBalance: number = 0
  USDT_TRC20_WalletBalance: number = 0
  TRX_TRC20_WalletAddress: string = ''

  constructor(private accountsService: AccountsService,private translate:TranslateService) {

    this.refreshTRC20()

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
    // this.getCryptoWallets()
    this.getSystemWallets()
  }

  processTRC20USDT(): void {
    this.accountsService.processSystemTRC20USDT().subscribe(res => {
      // console.log(res);
      if (res.success) {
        Dialogs.success(res.message,this.translate);
      } else {
        Dialogs.error(res.message,this.translate);
      }
      this.refreshTRC20()
    });
  }

  getSystemWallets() {
    this.accountsService.getSystemWallets().subscribe((res: any) => {
      this.systemWallets = res;
      this.totalTrxBalance = 0;
      this.totalUsdtBalance = 0;
      this.totalUsdtProcessing = 0;
      this.systemWallets.forEach((wallet: any) => {
        this.totalTrxBalance += +wallet.last_trx_balance;
        this.totalUsdtBalance += +wallet.last_usdt_balance;
        this.totalUsdtProcessing += +wallet.used_usdt_balance;
      });
      console.log(this.systemWallets);

      const wallet = res.find(w => w.user.id == 1 && w.network == 'TRC20')
      if (!wallet) return

      this.TRX_TRC20_WalletBalance = +wallet.last_trx_balance
      this.USDT_TRC20_WalletBalance = +wallet.last_usdt_balance
      this.TRX_TRC20_WalletAddress = wallet.address
      console.log(this.USDT_TRC20_WalletBalance);
    });
  }

  resetCryptoPaymentsError() {
    this.accountsService.resetCryptoPaymentsError().subscribe(res => {
      if (res.success) {
        Dialogs.success(res.message,this.translate);
      } else {
        Dialogs.error(res.message,this.translate);
      }
    });
  }

  // getCryptoWallets() {
  //   this.accountsService.getUserCryptoWallets().subscribe(res => {
  //     const wallet = res.find(w => w.network == 'TRC20')
  //     if (!wallet) return

  //     this.TRX_TRC20_WalletBalance = +wallet.last_trx_balance
  //     this.USDT_TRC20_WalletBalance = +wallet.last_usdt_balance
  //     this.TRX_TRC20_WalletAddress = wallet.address
  //   })
  // }
}
