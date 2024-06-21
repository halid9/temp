import { Component } from '@angular/core';
import { BonusCampaignService } from '../../../core/services/bonus-campaign.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BonusCampaginFormModalComponent } from './form-modal/form-modal.component';
import { Dialogs } from 'src/app/shared/dialogs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bonus-campaigns',
  templateUrl: './bonus-campaigns.component.html',
  styleUrls: ['./bonus-campaigns.component.scss']
})
export class BonusCampaignsComponent {
  campaigns = [];

  constructor(private campaignService: BonusCampaignService,
     private modalService: NgbModal,
     private translate:TranslateService,
     private router:Router) { }

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns() {
    this.campaignService.getCampaigns().subscribe({
      next: (data) => { this.campaigns = data; },
      error: (error) => { console.error(error); }
    });
  }

  addCampaign(campaign) {
    this.campaignService.addCampaign(campaign).subscribe({
      next: () => { this.loadCampaigns(); },
      error: (error) => { console.error(error); }
    });
  }

  editCampaign(campaign) {
    this.campaignService.updateCampaign(campaign).subscribe({
      next: () => { this.loadCampaigns(); },
      error: (error) => { console.error(error); }
    });
  }

  deleteCampaign(campaignId) {
    Dialogs.confirm('Are you sure you want to delete this campaign?',this.translate, () => {
      this.campaignService.deleteCampaign(campaignId).subscribe({
        next: () => {
          this.loadCampaigns();
          Dialogs.success(`Campaign#${campaignId} has been deleted`,this.translate)
        },
        error: (error) => { Dialogs.error(error,this.translate) }
      }
      );
    })
  }

  showCampaignForm(campagin?) {
    const modalRef = this.modalService.open(BonusCampaginFormModalComponent);
    modalRef.componentInstance.new_campagin = !campagin;
    if (!campagin) {
      campagin = {
        name: "",
        description: "",
        campagin_start: "",
        campagin_end: "",
        amount: 50,
        trade_start: "",
        trade_end: "",
      }
    }
    modalRef.componentInstance.campagin = { ...campagin };

    modalRef.componentInstance.campaginUpdated.subscribe(() => {
      this.loadCampaigns();
    });
  }

  campaignLink(campaignId: number) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const encodedCampaignId = btoa(campaignId.toString());

    return `${protocol}//${hostname}${port}/landing/bonus?${encodedCampaignId}`;
  }
  goToLeads(type,id){
    this.router.navigate(['crm','leads-list'],{queryParams:{campaignType:type},fragment:`${id}`})
  }
}
