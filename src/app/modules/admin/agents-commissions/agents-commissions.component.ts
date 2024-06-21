import { Component } from '@angular/core';
import { User } from 'src/app/core/models/auth.models';
import { DataService } from 'src/app/core/services/data.service';
import { AccountsService } from 'src/app/core/services/accounts.service';
import { CustomerListModel } from 'src/app/core/models/customers.model';
import { Platform } from 'src/app/shared/helper';

@Component({
  selector: 'app-agents-commissions',
  templateUrl: './agents-commissions.component.html',
  styleUrls: ['./agents-commissions.component.scss']
})
export class AgentsCommissionsComponent {
  agents: User[]
  autoCollect: boolean = false
  selectedAgentId: number = 0
  selectedAgentCustomers: CustomerListModel[] = []
  selectedCustomerId: number = 0
  selectedPlatform: number = -1;
  tradesData: any[] = [];
  filteredTradesData: any[] = [];
  // from date is 30 days before today
  fromDate: string = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
  // to date is tomorrow
  toDate: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  constructor(private dataService: DataService, private accountService: AccountsService) { }

  ngOnInit(): void {
    this.dataService.refreshAgents()

    this.dataService.agents$.subscribe(agents => {
      this.agents = agents
      if (this.agents.length > 0) {
        this.selectedAgentId = this.agents[0].id;
        this.onChangeAgent();
      }
      // console.log(this.agents)
    })

    this.dataService.customersByParent$.subscribe(customers => {
      this.selectedAgentCustomers = customers
    })

  }

  onChangeAgent() {
    //get agent customers
    this.dataService.refreshCustomersByParent(this.selectedAgentId);
    const agent = this.agents.find(a => a.id === +this.selectedAgentId);
    // console.log(agent, this.agents);
    this.autoCollect = agent?.commissionData?.autoCollect;
  }

  viewTrades() {
    this.accountService.mtAgentCommissionsHistory(this.fromDate, this.toDate, this.selectedAgentId).subscribe({
      next: res => {
        //console.log(res);
        this.tradesData = res;
        this.applyFilters();
      }
    })
  }

  applyFilters() {
    this.filteredTradesData = this.tradesData
      .filter(trade =>
        (+this.selectedCustomerId === 0 || trade.userId === +this.selectedCustomerId) &&
        (+this.selectedPlatform === -1 || trade.platform === +this.selectedPlatform)
      )
      .map(trade => {
        const customer = this.selectedAgentCustomers.find(c => c.id === trade.userId);
        return {
          ...trade,
          customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'
        };
      });
  }

  toggleAutoCollect() {
    if (this.selectedAgentId === 0) return;
    if (this.autoCollect)
      this.accountService.mtAgentCommissionsStopAutoCollect(this.selectedAgentId).subscribe({
        next: res => {
          if (res.success) this.autoCollect = false;
          // console.log(res);
        }
      })
    else
      this.accountService.mtAgentCommissionsStartAutoCollect(this.selectedAgentId).subscribe({
        next: res => {
          if (res.success) this.autoCollect = true;
          // console.log(res);
        }
      })
  }
}
