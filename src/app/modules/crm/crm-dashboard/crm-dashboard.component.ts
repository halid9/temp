import { Component } from "@angular/core";
import { Lead } from "src/app/core/models/lead.model";
import { CrmService } from "src/app/core/services/crm.service";
import { UserStatus, UserTypes } from "src/app/shared/helper";

@Component({
    selector:'crm-dashboard',
    templateUrl:'crm-dashboard.component.html',
    styleUrls:['crm-dashboard.component.scss']
})
export class CrmDashboardComponent {
    breadCrumbItems!: Array<{}>;
    statData:any[] = []
    constructor(private crmService: CrmService) { }
  
    ngOnInit(): void {
      /**
      * BreadCrumb
      */
       this.breadCrumbItems = [
        { label: 'CRM'},
        { label: 'CRM Dashboard', active: true }
      ];

      //get counters
      this.statData = this.crmService.getCounters()
    }

    lead:Lead = {
      id:0,
        leadOwner: 321321,
        phone: 'asd',
        created_at: 'asd',
        natunality: 'asd',
        tradingExperience: 'asd',
        anotherCompanyAccount: true,
        anotherCompanyDetails: 'asd',
        tradingPlatforms: 'asd',
        callForwarding: 'asd',
        leadSource: 'asd',
        lastName: 'asd',
        work: 'asd',
        address: 'asd',
        leadStatus: 0,
        customerInterestScale: 'asd',
        blackList: true,
        reason: 'asd',
        hasAccountByUs: true,
        accountType: 0,
        notes: 'asd',
        status:UserStatus.Draft,
        type:UserTypes.Customer
    }
}