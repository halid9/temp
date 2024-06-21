import { Component, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

// Sweet Alert
import Swal from 'sweetalert2';

// Csv File Export
import { ngxCsv } from 'ngx-csv/ngx-csv';

import { CustomerListModel } from '../../../core/models/customers.model';

// Rest Api Service
import { ContentService } from 'src/app/core/services/content.service';
import { NgbdCustomSortableHeader, SortEvent } from 'src/app/core/directives/custom-sortable.directive';
import { DataService } from 'src/app/core/services/data.service';
import { CreateUserComponent } from '../../../modules/shared/shared-components/users/create-user/create-user.component';
import { UserTypes } from 'src/app/shared/helper';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EditUserComponent } from '../../admin/all-users-list/edit-user/edit-user.component';
import { Dialogs } from 'src/app/shared/dialogs';
import { EmailSmsFormComponent } from '../../../modules/shared/shared-components/email-sms-form/email-sms-form.component';
import { TranslateService } from '@ngx-translate/core';
import { FileManagerService } from 'src/app/core/services/file-manager.service';
import { VoipComponent } from '../../shared/shared-components/voip/voip.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [ContentService, DecimalPipe]
})

/**
 * Contacts Component
 */
export class CustomersComponent {
  affiliateLink: string
  sortClass
  sortCol
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  CustomersData$: Observable<CustomerListModel[]>;
  masterSelected: boolean = false;
  fieldSelected = false
  loading$: Observable<boolean>
  // Api Data
  customer?: any;
  customers?: any[];
  ecustomer?: any;
  selectedUser: string = ''
  userId: any = 0
  userType: any = null
  allowLoginAs = false

  // Table data
  total: Observable<number>;
  @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;
  cusCols = [
    { name: 'name', visible: true },
    { name: 'email', visible: true },
    { name: 'roles', visible: false },
    { name: 'status', visible: false },
    { name: 'phone', visible: true },
    { name: 'type', visible: false },
    { name: 'createdAt', visible: false },
    { name: 'country', visible: true },
    { name: 'city', visible: true },
    { name: 'zipcode', visible: false },
    { name: 'streetAddress', visible: false },
  ]
  colsToView = {
    name: true,
    email: true,
    phone: true,
    country: true,
    city: true,
    zipcode: false,
    streetAddress: false,
    type: false,
    status: false,
    roles: false,
    createdAt: false,
  }

  accCols = [{ name: 'username', visible: false },
  { name: 'name', visible: true },
  { name: 'email', visible: true },
  { name: 'roles', visible: false },
  { name: 'status', visible: true },
  { name: 'phone', visible: true },
  { name: 'type', visible: true },
  { name: 'createdAt', visible: true },
  { name: 'country', visible: true },
  { name: 'city', visible: false },
  { name: 'zipcode', visible: false },
  { name: 'streetAddress', visible: false },]

  accountsFilter =
    {
      name: true,
      email: true,
      phone: true,
      country: true,
      city: false,
      zipcode: false,
      streetAddress: false,
      type: true,
      status: true,
      roles: false,
      createdAt: false,

    }
  constructor(private modalService: NgbModal,
    public contentService: ContentService,
    private dataService: DataService,
    private fileService: FileManagerService,
    private offCanvas: NgbOffcanvas,
    private auth: AuthenticationService,
    private translate: TranslateService
  ) {

    this.CustomersData$ = contentService.contentToVeiw$;
    this.total = contentService.total$;
    this.loading$ = contentService.loading$
    contentService.pageSize = 5

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const path = '/auth/register';
    const encodedUserId = btoa(this.auth._currentUser.id.toString());
    this.affiliateLink = `${protocol}//${hostname}${port}${path}?${encodedUserId}`;

    this.allowLoginAs = this.auth.hasPermissions(['LoginAsUser'])
  }

  ngOnInit(): void {
    this.dataService.refreshCustomersByParent()
    this.dataService.customersByParent$.subscribe(customers => {
      this.contentService.initContent(customers)
      this.customers = customers
    })


    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Agent portal' },
      { label: 'Customers', active: true }
    ];



  }
  masterChanged() {
    this.customers.map(c => c.isSelected = this.masterSelected)
    this.checkForSelected()
  }
  createCustomer() {
    const modal = this.modalService.open(CreateUserComponent, { centered: true })
    modal.componentInstance.userTypes = [
      { name: 'customer', value: UserTypes.Customer },
      { name: 'Call center', value: UserTypes.CallCenter },
      { name: 'Manager', value: UserTypes.Manager },
    ]
  }
  checkForSelected() {
    this.fieldSelected = this.customers.some(c => c.isSelected)
  }
  /**
  * View Data Get
  * @param content modal content
  */
  viewDataGet(id: any, firstName: string, lastName: string, type: any) {
    this.dataService.refreshAccountsByUserId(id)
    this.ecustomer = this.customers.find(c => c.id == id)
    this.selectedUser = `${firstName} ${lastName}`
    var input = document.getElementById(`check-${id}`)
    this.customers.map(c => c.id == id ? c.isSelected = !c.isSelected : c)
    this.userId = id
    this.userType = type
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Contact';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
  }

  /**
   * Confirmation mail model
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    if (id) {

      document.getElementById('c_' + id)?.remove();
    }
    else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('c_' + item)?.remove();
      });
    }
  }


  checkedValGet: any[] = [];
  deleteMultiple(content: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    var result
    var checkedVal: any[] = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    if (checkedVal.length > 0) {
      this.modalService.open(content, { centered: true });
    }
    else {
      Swal.fire({ text: 'Please select at least one checkbox', confirmButtonColor: '#239eba', });
    }
    this.checkedValGet = checkedVal;
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.customers.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.customers.length; i++) {
      if (this.customers[i].state == true) {
        result = this.customers[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }

  // Csv File Export
  csvFileExport() {
    var orders = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Contact Data',
      useBom: true,
      noDownload: false,
      headers: ["Id", "Image src", "Name", "Company", "Designation", "Email", "Phone", "Tags", "Lead Score", "Last Contacted"]
    };
    new ngxCsv({ name: 'test' }, "Contact", orders);

  }

  // Sort filter
  sortField: any;
  sortBy: any
  SortFilter() {
    this.sortField = (document.getElementById("choices-single-default") as HTMLInputElement).value;
    if (this.sortField[0] == 'D') {
      this.sortBy = 'asc';
      this.sortField = this.sortField.replace(/D/g, '')
    }
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
  openEnd(content: TemplateRef<any>) {

    this.offCanvas.open(content, { position: 'end' });
  }

  setCols(save?: boolean) {
    this.cusCols.map(c => {
      this.colsToView[c.name] = c.visible
    })
    this.accCols.map(a => {
      this.accountsFilter[a.name] = a.visible
    })
    this.offCanvas.dismiss()

  }

  clearFilter() {

  }

  editUser(user) {
    const modal = this.modalService.open(EditUserComponent, { centered: true, size: 'lg' })
    modal.componentInstance.user = user
    modal.dismissed.subscribe(u => {
      if (u) {
        this.auth.updateUserById(user.id, u).subscribe({
          next: res => {
            if (res) {
              Dialogs.success(`User #${user.id} updated successfully!`, this.translate)
              this.dataService.refreshAllUsers()
            }
          },
          error: err => {
            Dialogs.error(err, this.translate)
          }
        })
      }
    })
  }
  deleteUser(id) {
    Dialogs.confirm('Are you sure you want to delete this user?', this.translate, () => {
      this.auth.deleteUser(id).subscribe({
        next: res => {
          Dialogs.success(`User#${id} has been deleted`, this.translate)
          this.dataService.refreshAllUsers()
        },
        error: err => {
          Dialogs.error(err, this.translate)
        }
      })
    })
  }
  deleteSelected() {
    const cusToDelete = this.customers.filter(c => c.isSelected).map(c => { return c.id })
    console.log(cusToDelete)
  }
  send(type: string) {
    const modal = this.modalService.open(EmailSmsFormComponent, { centered: true, size: "lg" })
    modal.componentInstance.type = type
    const destinations = this.customers.filter(c => c.isSelected).map(c => {
      if (type == 'email')
        return c.email
      else return c.phone
    }
    )
    modal.componentInstance.destinations = destinations
  }

  callUser(user) {
    const modal = this.modalService.open(VoipComponent, { centered: true, backdrop: "static", keyboard: false })
    modal.componentInstance.user = user
  }

  loginAs(user_id: number) {
    this.auth.loginAsUser(user_id).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.success) {
            localStorage.setItem('verificationState', JSON.stringify(res.payload))
            localStorage.setItem('token', res.payload.access_token);
            localStorage.setItem('userId', res.payload.id)
            window.location.href = '/'
          } else {
            Dialogs.error('Something went wrong, please try again later', this.translate)
            console.error(res)
          }
        }
      },
      error: err => {
        Dialogs.error(err, this.translate)
      }
    })
  }
}
