import { Component } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Mt4managerService } from 'src/app/modules/manager/services/mt4manager.service';

@Component({
  selector: 'app-mt4-agents-commissions',
  templateUrl: './mt4-agents-commissions.component.html',
  styleUrls: ['./mt4-agents-commissions.component.scss']
})
export class Mt4AgentsCommissionsComponent {
  selectedAgentLogin: number = 0
  selectedAgentCustomers: number[] = []
  selectedCustomerId: number = 0
  selectedAgentCommission: number = 5;
  tradesData: any[] = [];
  filteredTradesData: any[] = [];
  totalCommission: number = 0;
  totalVolume: number = 0;
  // from date is 30 days before today
  fromDate: string = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
  // to date is tomorrow
  toDate: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  constructor(private dataService: DataService, private managerService: Mt4managerService) { }

  ngOnInit(): void {

  }

  viewTrades() {
    this.managerService.agentCommission(this.selectedAgentLogin, this.selectedAgentCommission, this.fromDate, this.toDate).subscribe({
      next: res => {
        console.log(res);
        this.tradesData = res;
        this.selectedAgentCustomers = [...new Set(this.tradesData.map(trade => trade.login))];
        console.log(this.selectedAgentCustomers);
        this.applyFilters();
      }
    })
  }

  applyFilters() {
    this.filteredTradesData = this.tradesData
      .filter(trade =>
        (+this.selectedCustomerId === 0 || trade.login === +this.selectedCustomerId)
      );
    this.totalVolume = this.filteredTradesData.reduce((acc, trade) => acc + trade.volume, 0);
    this.totalCommission = +(this.totalVolume * this.selectedAgentCommission).toFixed(5);
  }
}
