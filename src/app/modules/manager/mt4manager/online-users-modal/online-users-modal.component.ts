import { Component, OnInit } from '@angular/core';
import { Mt4managerService } from 'src/app/modules/manager/services/mt4manager.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mt4-online-users-modal',
  templateUrl: './online-users-modal.component.html',
  styleUrls: ['./online-users-modal.component.scss']
})
export class MT4OnlineUsersModalComponent {
  onlineUsers: any[] = [];
  loading: boolean = false;

  constructor(public activeModal: NgbActiveModal,private mt4Manager: Mt4managerService) { }

  ngOnInit(): void {
    this.fetchOnlineUsers();
  }

  fetchOnlineUsers() {
    this.loading = true;
    this.mt4Manager.getOnlineUsers().subscribe({
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
