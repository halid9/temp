import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Mt4managerService } from 'src/app/modules/manager/services/mt4manager.service';
import { Dialogs } from "src/app/shared/dialogs";

@Component({
  selector: 'app-mt4-account-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class MT4AccountChangePasswordModalComponent {

  @Input() account: any;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isPasswordChecked = false;
  isPasswordValid = false;

  constructor(public activeModal: NgbActiveModal,
     private mt4ManagerService: Mt4managerService,
     private translate:TranslateService) { }

  closeModal() {
    this.activeModal.close();
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      Dialogs.error('Passwords do not match!',this.translate);
      return;
    }

    this.mt4ManagerService.changeAccountPassword(this.account.user, this.newPassword).subscribe({
      next: response => {
        if (response.success) {
          this.closeModal();
          Dialogs.success(`Password changed successfully.`,this.translate)
        } else {
          Dialogs.error(response.message || 'Error changing password.',this.translate)
        }
      },
      error: error => {
        console.error(error);
        Dialogs.error('An error occurred while changing the password.',this.translate);
      }
    });
  }

  checkPassword() {
    this.mt4ManagerService.checkAccountPassword(this.account.user, this.currentPassword).subscribe({
      next: response => {
        if (response.success) {
          this.isPasswordChecked = true;
          this.isPasswordValid = true;
        } else {
          this.isPasswordChecked = true;
          this.isPasswordValid = false;
        }
      },
      error: error => {
        console.error(error);
        Dialogs.error('An error occurred while checking the password.',this.translate);
      }
    });
  }

}
