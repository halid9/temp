import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Mt5ManagerService } from 'src/app/modules/manager/services/mt5manager.service';
import { Dialogs } from "src/app/shared/dialogs";
import { AccountType } from 'src/app/shared/helper';

@Component({
  selector: 'app-mt5-account-user-rights-modal',
  templateUrl: './account-user-rights-modal.component.html',
  styleUrls: ['./account-user-rights-modal.component.scss']
})
export class MT5AccountUserRightsModalComponent {
  @Input() account: any;
  @Input() accountType:AccountType

  @Output() accountUpdated = new EventEmitter<boolean>();

  enabled: boolean = false;
  allowTrade: boolean = false;
  password: boolean = false;
  investor: boolean = false;
  confirmed: boolean = false;
  trailing: boolean = false;
  expert: boolean = false;
  obsolete: boolean = false;
  reports: boolean = false;
  readonly: boolean = false;
  reset_pass: boolean = false;
  otp_enabled: boolean = false;
  sponsored_hosting: boolean = false;
  api_enabled: boolean = false;
  push_notification: boolean = false;
  technical: boolean = false;
  exclude_reports: boolean = false;

  private static USER_RIGHT_ENABLED = 0x0000000000000001;
  private static USER_RIGHT_TRADE_DISABLED = 0x0000000000000004;
private static USER_RIGHT_PASSWORD = 0x0000000000000002;
  private static USER_RIGHT_INVESTOR = 0x0000000000000008;
  private static USER_RIGHT_CONFIRMED = 0x0000000000000010;
  private static USER_RIGHT_TRAILING = 0x0000000000000020;
  private static USER_RIGHT_EXPERT = 0x0000000000000040;
  private static USER_RIGHT_OBSOLETE = 0x0000000000000080;
  private static USER_RIGHT_REPORTS = 0x0000000000000100;
  private static USER_RIGHT_READONLY = 0x0000000000000200;
  private static USER_RIGHT_RESET_PASS = 0x0000000000000400;
  private static USER_RIGHT_OTP_ENABLED = 0x0000000000000800;
  private static USER_RIGHT_SPONSORED_HOSTING = 0x0000000000002000;
  private static USER_RIGHT_API_ENABLED = 0x0000000000004000;
  private static USER_RIGHT_PUSH_NOTIFICATION = 0x0000000000008000;
  private static USER_RIGHT_TECHNICAL = 0x0000000000010000;
  private static USER_RIGHT_EXCLUDE_REPORTS = 0x0000000000020000;


  constructor(public activeModal: NgbActiveModal,
     private mt5ManagerService: Mt5ManagerService,
     private translate:TranslateService) {  }

  ngOnInit(): void {
    this.enabled = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_ENABLED) !== 0;
    this.allowTrade = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_TRADE_DISABLED) === 0;
    this.password = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_PASSWORD) !== 0;
    this.investor = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_INVESTOR) !== 0;
    this.confirmed = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_CONFIRMED) !== 0;
    this.trailing = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_TRAILING) !== 0;
    this.expert = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_EXPERT) !== 0;
    this.obsolete = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_OBSOLETE) !== 0;
    this.reports = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_REPORTS) !== 0;
    this.readonly = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_READONLY) !== 0;
    this.reset_pass = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_RESET_PASS) !== 0;
    this.otp_enabled = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_OTP_ENABLED) !== 0;
    this.sponsored_hosting = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_SPONSORED_HOSTING) !== 0;
    this.api_enabled = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_API_ENABLED) !== 0;
    this.push_notification = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_PUSH_NOTIFICATION) !== 0;
    this.technical = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_TECHNICAL) !== 0;
    this.exclude_reports = (this.account.rights & MT5AccountUserRightsModalComponent.USER_RIGHT_EXCLUDE_REPORTS) !== 0; 

  }

  closeModal() {
    this.activeModal.close();
  }

  changeRights() {
    this.mt5ManagerService.accountUserRights(this.account.user,this.accountType, this.enabled, this.allowTrade, this.password, this.investor, this.confirmed, this.trailing, this.expert, this.obsolete, this.reports, this.readonly, this.reset_pass, this.otp_enabled, this.sponsored_hosting, this.api_enabled, this.push_notification, this.technical, this.exclude_reports  )
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
