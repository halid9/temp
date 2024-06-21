import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { Mt4managerService } from 'src/app/modules/manager/services/mt4manager.service';
import { MT4AccountChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { MT4AccountChangeInfoModalComponent } from '../change-account-info-modal/change-account-info-modal.component';
import { MT4AccountBalanceModalComponent } from '../account-balance-modal/account-balance-modal.component';
import { MT4AccountUserRightsModalComponent } from '../account-user-rights-modal/account-user-rights-modal.component';
import { MT4OnlineUsersModalComponent } from '../online-users-modal/online-users-modal.component';
import { MT4ConnectCRMModalComponent } from '../connect-crmmodal/connect-crmmodal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mt4accounts',
  templateUrl: './mt4accounts.component.html',
  styleUrls: ['./mt4accounts.component.scss']
})
export class Mt4ManagerAccountsComponent {
  columnsConfig = [
    { name: 'color', label: 'Color', visible: true, order: 22 },
    { name: 'user', label: 'Login', visible: true, order: 256 },
    { name: 'name', label: 'Name', visible: true, order: 2 },
    { name: 'email', label: 'Email', visible: true, order: 3 },
    { name: 'phone', label: 'Phone', visible: true, order: 4 },
    { name: 'city', label: 'City', visible: true, order: 5 },
    { name: 'country', label: 'Country', visible: true, order: 6 },
    { name: 'balance', label: 'Balance', visible: true, order: 7 },
    { name: 'equity', label: 'Equity', visible: true, order: 8 },
    { name: 'margin', label: 'Margin', visible: true, order: 10 },
    { name: 'margin_free', label: 'Free Margin', visible: true, order: 10 },
    { name: 'margin_level', label: 'Margin Level', visible: true, order: 11 },
    { name: 'comment', label: 'Comment', visible: true, order: 12 },
    { name: 'group', label: 'Group', visible: true, order: 13 },
    { name: 'agent', label: 'Agent', visible: true, order: 14 },
    { name: 'credit', label: 'Credit', visible: true, order: 16 },
    { name: 'leverage', label: 'Leverage', visible: true, order: 17 },
    { name: 'mqid', label: 'MQID', visible: true, order: 20 },
    { name: 'address', label: 'Address', visible: true, order: 1 }
  ];
  searchTerm: string = '';
  startIndex: number = 0;
  endIndex: number = 0;
  totalRecords: number = 0;
  page: number = 1;
  pageSize: number = 20;
  loading$: Observable<boolean>;
  total$: BehaviorSubject<number> = new BehaviorSubject(0);
  AccountsList$!: Observable<any[]>;
  groupsList: any[] = [];
  private allAccounts: any[] = [];
  sortColumn: string = ''; // default column to sort
  sortDirection: 'asc' | 'desc' = 'asc'; // default sort direction

  constructor(private mt5Manager: Mt4managerService, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.loadColumnVisibilitySettings();
    this.fetchAccounts();
  }

  fetchAccounts(): void {
    this.loading$ = of(true);
    this.mt5Manager.getAllAccounts()
      .pipe(
        catchError(error => {
          console.error('Error fetching accounts:', error);
          this.loading$ = of(false);
          return of({ data: [], success: false });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.allAccounts = response.data;
          this.groupsList = [...new Set(this.allAccounts.map(account => account.group))];
          this.totalRecords = this.allAccounts.length;
          // this.sliceDataForDisplay();
          this.onSort();
        } else {
          console.error('Failed to fetch accounts.');
        }
        this.loading$ = of(false);
      });
  }

  onPageSizeChange() {
    this.page = 1;
    this.pageSize = +this.pageSize;
    this.sliceDataForDisplay();
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.sliceDataForDisplay();
  }

  sliceDataForDisplay(): void {
    let filteredAccounts = this.allAccounts;

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      filteredAccounts = this.allAccounts.filter(account =>
        account.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        account.user.toString().includes(this.searchTerm) ||
        account.country.toLowerCase().includes(lowerCaseSearchTerm) ||
        account.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        account.phone.toLowerCase().includes(lowerCaseSearchTerm) ||
        account.group.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    this.totalRecords = filteredAccounts.length;
    this.total$.next(this.totalRecords);
    this.calculateIndices();
    this.AccountsList$ = of(filteredAccounts.slice(this.startIndex - 1, this.endIndex));
  }

  calculateIndices(): void {
    this.startIndex = (this.page - 1) * this.pageSize + 1;
    this.endIndex = Math.min(this.startIndex + this.pageSize - 1, this.totalRecords);
  }

  onSearchChange(): void {
    this.page = 1;  // reset to the first page
    this.sliceDataForDisplay();
  }

  selectedAccount: any;
  newPassword: string;


  openChangePasswordModal(account: any) {
    const modalRef = this.modalService.open(MT4AccountChangePasswordModalComponent);
    modalRef.componentInstance.account = account;
  }

  openChangeInfoModal(account?: any) {
    const modalRef = this.modalService.open(MT4AccountChangeInfoModalComponent);
    modalRef.componentInstance.groups = this.groupsList;
    modalRef.componentInstance.new_account = !account;
    if (!account) {
      account = {
        "address": "",
        "agent": 0,
        "balance": 0,
        "city": "",
        "color": 4278190080,
        "comment": "",
        "country": "",
        "credit": 0,
        "email": "",
        "equity": 0,
        "group": "",
        "leverage": 100,
        "margin": 0,
        "margin_free": 0,
        "margin_level": 0,
        "mqid": 0,
        "name": "",
        "phone": "",
        "user": null,
        "currency": "USD"
      }
    }
    modalRef.componentInstance.account = { ...account };

    // Listen for the accountUpdated event from the modal component
    modalRef.componentInstance.accountUpdated.subscribe(() => {
      this.fetchAccounts();
    });
  }

  openBalanceOperationsModal(account: any) {
    const modalRef = this.modalService.open(MT4AccountBalanceModalComponent);
    modalRef.componentInstance.account = account;

    modalRef.componentInstance.accountUpdated.subscribe(() => {
      this.fetchAccounts();
    });
  }

  openChangeRolesModal(account: any) {
    const modalRef = this.modalService.open(MT4AccountUserRightsModalComponent);
    modalRef.componentInstance.account = account;

    modalRef.componentInstance.accountUpdated.subscribe(() => {
      this.fetchAccounts();
    });
  }

  openOnlineUsersModal() {
    this.modalService.open(MT4OnlineUsersModalComponent);
  }

  openConnectCRMModal(account: any) {
    const modalRef = this.modalService.open(MT4ConnectCRMModalComponent, { size: 'xl' });
    modalRef.componentInstance.account = account;
  }

  decimalToRgb(decimalColor: number): string {
    const hexColor = decimalColor.toString(16).slice(-6); // Convert to hex and get the last 6 characters
    return `#${hexColor}`;
  }

  onSort(column?: string): void {
    if (column) {
      // Toggle sort direction if the column was already selected, else default to 'asc'
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
    }

    if (this.sortColumn && this.sortDirection) {
      this.allAccounts.sort((a, b) => {
        if (a[this.sortColumn] < b[this.sortColumn]) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (a[this.sortColumn] > b[this.sortColumn]) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Update the displayed accounts after sorting
    this.sliceDataForDisplay();
  }

  toggleColumnVisibility(): void {
    this.saveColumnVisibilitySettings();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        // this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  timestampToDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }

  loadColumnVisibilitySettings(): void {
    const storedSettingsStr = localStorage.getItem('mt4ManagerColumnVisibilitySettings');
    if (storedSettingsStr) {
      const storedSettings = JSON.parse(storedSettingsStr);

      this.columnsConfig.forEach((column, idx) => {
        const storedColumn = storedSettings.find(item => item.name === column.name);
        if (storedColumn) {
          this.columnsConfig[idx] = storedColumn;
        }
      });
    }
  }

  saveColumnVisibilitySettings(): void {
    localStorage.setItem('mt4ManagerColumnVisibilitySettings', JSON.stringify(this.columnsConfig));
  }

  navigateToAgentsCommissions() {
    this.router.navigate(['/mt4manager/agents-commissions']);
  }
}
