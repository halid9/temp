import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Mt5ManagerService } from 'src/app/modules/manager/services/mt5manager.service';
import { Dialogs } from "src/app/shared/dialogs";
import { AccountType } from 'src/app/shared/helper';

@Component({
  selector: 'app-mt5-account-balance-modal',
  templateUrl: './account-balance-modal.component.html',
  styleUrls: ['./account-balance-modal.component.scss']
})
export class MT5AccountBalanceModalComponent {
  @Input() account: any;
  @Output() accountUpdated = new EventEmitter<boolean>();
  @Input() accountType:AccountType
  operationType: "Balance" | "Credit" | "Charge" | "Correction" | "Bonus" | "Commission" = 'Balance';
  amount: number = 0;
  comment: string = '';
  fromDate: string = new Date().toISOString().split('T')[0];
  toDate: string = new Date().toISOString().split('T')[0];
  accountHistoryList: any[] = [];
  noCheck: boolean = false;

  constructor(public activeModal: NgbActiveModal,
     private mt5ManagerService: Mt5ManagerService,
     private translate:TranslateService) { }

  closeModal() {
    this.activeModal.close();
  }

  deposit() {
    if (this.comment == '') this.comment = 'Deposit';
    this.mt5ManagerService.accountBalance(this.account.user,this.accountType, this.operationType, Math.abs(this.amount), this.comment, this.noCheck).subscribe({
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
    this.mt5ManagerService.accountBalance(this.account.user,this.accountType, this.operationType, -Math.abs(this.amount), this.comment, this.noCheck).subscribe({
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
    this.mt5ManagerService.accountHistory(this.account.user,this.accountType, this.fromDate, this.toDate)
      .subscribe({
        next: data => {
          if (data && data.success) {
            // this.accountHistoryList = data.results;
            this.processMt5Data(data.results);
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

  processMt5Data(deals: any[]) {
    // Temporary object to hold the combined trade information
    const trades = {};

    // Standalone operations like 'Balance' which don't have a corresponding open/close pair
    const standaloneOperations = [];

    // Process each deal
    deals.forEach(deal => {
      // Handle non-trade operations separately
      if (deal.position_id === 0) {
        standaloneOperations.push(deal);
        return;
      }

      // Initialize the trade record if it doesn't exist
      if (!trades[deal.position_id]) {
        trades[deal.position_id] = {
          openDeal: null,
          closeDeals: []
        };
      }

      // Assign the deal to the appropriate trade record
      if (deal.entry === 'In') {
        trades[deal.position_id].openDeal = deal;
      } else if (deal.entry === 'Out') {
        trades[deal.position_id].closeDeals.push(deal);
      }
    });

    // Transform the trades into a combined format
    this.accountHistoryList = Object.keys(trades).flatMap(positionId => {
      const { openDeal, closeDeals } = trades[positionId];

      return closeDeals.map(closeDeal => ({
        time: openDeal ? openDeal.time : closeDeal.time,
        openTime: openDeal ? openDeal.time : '',
        openPrice: openDeal ? openDeal.price : '',
        closeTime: closeDeal.time,
        closePrice: closeDeal.price,
        profit: closeDeal.profit,
        volume: closeDeal.volume,
        symbol: closeDeal.symbol,
        type: openDeal ? openDeal.type : closeDeal.type,
        comment: closeDeal.comment,
        dealId: closeDeal.deal_id,
        positionId: positionId
      }));
    });

    // Add standalone operations to the list
    this.accountHistoryList.push(...standaloneOperations.map(operation => ({
      time: operation.time,
      type: operation.type,
      symbol: operation.symbol,
      volume: operation.volume,
      profit: operation.profit,
      comment: operation.comment,
      dealId: operation.deal_id,
      positionId: 0
    })));

    // Sort by time
    this.accountHistoryList.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }
}
