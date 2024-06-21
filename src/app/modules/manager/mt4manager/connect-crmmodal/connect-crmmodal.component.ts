import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { Dialogs } from 'src/app/shared/dialogs';
import { FormGroup } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { Platform } from 'src/app/shared/helper';
import { UserTypes } from 'src/app/shared/helper';
import { TranslateService } from '@ngx-translate/core';
import { CreateUserComponent } from 'src/app/modules/shared/shared-components/users/create-user/create-user.component';

@Component({
  selector: 'app-mt4-connect-crmmodal',
  templateUrl: './connect-crmmodal.component.html',
  styleUrls: ['./connect-crmmodal.component.scss']
})
export class MT4ConnectCRMModalComponent {
  @Input() account: any;
  loading: boolean = true;
  accountConnected: boolean = false;
  accountInfo: any = null;
  usersList: any[] = [];
  searchTerm = '';
  filteredUsersList = [];
  UsersTypes = UserTypes;

  constructor(public activeModal: NgbActiveModal, 
    private accountsService: AccountsService, 
    private dataService: DataService, 
    private modal: NgbModal,
    private translate:TranslateService) { }


  ngOnInit(): void {
    this.checkCRM();
    this.loadUsersList();
  }

  async loadUsersList() {
    // Load the list of users
    await this.dataService.refreshAllUsers();
    this.dataService.allUsers$.subscribe({
      next: data => {
        this.usersList = data;
        this.filteredUsersList = this.usersList;
        // console.log('users list', data);
      }
    });
  }

  filterUsers() {
    this.filteredUsersList = this.usersList.filter(user => {
      return Object.values(user).some(value => {
        return value !== null && value !== undefined && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    });
  }

  checkCRM() {
    this.loading = true;
    this.accountsService.getLiveAccountBylogin(Platform.MT4, this.account.user).subscribe({
      next: data => {
        this.accountConnected = true;
        this.accountInfo = data;
        console.log('Account is connected', data);
        this.loading = false;
      },
      error: error => {
        if (error == 'Account not found') {
          console.error('Account Not Connected before', error);
          this.accountConnected = false;
        } else {
          this.closeModal();
          Dialogs.error('Error while checking account, please try again.',this.translate);
          console.error('Error while checking account', error);
        }
        this.loading = false;
      }
    });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  CreateNewUser() {
    const modal = this.modal.open(CreateUserComponent, { centered: true })
    modal.componentInstance.userTypes = [
      { name: 'customer', value: UserTypes.Customer },
      { name: 'Agent', value: UserTypes.Agent },
      { name: 'Call center', value: UserTypes.CallCenter },
      { name: 'Manager', value: UserTypes.Manager },
    ]
    modal.componentInstance.userData = {
      email: this.account.email,
      firstName: this.account.name.split(' ')[0] ?? '',
      lastName: this.account.name.split(' ')[1] ?? '',
      phoneNumber: this.account.phone
    };

    modal.closed.subscribe(() => {
      this.dataService.refreshAllUsers()
    })
  }

  connectToExistingClientAccount(userId: number, external: boolean = false) {
    Dialogs.confirm('Are you sure you want to connect this account to the selected client?',this.translate, () => {
      console.log('connect to existing client account', userId);
      this.accountsService.connectAccount({ login: this.account.user, platform: Platform.MT4, user_Id: userId, action: 'connect', accountMasterPassword: 'Aa@123qaz', accountInvestorPassword: 'Aa@123qaz', external }).subscribe({
        next: data => {
          console.log('Account connected successfully', data);
          this.closeModal();
          Dialogs.success('Account connected successfully',this.translate);
        },
        error: error => {
          console.error('Error while connecting account', error);
          this.closeModal();
          Dialogs.error('Error while connecting account, please try again.',this.translate);
        }
      });
    });
  }

  closeModal() {
    this.activeModal.close();
  }
}
