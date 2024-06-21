import { Component, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
// import { Transaction } from "src/app/core/models/transaction.model";

import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';


import { AccountType, Platform, UserTypes } from 'src/app/shared/helper';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UploadDekontComponent } from './upload-dekont/upload-dekont.component';
import { Dialogs } from 'src/app/shared/dialogs';
import { HttpResponse } from '@angular/common/http';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { ContentService } from 'src/app/core/services/content.service';
import { DataService } from 'src/app/core/services/data.service';
import { TransactionsModel } from 'src/app/core/models/transactions.model';
import { NgbdCustomSortableHeader, SortEvent } from 'src/app/core/directives/custom-sortable.directive';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { AccountCardModel } from 'src/app/core/models/account.model';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountsCardComponent } from 'src/app/modules/shared/shared-components/accounts/account-card/accounts-card.component';
import { AddNoteComponent } from 'src/app/modules/shared/shared-components/accounts/add-note/add-note.component';
import { FileManagerService } from 'src/app/core/services/file-manager.service';
import { ViewContentComponent } from 'src/app/shared/view-content/view-content.component';

@Component({
  selector: 'tx-history',
  templateUrl: 'tx-history.component.html',
  styleUrls: ['tx-history.component.scss'],
  providers: [ContentService, DecimalPipe]
})
export class TxHistoryComponent {
  sortClass = ''
  sortCol = ''
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  loading$: Observable<boolean>
  cols: { name: string, visibale: boolean }[] = [
    { name: 'date', visibale: true },
    { name: 'from', visibale: true },
    { name: 'to', visibale: true },
    { name: 'details', visibale: true },
    { name: 'ref', visibale: true },
    { name: 'type', visibale: true },
    { name: 'amount', visibale: true },
    { name: 'status', visibale: true },
    { name: 'method', visibale: true },
    { name: 'email', visibale: false },
    { name: 'receipt', visibale: false },
    { name: 'currency', visibale: true },
    { name: 'icon', visibale: true },
  ]
  colsToView = {
    date: true,
    from: true,
    to: true,
    details: true,
    ref: true,
    type: true,
    amount: true,
    status: true,
    method: true,
    email: false,
    receipt: false,
    currency: true,
    icon: true
  }

  @Input() intries = 0
  @Input() pageSize = 0
  @Input() title = 'ALLTXS'
  @Input() singleComponent: boolean = true
  @Input() role = 5
  userType = UserTypes
  @Input() filter = 'All'
  @Input() pending = false
  @Input() accountId?: number
  currentUserId: number = 0;
  // Table data
  TransactionList$!: Observable<TransactionsModel[]>;
  uniqueAccounts: AccountCardModel[] = [];
  total$: Observable<number>;
  @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;
  allowApproveDepositToCustomerFromMasterAccount: boolean = false;
  allowApproveDepositToCustomerFromWallet: boolean = false;
  allowApproveWithdrawFromCustomerToMasterAccount: boolean = false;
  allowApproveWithdrawFromCustomerToWallet: boolean = false;
  allowApproveTransferBetweenCustomerAccounts: boolean = false;
  allowApproveDepositToCustomerFromServerCredit: boolean = false;
  allowApproveWithdrawFromCustomerToServerCredit: boolean = false;
  allowApproveWithdraw: boolean = false
  allowApproveDeposit: boolean = false

  constructor(private txService: TransactionsService,
    public contentService: ContentService,
    private dataService: DataService,
    private modal: NgbModal,
    private fileService: FileManagerService,
    private accountService: AccountsService,
    private offcanvasService: NgbOffcanvas,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private translate: TranslateService
  ) {

    this.TransactionList$ = contentService.contentToVeiw$;
    this.total$ = contentService.total$;
    this.loading$ = contentService.loading$

    this.currentUserId = this.auth._currentUser.id;
    this.allowApproveDepositToCustomerFromMasterAccount = this.auth.hasPermissions(['AllowApproveDepositToCustomerFromMasterAccount']);
    this.allowApproveDepositToCustomerFromWallet = this.auth.hasPermissions(['AllowApproveDepositToCustomerFromWallet']);
    this.allowApproveWithdrawFromCustomerToMasterAccount = this.auth.hasPermissions(['AllowApproveWithdrawFromCustomerToMasterAccount']);
    this.allowApproveWithdrawFromCustomerToWallet = this.auth.hasPermissions(['AllowApproveWithdrawFromCustomerToWallet']);
    this.allowApproveTransferBetweenCustomerAccounts = this.auth.hasPermissions(['AllowApproveTransferBetweenCustomerAccounts']);
    this.allowApproveDepositToCustomerFromServerCredit = this.auth.hasPermissions(['AllowApproveDepositToCustomerFromServerCredit']);
    this.allowApproveWithdrawFromCustomerToServerCredit = this.auth.hasPermissions(['AllowApproveWithdrawFromCustomerToServerCredit']);
    this.allowApproveWithdraw = this.allowApproveWithdrawFromCustomerToMasterAccount || this.allowApproveWithdrawFromCustomerToWallet || this.allowApproveWithdrawFromCustomerToServerCredit;
    this.allowApproveDeposit = this.allowApproveDepositToCustomerFromMasterAccount || this.allowApproveDepositToCustomerFromWallet || this.allowApproveDepositToCustomerFromServerCredit;

  }

  ngOnInit(): void {
    this.role = this.auth._currentUser.type
    this.role == this.userType.Agent || this.role == this.userType.Admin ? this.pending = true : this.pending = false
    // this.colsToView = this.cols.slice()
    if (!this.pending) {

      this.route.queryParams.subscribe(params => {
        this.accountId = params['account'] ? +params['account'] : undefined;

        this.dataService.refreshTransactionHistory(this.accountId)
        if (this.pageSize > 0) this.contentService.pageSize = this.pageSize
        this.dataService.transactionHistory$.subscribe(th => {
          if (this.intries > 0) this.contentService.initContent(th.slice(0, this.intries))
          else this.contentService.initContent(th)
        })

      });

    }
    if (this.pending) {
      this.dataService.refreshPendingTransaction()
      if (this.pageSize > 0) this.contentService.pageSize = this.pageSize
      this.dataService.pendingTransactions$.subscribe(th => {
        if (this.intries > 0) this.contentService.initContent(th.slice(0, this.intries))
        else this.contentService.initContent(th)
      })
    }
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'TRANSACTIONS' },
      { label: 'TXHISTORY', active: true }
    ];

    // Subscribe to the combined transaction observable
    this.TransactionList$.subscribe((transactions) => {
      const allAccounts = transactions.flatMap(tx => [tx.fromAccountEntity, tx.toAccountEntity])
        .filter(account => account !== null && account !== undefined); // Filter out nulls if any
      // Use a Map to filter out duplicate accounts based on a unique property, e.g., the account ID
      const uniqueAccountsMap = new Map(allAccounts.map(account => [account.id, account]));
      // Convert the Map values back to an array
      this.uniqueAccounts = Array.from(uniqueAccountsMap.values());

      if (this.accountId) {
        this.uniqueAccounts = this.uniqueAccounts.filter(account => account.id === this.accountId);
      }
    });
  }

  /**
   * Swiper setting
   */
  config = {
    initialSlide: 0,
    slidesPerView: 1
  };

  setType(id: any) {
    this.contentService.filter = id
  }
  do(action: string, id: any) {


    if (action != 'reject') this.txService.doAction(action, id).then(res => {
      Dialogs.success(`Action: ${action} done.`, this.translate)
      this.pending ? this.dataService.refreshPendingTransaction() : this.dataService.refreshTransactionHistory()
    }).catch(err => { Dialogs.error(err, this.translate) })
    else {
      const modal = this.modal.open(AddNoteComponent, { centered: true }).closed.subscribe(
        note => {
          if (note) this.txService.doAction(action, id, note).then(res => {
            Dialogs.success(`Action: ${action} done.`, this.translate)
            this.pending ? this.dataService.refreshPendingTransaction() : this.dataService.refreshTransactionHistory()
          }).catch(err => { Dialogs.error(err, this.translate) })

        }
      )
    }
  }
  doMasterAccount(action: string, id: any) {
    this.txService.doAction(action, id, undefined, undefined, 'MASTERACCOUNT').then(res => {
      Dialogs.success(`Action: ${action} using master account done.`, this.translate)
      this.pending ? this.dataService.refreshPendingTransaction() : this.dataService.refreshTransactionHistory()
    }).catch(err => { Dialogs.error(err, this.translate) })
  }
  doWallet(action: string, id: any) {
    this.txService.doAction(action, id, undefined, undefined, 'WALLET').then(res => {
      Dialogs.success(`Action: ${action} using wallet done.`, this.translate)
      this.pending ? this.dataService.refreshPendingTransaction() : this.dataService.refreshTransactionHistory()
    }).catch(err => { Dialogs.error(err, this.translate) })
  }
  uploadDekont(id: any) {
    const dekont = this.modal.open(UploadDekontComponent, { centered: true }).dismissed.subscribe(d => {
      if (d) {
        this.txService.doAction('upload-receipt', id, undefined, { image: d, type: 'receipt' }).then(res => {
          Dialogs.success(`Upload done.`, this.translate)
          this.dataService.refreshTransactionHistory()
        }).catch(err => { Dialogs.error(err, this.translate) })
      }
    })

  }
  viewDekont(id: string) {
    this.fileService.getFile(id).subscribe(
      {
        next: (res: HttpResponse<Blob>) => {

          const receipt = URL.createObjectURL(res.body)
          const view = this.modal.open(ViewContentComponent, { centered: true, size: 'xl' })
          const contentTypeHeader = res.headers.get('Content-Type');
          view.componentInstance.src = receipt

          if (contentTypeHeader.includes('image')) view.componentInstance.type = 'image'
          else view.componentInstance.type = 'pdf'

        },
        error: err => {
          Dialogs.error(err, this.translate)
        }
      }
    )

  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.sortClass = direction
    this.sortCol = column as string
    this.contentService.sortColumn = column;
    this.contentService.sortDirection = direction;
  }

  accountCard(login: any) {
    this.accountService.getAccountById(login).subscribe({
      next: res => {
        const modal = this.modal.open(AccountsCardComponent, { centered: true })
        modal.componentInstance.account = res
      },
      error: err => {
        Dialogs.error(err, this.translate)
      }
    })
  }

  refresh() {
    this.dataService.refreshTransactionHistory()
  }

  openEnd(content: TemplateRef<any>) {

    this.offcanvasService.open(content, { position: 'end' });
  }

  setCols(save?: boolean) {

    this.cols.map(c => this.colsToView[c.name] = c.visibale)
    if (save) {
      //save cols locally
    }
    this.offcanvasService.dismiss()
  }

  clearFilter() {

  }

  accountDescription(account: AccountCardModel): string {
    if (account.platform == Platform.Wallet) {
      return account.currency + ' Wallet'
    } else {
      return (account.login ?? "#NO LOGIN FOUND!") +
        (account.accountName ? '- ' + account.accountName : "") +
        ' - ' + (account.platform == Platform.MT4 ? 'MT4' : 'MT5');
    }
  }

  paymentMethodDescription(transaction: TransactionsModel) {
    if (transaction.method === 'crypto') {
      if (transaction.paymentInfo) {
        if (transaction.paymentInfo.status === 3) {
          return 'Received by Crypto Gateway';
        } else if (transaction.paymentInfo.status !== 6) {
          return 'Not Received by Crypto Gateway yet';
        }
      }
      return 'Not Received by Crypto Gateway';
    } else {
      return transaction.details ?? '';
    }
  }

}
