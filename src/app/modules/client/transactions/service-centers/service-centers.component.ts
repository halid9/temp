import { Component, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';


import { NgbdCustomSortableHeader, SortEvent } from 'src/app/core/directives/custom-sortable.directive';
import { ContentService } from 'src/app/core/services/content.service';
@Component({
  selector: 'service-centers',
  templateUrl: 'service-centers.component.html',
  styleUrls: ['service-centers.component.scss'],
  providers: [ContentService, DecimalPipe]
})
export class ServiceCentersComponent {
  sortClass = ''
  sortCol = ''
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  @Input() centers: any[]
  @Input() singleComponent: boolean = true
  loading$: Observable<boolean>
  dir = ''
  // Table data
  ContentList$!: Observable<any[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;


  constructor(public contentService: ContentService,) {
    this.ContentList$ = contentService.contentToVeiw$;
    this.total$ = contentService.total$;
    this.loading$ = contentService.loading$
  }

  ngOnInit(): void {

    if(this.centers.length) this.contentService.initContent(this.centers)
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Accounts' },
      { label: 'Accounts requests', active: true }
    ];
  }

  ShowLocation(location) {

  }

  setStatus(status: any) {
    this.contentService.filter = status
  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.sortClass = direction
    this.sortCol = column as string
    this.contentService.sortColumn = column;
    this.contentService.sortDirection = direction;
  }


}
