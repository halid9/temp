import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Mt4managerService } from 'src/app/modules/manager/services/mt4manager.service';
import { Dialogs } from "src/app/shared/dialogs";

@Component({
  selector: 'app-mt4-account-user-rights-modal',
  templateUrl: './account-user-rights-modal.component.html',
  styleUrls: ['./account-user-rights-modal.component.scss']
})
export class MT4AccountUserRightsModalComponent {
  @Input() account: any;
  @Output() accountUpdated = new EventEmitter<boolean>();

  enabled: boolean = false;
  readonly: boolean = false;
  password: boolean = false;
  reports: boolean = false;
  otp_enabled: boolean = false;


  constructor(public activeModal: NgbActiveModal,
     private mt4ManagerService: Mt4managerService,
     private translate:TranslateService) { }

  ngOnInit(): void {
    this.enabled = this.account.enable !== 0;
    this.readonly = this.account.enable_read_only !== 0;
    this.password = this.account.enable_change_password !== 0;
    this.otp_enabled = this.account.enable_otp !== 0;
    this.reports = this.account.send_reports !== 0;
  }

  closeModal() {
    this.activeModal.close();
  }

  changeRights() {
    this.mt4ManagerService.accountUserRights(this.account.user, this.enabled, this.readonly, this.password, this.reports, this.otp_enabled)
      .subscribe({
        next: response => {
          if (response && response.success) {
            this.accountUpdated.emit(true);
            this.closeModal();
            Dialogs.success('User rights updated successfully!',this.translate);
          } else {
            Dialogs.error('Failed to update user rights. Please try again.',this.translate);
          }
        },
        error: error => {
          Dialogs.error('An error occurred while updating user rights. Please try again later.',this.translate);
        }
      });
  }
}
