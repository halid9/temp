import { Component, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserTypes } from 'src/app/shared/helper';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgbdCustomSortableHeader, SortEvent } from 'src/app/core/directives/custom-sortable.directive';
import { ContentService } from 'src/app/core/services/content.service';
import { DataService } from 'src/app/core/services/data.service';
import { Dialogs } from 'src/app/shared/dialogs';
import { AccountRequestModel } from 'src/app/core/models/account-request.model';
import { AccountsRequestsService } from 'src/app/core/services/accounts-requests.service';
import { TranslateService } from '@ngx-translate/core';
import { AddNoteComponent } from 'src/app/modules/shared/shared-components/accounts/add-note/add-note.component';
import { ApproveAccountRequestModalComponent } from 'src/app/modules/shared/shared-components/accounts/approve-modal/approve-modal.component';
import { AccReqUserInfoComponent } from 'src/app/modules/shared/shared-components/acc-req-user-info/acc-req-user-info.component';

@Component({
    selector: 'agent-requests',
    templateUrl: 'agent-requests.component.html',
    styleUrls: ['agent-requests.component.scss']
})
export class AgentRequestsComponent {
    sortClass = ''
    sortCol = ''
    // bread crumb items
    breadCrumbItems!: Array<{}>;
  
    @Input() singleComponent: boolean = true
    loading$: Observable<boolean>
    dir = ''
    // Table data
    ContentList$!: Observable<AccountRequestModel[]>;
    total$: Observable<number>;
    @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;
    @Input() role: UserTypes = UserTypes.Customer
    @Input() allRequests = false
    userType = UserTypes
  
    canApproveDecline = false
  
    cols: { name: string, visibale: boolean }[] = [
      { name: 'user', visibale: true },
      { name: 'date', visibale: true },
      { name: 'accountLogin', visibale: true },
      { name: 'accountName', visibale: true },
      { name: 'accountType', visibale: true },
      { name: 'platform', visibale: true },
      { name: 'status', visibale: true },
      { name: 'note', visibale: true },
      { name: 'action', visibale: true },
    ]
    colsToView = {
      user: true,
      date: true,
      accountLogin: true,
      accountType: true,
      platform: true,
      ref: true,
      type: true,
      status: true,
      note: true,
      action: true,
      accountName: true,
    }
  
    constructor(private accountsReqService: AccountsRequestsService,
      public contentService: ContentService,
      private auth: AuthenticationService,
      private dataService: DataService,
      private modal: NgbModal,
      private translateService: TranslateService,
      private offcanvasService: NgbOffcanvas,
    ) {
      this.ContentList$ = contentService.contentToVeiw$;
      this.total$ = contentService.total$;
      this.loading$ = contentService.loading$
      this.role = this.auth._currentUser.type
      this.canApproveDecline = this.auth.hasPermissions(['CreateAccount']) && this.role != UserTypes.Customer
    }
  
    ngOnInit(): void {
    
        this.initRequests()
      
      /**
      * BreadCrumb
      */
      this.breadCrumbItems = [
        { label: 'ACCOUNTS' },
        { label: 'ACCREQS', active: true }
      ];
    }
  initRequests(){
      this.dataService.refreshAdminAgentAccountsRequests()
      this.dataService.adminAgentAccountsRequests$.subscribe(ar => {
        this.contentService.initContent(ar)
      })
  }
    /**
     * Swiper setting
     */
    config = {
      initialSlide: 0,
      slidesPerView: 1
    };
    async do(action: string, id: any) {
      if (action != 'reject') {
  
        await this.accountsReqService.doAction(action, id).then(res => {
          this.role == 5 ? this.dataService.refreshAccountsRequests() : this.dataService.refreshAdminAgentAccountsRequests()
          const msg = action == 'cancel' ? 'canceled' : action == 'approve' ? 'approved' : 'retried'
          Dialogs.success(`Request ${msg}!`, this.translateService)
        }).catch(err => {
          this.role == 5 ? this.dataService.refreshAccountsRequests() : this.dataService.refreshAdminAgentAccountsRequests()
  
          Dialogs.error(err, this.translateService)
        })
  
      }
      else {
        const modal = this.modal.open(AddNoteComponent, { centered: true }).closed.subscribe(
          async note => {
            if (note) await this.accountsReqService.doAction(action, id, note).then(res => {
              this.role == 5 ? this.dataService.refreshAccountsRequests() : this.dataService.refreshAdminAgentAccountsRequests()
              Dialogs.success(`Request rejected!`, this.translateService)
            }).catch(err => {
              this.role == 5 ? this.dataService.refreshAccountsRequests() : this.dataService.refreshAdminAgentAccountsRequests()
              Dialogs.error(err, this.translateService)
            })
          }
        )
      }
    }
  
    openApproveAccountModal(request?: any) {
      // get groups list
      const groupsList: any[] = [];
      const modalRef = this.modal.open(ApproveAccountRequestModalComponent);
      modalRef.componentInstance.groups = groupsList;
  
      const account = {
        "requestId": request.id,
        "address": "",
        "agent": request.account.agentId ?? 0,
        "assets": 0,
        "balance": 0,
        "city": "",
        "color": 4278190080,
        "comment": "",
        "commission_blocked": 0,
        "country": request.account.countryCode ?? 'TR',
        "credit": 0,
        "currency_digits": 2,
        "email": request.account.accountEmail ?? "",
        "equity": 0,
        "first_name": request.account.firstName ?? "",
        "group": "",
        "last_name": request.account.lastName ?? "",
        "leverage": request.account.leverage ?? 100,
        "liabilities": 0,
        "margin": 0,
        "margin_free": 0,
        "margin_level": 0,
        "margin_so_mode": 0,
        "mqid": "",
        "name": (request.account.firstName ?? "") + " " + (request.account.lastName ?? ""),
        "phone": request.account.accountPhone ?? "",
        "profit": 0,
        "registration": 0,
        "rights": 0,
        "user": null,
        "password": request.account.accountMasterPassword ?? "",
        "currency": request.account.currency ?? "USD",
        "platform": request.account.platform ?? 1
      }
  
      modalRef.componentInstance.account = { ...account };
  
      // Listen for the accountUpdated event from the modal component
      modalRef.componentInstance.accountUpdated.subscribe(() => {
        this.role == 5 ? this.dataService.refreshAccountsRequests() : this.dataService.refreshAdminAgentAccountsRequests()
        Dialogs.success(`Request Approved!`, this.translateService)
      });
    }
  
    setStatus(status: any) {
      this.contentService.filter = status
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
  
    async getInfo(id: any) {
  
      const user = await firstValueFrom(this.auth.getCurrentUserById(id))
      const modal = this.modal.open(AccReqUserInfoComponent, { centered: true, size: 'xl' })
      modal.componentInstance.user = user
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
  }