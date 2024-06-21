import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, firstValueFrom } from "rxjs";
import { ConnectAccountModel } from "src/app/core/models/connect-account.model";
import { AccountsService } from "src/app/core/services/accounts.service";
import { ContentService } from "src/app/core/services/content.service";
import { Dialogs } from "src/app/shared/dialogs";
import { Platform } from "src/app/shared/helper";
import * as XLSX from 'xlsx';




@Component({
  selector: "connecting-status",
  templateUrl: 'connecting-status.component.html',
  styleUrls: ['connecting-status.component.scss'],
  providers: [ContentService]
})
export class ConnectingStatusComponent {
  @Input() accounts: ConnectAccountModel[] = []
  success = 0
  failed: ConnectAccountModel[] = []
  connectingAccount: ConnectAccountModel
  percent = 0
  step = 0
  constructor(private modal: NgbModal, private accountsService: AccountsService) {

  }


  async ngOnInit() {
    if (this.accounts.length) await this.connectAccounts()
  }
  //todo: combine latest 
  async connectAccounts() {
    this.step = Math.round(100 / this.accounts.length)
    const connectNextAccount = async (index) => {
      if (index < this.accounts.length) {
        const r = this.accounts[index];
        this.connectingAccount = { ...r };
        const a = { login: parseInt(r.login), accountMasterPassword: 'As159!@#', accountInvestorPassword: 'As159!@#', platform: r.platform == 'MT4' ? Platform.MT4 : Platform.MT5, external: true };

        try {
          const res = await firstValueFrom(this.accountsService.connectAccount({ ...a, action: 'connect' }));
          this.success++;
        } catch (err) {
          r.note = err;
          this.failed.push(r);
        }

        this.percent += this.step
        this.percent > 100 ? this.percent = 100 : this.percent;

        if ((this.success + this.failed.length) == this.accounts.length) {
          this.percent = 100;
          setTimeout(() => {
            this.modal.dismissAll(this.failed);
          }, 1000);
        }

        await connectNextAccount(index + 1);
      }
    };

    await connectNextAccount(0);
  }

}