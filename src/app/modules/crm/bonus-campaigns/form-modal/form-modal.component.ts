import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Dialogs } from "src/app/shared/dialogs";
import { BonusCampaignService } from '../../../../core/services/bonus-campaign.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class BonusCampaginFormModalComponent {
  @Input() campagin: any;
  @Input() new_campagin: boolean = false;
  @Output() campaginUpdated = new EventEmitter<boolean>();

  constructor(public activeModal: NgbActiveModal,
     private campaignService: BonusCampaignService,
     private translate:TranslateService) { }

  closeModal() {
    this.activeModal.close();
  }

  saveChanges() {
    if (this.new_campagin) {
      this.campaignService.addCampaign(
        this.campagin
      ).subscribe({
        next: response => {
          if (response && response.success) {
            this.campaginUpdated.emit(true);
            this.closeModal();
            Dialogs.success('Campaign info added successfully!',this.translate);
          } else {
            Dialogs.error('Failed to add campagin info. Please try again.',this.translate);
          }
        },
        error: error => {
          Dialogs.error('An error occurred while adding the campagin info. Please try again later.',this.translate);
        }
      });
    } else {
      this.campaignService.updateCampaign(
        this.campagin
      ).subscribe({
        next: response => {
          if (response && response.success) {
            this.campaginUpdated.emit(true);
            this.closeModal();
            Dialogs.success('Campaign info updated successfully!',this.translate);
          } else {
            Dialogs.error('Failed to update campagin info. Please try again.',this.translate);
          }
        },
        error: error => {
          Dialogs.error('An error occurred while updating the campagin info. Please try again later.',this.translate);
        }
      });
    }
  }
}
