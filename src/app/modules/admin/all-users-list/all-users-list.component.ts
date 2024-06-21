import { Component, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
// import { Transaction } from "src/app/core/models/transaction.model";

import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { AllUsersService } from '../../../core/services/all-users-list.service';

import { UserTypes } from 'src/app/shared/helper';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NgbdCustomSortableHeader, SortEvent } from 'src/app/core/directives/custom-sortable.directive';
import { RoleService } from 'src/app/core/services/role.service';
import { Role } from 'src/app/core/models/role.model';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AddUserRoleComponent } from './add-user-role/add-user-role.component';
import { Dialogs } from 'src/app/shared/dialogs';
import { DataService } from 'src/app/core/services/data.service';
import { ContentService } from 'src/app/core/services/content.service';
import { ChangeUserTypeComponent } from './change-user-type/change-user-type.component';
// import { UpdateAgentComponent } from '../../crm/leads/update-agent/update-agent-form.component';
import { AccountsListComponent } from '../../shared/shared-components/accounts/customer-accounts-list/account-list.component';
import { CreateUserComponent } from '../../../modules/shared/shared-components/users/create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ChangeAgentSettingsComponent } from './change-user-min-balance/change-user-min-balance.component';
import { UserStatus } from 'src/app/shared/helper';
import { TranslateService } from '@ngx-translate/core';
import { ManageUserComponent } from './manage-user/manage-user.component';

@Component({
  selector: 'all-users-list',
  templateUrl: 'all-users-list.component.html',
  styleUrls: ['all-users-list.component.scss'],
  providers: [ContentService, DecimalPipe]
})
export class AllUsersListComponent {
  cols = [
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

  UserStatus = UserStatus
  agents: User[]
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  masterSelected!: boolean;
  checkedList: any;
  loading$: Observable<boolean>
  @Input() singleComponent: boolean = true
  @Input() role = 5
  @Input() filter = 'All'
  // Table data
  AllUsers$!: Observable<User[]>;
  total$: Observable<number>;
  roles: Role[];
  UserTypes = UserTypes;
  @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;

  constructor(public contentService: ContentService,
    private allUserService: AllUsersService,
    private modal: NgbModal,
    private offCanvas: NgbOffcanvas,
    private usersService: AuthenticationService,
    private roleService: RoleService,
    private dataService: DataService,
    private translate:TranslateService) {

    this.AllUsers$ = contentService.contentToVeiw$;
    this.total$ = contentService.total$;
    this.loading$ = contentService.loading$


  }

  ngOnInit(): void {
    this.dataService.refreshAgents()
    this.dataService.refreshAllUsers()

    this.dataService.allUsers$.subscribe(allUsers => {
      if(allUsers.length) this.contentService.initContent(allUsers)
    })
    this.dataService.agents$.subscribe(agents => {
      this.agents = agents
    })
    this.roleService.roles$.subscribe(roles => {
      this.roles = roles
    })
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'All users list', active: true }
    ];
    this.contentService.filter = ''
  }

  /*
   * Swiper setting
   */

  config = {
    initialSlide: 0,
    slidesPerView: 1
  };

  setType(type: any) {
    this.contentService.filter = type.toString()
  }
  do(action: string, id: any) {
    this.allUserService.doAction(action, id)

  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.contentService.sortColumn = column;
    this.contentService.sortDirection = direction;
  }

  addRole(id: any, roles: any[]) {
    const newRoles =
      this.roles.filter(role =>
        !roles.some(r => r.id === role.id)
      );
    const modal = this.modal.open(AddUserRoleComponent, { centered: true })
    modal.componentInstance.roles = newRoles
    modal.componentInstance.status = 'Add'

    modal.dismissed.subscribe((result: Role) => {
      if (result) {
        console.info(result)
        this.roleService.addRoleToUser(result.id, id).subscribe({
          next: res => {
            Dialogs.success(`Role ${result.name} added to user#${id}`,this.translate)
            this.dataService.refreshAllUsers()
          },
          error: err => {
            Dialogs.error(err,this.translate)
          }
        })

      }
    })
  }
  removeRole(id: any, roles: any[]) {
    if (!roles || !roles.length) return Dialogs.error(`User: ${id} dose not have roles!`,this.translate)
    const modal = this.modal.open(AddUserRoleComponent, { centered: true })
    modal.componentInstance.roles = roles
    modal.componentInstance.status = 'Remove'
    modal.dismissed.subscribe(result => {
      if (result) {
        this.roleService.removeRoleFromUser(result, id).subscribe({
          next: res => {
            Dialogs.success(`Role ${result.name} removed from user#${id}`,this.translate)
            this.dataService.refreshAllUsers()
          },
          error: err => {
            Dialogs.error(err,this.translate)
          }
        })

      }
    })

  }
  changeType(id: any) {
    const modal = this.modal.open(ChangeUserTypeComponent, { centered: true })
    modal.dismissed.subscribe(result => {
      if (result) {
        console.info(result)
        this.roleService.changeUserType(result, id).subscribe({
          next: res => {
            Dialogs.success(`type ${result.name} has been set to user#${id}`,this.translate)
            this.dataService.refreshAllUsers()
          },
          error: err => {
            Dialogs.error(err,this.translate)
          }
        })
      }
    })
  }

  changeAgentSettings(user: User) {
    const modal = this.modal.open(ChangeAgentSettingsComponent, { centered: true })
    modal.componentInstance.user = user
    modal.closed.subscribe(() => {
      this.dataService.refreshAllUsers()
    })
  }

  updateUserAgent(user: User) {

    const modal = this.modal.open(
      null // UpdateAgentComponent
      , { centered: true })
    modal.componentInstance.leadId = user.id
    modal.componentInstance.agent = user.agentId ?? 0
    modal.componentInstance.agents = this.agents
    modal.dismissed.subscribe(() => {
      this.dataService.refreshAllUsers()
    })
  }

  deleteUser(id) {
    Dialogs.confirm('Are you sure you want to delete this user?',this.translate, () => {
      this.roleService.deleteUser(id).subscribe({
        next: res => {
          Dialogs.success(`User#${id} has been deleted`,this.translate)
          this.dataService.refreshAllUsers()
        },
        error: err => {
          Dialogs.error(err,this.translate)
        }
      })
    })
  }

  disableUser(id) {
    Dialogs.confirm('Are you sure you want to disable this user?',this.translate, () => {
      this.roleService.disableUser(id).subscribe({
        next: res => {
          Dialogs.success(`User#${id} has been disabled`,this.translate)
          this.dataService.refreshAllUsers()
        },
        error: err => {
          Dialogs.error(err,this.translate)
        }
      })
    })
  }

  activateUser(id) {
    Dialogs.confirm('Are you sure you want to activate this user?',this.translate, () => {
      this.roleService.activateUser(id).subscribe({
        next: res => {
          Dialogs.success(`User#${id} has been activated`,this.translate)
          this.dataService.refreshAllUsers()
        },
        error: err => {
          Dialogs.error(err,this.translate)
        }
      })
    })
  }

  getAgent(agentId: any): string {
    const agent = this.agents.find(a => a.id == agentId)
    if (agent) return `${agent.firstName} ${agent.lastName}`
    return ''
  }
  showUserAccounts(user: User) {
    const modal = this.modal.open(AccountsListComponent, { centered: true, size: 'xl' })
    modal.componentInstance.singleComponent = false
    modal.componentInstance.userId = user.id
    modal.componentInstance.user = `${user.firstName} ${user.lastName}`
    modal.componentInstance.userType = user.type
  }

  editUser(user: User) {
    const modal = this.modal.open(EditUserComponent, { centered: true, size: 'lg' })
    modal.componentInstance.user = user
    modal.closed.subscribe(u => {
      if (u) {
        this.usersService.updateUserById(user.id, u).subscribe({
          next: res => {
            if (res) {
              Dialogs.success(`User #${user.id} updated successfully!`,this.translate)
              this.dataService.refreshAllUsers()
            }
          },
          error: err => {
            Dialogs.error(err,this.translate)
          }
        })
      }
    })
  }

  CreateNewUser() {
    const modal = this.modal.open(CreateUserComponent, { centered: true })
    modal.componentInstance.userTypes = [
      { name: 'customer', value: UserTypes.Customer },
      { name: 'Agent', value: UserTypes.Agent },
      { name: 'Call center', value: UserTypes.CallCenter },
      { name: 'Manager', value: UserTypes.Manager },
    ]
    modal.closed.subscribe(res => {
      if (res) this.dataService.refreshAllUsers()
    })
  }
  setAsVerified(id: any) {
    this.usersService.updateUserById(id, { verificationState: { verified: true }, emailVerified: true, phoneVerified: true }).subscribe(
      res => {
        if (res) {
          Dialogs.success('user set as verified!',this.translate)
          this.dataService.refreshAllUsers()
        }
      }
    )
  }


  trimText(text: string, length: number) {
    try {
      return text.length > length ? text.substring(0, length) + '...' : text
    } catch (error) {
      return text
    }
  }

  loginAs(user_id: number) {
    this.usersService.loginAsUser(user_id).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.success) {
            localStorage.setItem('verificationState', JSON.stringify(res.payload))
            localStorage.setItem('token', res.payload.access_token);
            localStorage.setItem('userId', res.payload.id)
            window.location.href = '/'
          } else {
            Dialogs.error('Something went wrong, please try again later',this.translate)
            console.error(res)
          }
        }
      },
      error: err => {
        Dialogs.error(err,this.translate)
      }
    })

  }

  sendTestNotification(userId: number) {
    this.allUserService.sendTestNotification(userId).subscribe({
      next: res => {
        Dialogs.success('Test notification sent!',this.translate)
      },
      error: err => {
        Dialogs.error(err,this.translate)
      }
    })
  }

  manageUser(user: User) {
    const modal = this.modal.open(ManageUserComponent,{centered:true,size:'xl'})
    modal.componentInstance.user = user
    modal.dismissed.subscribe(()=>{ this.dataService.refreshAllUsers()})
    }

    setCols(save?: boolean) {
      this.cols.map(c => {
        this.colsToView[c.name] = c.visible
      })
      
      this.offCanvas.dismiss()
  
    }
    openEnd(content: TemplateRef<any>) {

      this.offCanvas.open(content, { position: 'end' });
    }
}
