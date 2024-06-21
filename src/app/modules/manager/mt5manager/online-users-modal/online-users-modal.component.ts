import { Component, Input, OnInit } from '@angular/core';
import { Mt5ManagerService } from 'src/app/modules/manager/services/mt5manager.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountType } from 'src/app/shared/helper';

@Component({
  selector: 'app-mt5-online-users-modal',
  templateUrl: './online-users-modal.component.html',
  styleUrls: ['./online-users-modal.component.scss']
})
export class MT5OnlineUsersModalComponent {
  onlineUsers: any[] = [];
  loading: boolean = false;
  @Input() accountType:AccountType

  constructor(public activeModal: NgbActiveModal,private mt5Manager: Mt5ManagerService) { }

  ngOnInit(): void {
    this.fetchOnlineUsers();
  }

  fetchOnlineUsers() {
    this.loading = true;
    this.mt5Manager.getOnlineUsers(this.accountType).subscribe({
      next: users => {
        this.onlineUsers = users;
        console.log('Online users:', users);
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching online users:', error);
        this.loading = false;
      }
    });
  }

  closeModal() {
    this.activeModal.close();
  }
}
