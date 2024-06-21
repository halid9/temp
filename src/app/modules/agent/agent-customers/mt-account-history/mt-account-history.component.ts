import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountCardModel } from 'src/app/core/models/account.model';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { Platform } from 'src/app/shared/helper';

@Component({
  selector: 'app-customer-mt-account-history',
  templateUrl: './mt-account-history.component.html',
  styleUrls: ['./mt-account-history.component.scss']
})
export class CustomerMtAccountHistoryComponent {
  Platform = Platform;
  accountId: number;
  account: AccountCardModel;
  MT4AccountHistoryList: any[] = [];
  MT5AccountHistoryList: any[] = [];
  error: string = '';
  // from date is 30 days before today
  fromDate: string = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
  // to date is tomorrow
  toDate: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  constructor(private route: ActivatedRoute, private accountService: AccountsService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.accountId = params['account'] ? +params['account'] : undefined;

      if (!this.accountId) return;

      this.accountService.getAccountById(this.accountId).subscribe({
        next: res => {
          this.error = '';
          this.account = res;
          this.getHistory();
        },
        error: err => {
          this.error = 'An error occurred while fetching account history. Please try again later.';
        }
      })

    });

  }

  accountDescription(account: AccountCardModel): string {
    if (account.platform === Platform.Wallet) {
      return account.currency + ' Wallet'
    } else {
      return (account.login ?? "#NO LOGIN FOUND!") +
        (account.accountName ? '- ' + account.accountName : "") +
        ' - ' + (account.platform == Platform.MT4 ? 'MT4' : 'MT5');
    }
  }

  getHistory() {
    this.error = '';
    
    this.accountService.mtAccountHistory(this.account.id, this.fromDate, this.toDate)
      .subscribe({
        next: data => {
          if (data && data.success) {
            this.error = '';
            if (this.account.platform == Platform.MT5) {
              this.processMt5Data(data.results);
            } else {
              this.MT4AccountHistoryList = data.results.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
            }
          } else if (data && data.message == "Connection was established successfully, but DealRequest fail(13)") {
            this.error = 'No history found for this account in the selected date range.';
          } else {
            this.error = 'Failed to fetch account history. Please try again.';
          }
        },
        error: err => {
          this.error = 'An error occurred while fetching account history. Please try again later.';
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
    this.MT5AccountHistoryList = Object.keys(trades).flatMap(positionId => {
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
    this.MT5AccountHistoryList.push(...standaloneOperations.map(operation => ({
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
    this.MT5AccountHistoryList.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }

}
