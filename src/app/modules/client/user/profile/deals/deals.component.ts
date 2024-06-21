import { Component, Input, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
// import { Transaction } from "src/app/core/models/transaction.model";

import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';


import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserTypes } from 'src/app/shared/helper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentService } from 'src/app/core/services/content.service';
import { NgbdCustomSortableHeader } from 'src/app/core/directives/custom-sortable.directive';
import { Deal } from 'src/app/core/models/deals.model';
@Component({
  selector: 'deals',
  templateUrl: 'deals.component.html',
  styleUrls: ['deals.component.scss'],
  providers: [ContentService,DecimalPipe]
})
export class DealsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
@Input() deals = []
@Input() loading :boolean 
  // Table data
  dealList$!: Observable<Deal[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;
  @Input() role: UserTypes = 5

  userType = UserTypes
  constructor(public contentService: ContentService, private auth: AuthenticationService, private modal: NgbModal) {
    this.role = this.userType.Customer
    this.dealList$ = contentService.contentToVeiw$;
    this.total$ = contentService.total$;

  
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
   this.contentService.initContent(this.deals)
 
  }

  do(action: string, id: any) {
    
  }
  setStatus(status: any) {
    this.contentService.filter = status
  }

}
