import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Mt4managerService } from 'src/app/modules/manager/services/mt4manager.service';
import { Dialogs } from "src/app/shared/dialogs";

@Component({
  selector: 'app-mt4-account-balance-modal',
  templateUrl: './account-balance-modal.component.html',
  styleUrls: ['./account-balance-modal.component.scss']
})
export class MT4AccountBalanceModalComponent {
  @Input() account: any;
  @Output() accountUpdated = new EventEmitter<boolean>();

  amount: number = 0;
  comment: string = '';
  fromDate: string = new Date().toISOString().split('T')[0];
  toDate: string = new Date().toISOString().split('T')[0];
  accountHistoryList: any[] = [];

  constructor(public activeModal: NgbActiveModal,
     private mt4ManagerService: Mt4managerService,
     private translate:TranslateService) { }

  closeModal() {
    this.activeModal.close();
  }

  deposit() {
    if (this.comment == '') this.comment = 'Deposit';
    this.mt4ManagerService.accountBalance(this.account.user, Math.abs(this.amount), this.comment).subscribe({
      next: response => {
        if (response && response.success) {
          this.accountUpdated.emit(true);
          this.closeModal();
          Dialogs.success('Amount deposited successfully!',this.translate);
        } else {
          Dialogs.error('Failed to deposit the amount. Please try again.',this.translate);
        }
      },
      error: () => {
        Dialogs.error('An error occurred while depositing. Please try again later.',this.translate);
      }
    });
  }

  withdraw() {
    if (this.comment == '') this.comment = 'Withdrawal';
    this.mt4ManagerService.accountBalance(this.account.user, -Math.abs(this.amount), this.comment).subscribe({
      next: response => {
        if (response && response.success) {
          this.accountUpdated.emit(true);
          Dialogs.success('Amount withdrawn successfully!',this.translate);
          this.closeModal();
        } else {
          Dialogs.error('Failed to withdraw the amount. Please try again.',this.translate);
        }
      },
      error: () => {
        Dialogs.error('An error occurred while withdrawing. Please try again later.',this.translate);
      }
    });
  }

  getHistory() {
    this.mt4ManagerService.accountHistory(this.account.user, this.fromDate, this.toDate)
      .subscribe({
        next: data => {
          if (data && data.success) {
            this.accountHistoryList = data.results.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          } else if (data && data.message == "Connection was established successfully, but DealRequest fail(13)") {
            Dialogs.error('No history found for this account in the selected date range.',this.translate);
          } else {
            Dialogs.error('Failed to fetch account history. Please try again.',this.translate);
          }
        },
        error: err => {
          Dialogs.error('An error occurred while fetching account history. Please try again later.',this.translate);
        }
      });
  }
}
