import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Mt5ManagerService } from 'src/app/modules/manager/services/mt5manager.service';
import { Dialogs } from "src/app/shared/dialogs";
import { AccountType } from 'src/app/shared/helper';

@Component({
  selector: 'app-mt5-account-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class MT5AccountChangePasswordModalComponent {
  @Input() account: any;
  @Input() accountType:AccountType

  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isPasswordChecked = false;
  isPasswordValid = false;
  passwordType: 'master' | 'investor' | 'api' = 'master';

  constructor(public activeModal: NgbActiveModal,
     private mt5ManagerService: Mt5ManagerService,
     private translate:TranslateService
     
     ) { }

  closeModal() {
    this.activeModal.close();
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      Dialogs.error('Passwords do not match!',this.translate);
      return;
    }

    this.mt5ManagerService.changeAccountPassword(this.account.user, this.newPassword,this.accountType, this.passwordType).subscribe({
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
    this.mt5ManagerService.checkAccountPassword(this.account.user, this.currentPassword,this.accountType, this.passwordType).subscribe({
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
