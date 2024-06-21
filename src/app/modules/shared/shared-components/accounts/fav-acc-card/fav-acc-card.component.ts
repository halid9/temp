import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AccountCardModel } from "src/app/core/models/account.model";
import { AccountsService } from "src/app/core/services/accounts.service";
import { DataService } from "src/app/core/services/data.service";
import { Dialogs } from "src/app/shared/dialogs";
import { ChangeFirstNameComponent } from "../../accounts/account-form/change-first-name-form/change-first-name-form.component";
import { ChangeInvestorPasswordComponent } from "../../accounts/account-form/change-investor-password-form/change-investor-password-form.component";
import { ChangeLastNameComponent } from "../../accounts/account-form/change-last-name-form/change-last-name-form.component";
import { ChangeLeverageComponent } from "../../accounts/account-form/change-leverage-form/change-leverage-form.component";
import { ChangeMasterPasswordComponent } from "../../accounts/account-form/change-master-password-form/change-master-password-form.component";
import { ChangeNameComponent } from "../../accounts/account-form/change-name-form/change-name-form.component";
import { ChangeNoteComponent } from "../../accounts/account-form/change-note-form/change-note-form.component";
import { Platform } from "src/app/shared/helper";
import { ChangeFavAccComponent } from "./change-fav-acc/change-fav-acc.component";
import { DepositComponent } from "src/app/modules/client/transactions/deposit/deposit.component";
import { ToastService } from "src/app/account/login/toast-service";

@Component({
    selector:'fav-acc-card',
    templateUrl:"fav-acc-card.component.html"
})
export class FavAccCardComponent{
    Platform = Platform
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

    @Output() favAccChanged = new EventEmitter<number>()
    constructor(private modal: NgbModal,
       private accountsService: AccountsService,
        private dataService: DataService,
         private router: Router,
         private toast:ToastService,
         private translate:TranslateService) { }
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
      Dialogs.confirm(this.accountsService.delete(this.account.id),this.translate, () => {
        this.dataService.refreshAccounts()
      })
  
    }
  
    onCardClick() {
      if (!this.isClickable) return;
      // goto /transactions/transactions-history?account=account.id
      this.router.navigate(['/transactions/transactions-history'], { queryParams: { account: this.account.id } });
    }
  
    copyToClipboard(value: string) {
      this.toast.show('I am a success toast', { classname: 'bg-success text-light', delay: 10000 });
console.log("copied")
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

    changeFavAcc(){
        const modal = this.modal.open(ChangeFavAccComponent,{centered:true})
        modal.closed.subscribe(res=>{
          if(res.success) Dialogs.success('Favorite account updated!',this.translate)
          this.favAccChanged.emit(res.id)
        })
    }
    openDepositForm() {
     
      const modal = this.modal.open(DepositComponent, { centered: true, size: 'xl' })
      modal.componentInstance.isDialog = true
      modal.componentInstance.deposit.toAccount = this.account
  
    }
}