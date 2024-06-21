import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountCardModel } from "src/app/core/models/account.model";
import { AccountsService } from "src/app/core/services/accounts.service";
import { Dialogs } from "src/app/shared/dialogs";
import { ChangeFirstNameComponent } from "../account-form/change-first-name-form/change-first-name-form.component";
import { ChangeInvestorPasswordComponent } from "../account-form/change-investor-password-form/change-investor-password-form.component";
import { ChangeLastNameComponent } from "../account-form/change-last-name-form/change-last-name-form.component";
import { ChangeLeverageComponent } from "../account-form/change-leverage-form/change-leverage-form.component";
import { ChangeMasterPasswordComponent } from "../account-form/change-master-password-form/change-master-password-form.component";
import { ChangeNameComponent } from "../account-form/change-name-form/change-name-form.component";
import { ChangeNoteComponent } from "../account-form/change-note-form/change-note-form.component";
import { DataService } from "src/app/core/services/data.service";
import { Router } from "@angular/router";
import { Platform } from "src/app/shared/helper";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'accounts-card',
  templateUrl: 'accounts-card.component.html',
  styleUrls: ['accounts-card.component.scss']
})
export class AccountsCardComponent {
  Platform = Platform
  qrAddress = ''
  @Input() isClickable = false
  @Input() deleted = false
  @Input() account: AccountCardModel = {
    id: 0,
    accountName: '',
    login: 0,
    accountType: 0,
    status: 0,
    balance: 0,
    leverage: 0,
    free_margin: 0,
    equity: 0,
    margin: 0,
    margin_level: 0,
    currency: '',
    platform: 0,
    group: '',

  }
  constructor(private modal: NgbModal,
    private accountsService: AccountsService,
    private dataService: DataService,
    private router: Router,
    private translate: TranslateService) { }

  ngOnInit() {
    if (this.account.platform === Platform.MT5) {
      this.accountsService.getRQCode(this.account.id).subscribe((res: any) => {
        if (res.success) {
          this.qrAddress = atob(res.result);
        }
      });
    }
  }

  changeMasterPassword() {
    const modal = this.modal.open(ChangeMasterPasswordComponent, { centered: true })
    modal.componentInstance.accountId = this.account.id
  }

  changeInvestorPassword() {
    const modal = this.modal.open(ChangeInvestorPasswordComponent, { centered: true })
    modal.componentInstance.accountId = this.account.id
  }
  changeName() {
    const modal = this.modal.open(ChangeNameComponent, { centered: true })
    modal.componentInstance.accountId = this.account.id

    modal.dismissed.subscribe({
      next: () => {
        this.dataService.refreshAccounts()
      }
    });
  }
  changeNote() {
    const modal = this.modal.open(ChangeNoteComponent, { centered: true })
    modal.componentInstance.accountId = this.account.id
  }
  changeLeverage() {
    const modal = this.modal.open(ChangeLeverageComponent, { centered: true })
    modal.componentInstance.accountId = this.account.id
    modal.componentInstance.leverage = this.account.leverage

    modal.dismissed.subscribe({
      next: () => {
        this.dataService.refreshAccounts()
      }
    });

  }

  changeFirstName() {
    const modal = this.modal.open(ChangeFirstNameComponent, { centered: true })
    modal.componentInstance.accountId = this.account.id
  }
  changeLastName() {
    const modal = this.modal.open(ChangeLastNameComponent, { centered: true })
    modal.componentInstance.accountId = this.account.id
  }

  deleteAccount() {
    Dialogs.confirm(this.accountsService.delete(this.account.id), this.translate, () => {
      this.dataService.refreshAccounts()
    })

  }

  onCardClick() {
    if (!this.isClickable) return;
    // goto /transactions/transactions-history?account=account.id
    this.router.navigate(['/transactions/transactions-history'], { queryParams: { account: this.account.id } });
  }

  copyToClipboard(value: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}