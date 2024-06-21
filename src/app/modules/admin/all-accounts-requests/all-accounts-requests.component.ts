import { Component, Input, QueryList, ViewChildren } from '@angular/core';
// import { Transaction } from "src/app/core/models/transaction.model";

import { DecimalPipe } from '@angular/common';
import { UserTypes } from 'src/app/shared/helper';
import { AuthenticationService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'all-accounts-requests',
  templateUrl: 'all-accounts-requests.component.html',
  styleUrls: ['all-accounts-requests.component.scss'],
  providers: [DecimalPipe]
})
export class AllAccountsRequestsComponent {
  role = UserTypes.Customer

  constructor(private auth: AuthenticationService) {
    this.role = this.auth._currentUser.type
  }

}
