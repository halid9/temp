import { Component, Input, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
// import { Transaction } from "src/app/core/models/transaction.model";

import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AccountsListService } from '../../../../../core/services/account-list.service';
import {  UserTypes } from 'src/app/shared/helper';
import { NgbdCustomSortableHeader } from 'src/app/core/directives/custom-sortable.directive';
import { ContentService } from 'src/app/core/services/content.service';
import { DataService } from 'src/app/core/services/data.service';
import { AccountListModel } from 'src/app/core/models/account.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Dialogs } from 'src/app/shared/dialogs';
import { AccountsRequestsService } from 'src/app/core/services/accounts-requests.service';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { AddNoteComponent } from 'src/app/modules/shared/shared-components/accounts/add-note/add-note.component';
import { AccountFormComponent } from 'src/app/modules/shared/shared-components/accounts/account-form/account-form.component';
import { ConnectAccountFormComponent } from 'src/app/modules/shared/shared-components/accounts/connect-account-form/connect-account-form.component';

@Component({
  selector: 'account-list',
  templateUrl: 'account-list.component.html',
  styleUrls: ['account-list.component.scss'],
  providers: [ContentService, DecimalPipe]
})
export class AccountsListComponent {
@Input() isTabe = false
  UserTypes = UserTypes
  // bread crumb items
  loading$: Observable<boolean>
  breadCrumbItems!: Array<{}>;
  @Input() singleComponent: boolean = true
  @Input() role = UserTypes.Agent // current user type
  @Input() colsFilter = {}

  @Input() user: string = ''  // requested user full name
  @Input() userId: number     // requested user id
  @Input() userType: UserTypes // requested user type
  @Input() filter = 'All'
  @Input() entries = 10

  AccountsList$!: Observable<AccountListModel[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;

  constructor(public accountsListService: AccountsListService,
    public contentService: ContentService,
    private dataService: DataService,
    private modal: NgbModal,
    private accountRequestService: AccountsRequestsService,
    private accountsService: AccountsService,
    private router: Router,
    private translate:TranslateService) {

    this.AccountsList$ = contentService.contentToVeiw$;
    this.total$ = contentService.total$;
    this.loading$ = contentService.loading$

  }

  ngOnInit(): void {
    this.dataService.refreshAccountsByUserId(this.userId)
    this.dataService.accountsById$.subscribe(accounts => {
      const filterd = accounts.filter(a=>a.status.toLowerCase() == 'active')
      if (this.userId) this.contentService.initContent(filterd) //this.contentService.content = accounts
      console.log(filterd)
      // console.log(accounts)
    })
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Transactions' },
      { label: 'Transactions history', active: true }
    ];
  }

  setType(id: any) {
    this.contentService.filter = id
  }

  do(action: string, param: any) {
    switch (action) {
      case 'setMAMT':
        this.accountsService.setMasterAccountMT(this.userId, +param).subscribe({
          next: res => this.dataService.refreshAccountsByUserId(this.userId),
          error: err => Dialogs.error(err,this.translate)
        });

        break;
      case 'unsetMAMT':
        this.accountsService.unsetMasterAccountMT(this.userId, param).subscribe({
          next: res => this.dataService.refreshAccountsByUserId(this.userId),
          error: err => Dialogs.error(err,this.translate)
        });

        break;
      case 'reject':
        const modal = this.modal.open(AddNoteComponent, { centered: true }).dismissed.subscribe(
          note => {
            if (note) this.accountRequestService.doAction(action, +param, note)
          }
        );
        break;
      default:
        this.accountRequestService.doAction(action, +param).then(res => {
          this.dataService.refreshAccountsRequests()
          Dialogs.success(res,this.translate)
        }).catch(err => { Dialogs.error(err,this.translate) })

    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['userId']) {
      this.dataService.refreshAccountsByUserId(this.userId)
    }
  }
  create() {
    const modal = this.modal.open(AccountFormComponent, { centered: true })
    modal.componentInstance.forUser = this.userId
    modal.dismissed.subscribe(() => {
      this.dataService.refreshAccountsByUserId(this.userId)
    })
  }
  connect() {
    const modal = this.modal.open(ConnectAccountFormComponent, { centered: true })
    modal.componentInstance.forUser = this.userId
    modal.dismissed.subscribe(() => {
      this.dataService.refreshAccountsByUserId(this.userId)
    })
  }
  ngOnDestroy() {

  }

  mtAccountHistory(id: number) {
    // goto /mt-account-history?account=::id
    this.router.navigate(['/transactions/mt-account-history'], { queryParams: { account: id } });
    // dismiss modal
    this.modal.dismissAll()
  }
}
