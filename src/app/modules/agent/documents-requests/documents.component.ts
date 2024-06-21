import { Component, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
// import { Transaction } from "src/app/core/models/transaction.model";

import { Observable } from 'rxjs';

import { DocumentModel } from '../../../core/models/document.model';
import { DocumentsService } from '../../../core/services/documents.service';

import { UserTypes } from 'src/app/shared/helper';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { User } from 'src/app/core/models/auth.models';
import { NgbdCustomSortableHeader, SortEvent } from 'src/app/core/directives/custom-sortable.directive';
import { ContentService } from 'src/app/core/services/content.service';
import { DataService } from 'src/app/core/services/data.service';
import { AddNoteComponent } from 'src/app/modules/shared/shared-components/accounts/add-note/add-note.component';
import { FileManagerService } from 'src/app/core/services/file-manager.service';
import { ViewContentComponent } from 'src/app/shared/view-content/view-content.component';
import { DatePickerComponent } from '../../shared/shared-components/date-picker/date-picker.component';
@Component({
  selector: 'documents',
  templateUrl: 'documents.component.html',
  styleUrls: ['documents.component.scss'],
  providers: [ContentService]
})
export class DocumentsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;


  loading$: Observable<boolean>
  @Input() singleComponent: boolean = true
  @Input() role = 5
  userType = UserTypes
  @Input() filter = 'All'
  // Table data
  DocList$!: Observable<any[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdCustomSortableHeader) headers!: QueryList<NgbdCustomSortableHeader>;

  constructor(private docService: DocumentsService,
    public contentService: ContentService,
    private modal: NgbModal,
    private fileService: FileManagerService,
    private dataService: DataService,
    private offcanvasService: NgbOffcanvas,) {

    this.DocList$ = contentService.contentToVeiw$;
    this.total$ = contentService.total$;
    this.loading$ = contentService.loading$
  }

  cols: { name: string, visibale: boolean }[] = [
    { name: 'user', visibale: true },
    { name: 'type', visibale: true },
    { name: 'uploadDate', visibale: true },
    { name: 'status', visibale: true },
    { name: 'expirationDate', visibale: true },
    { name: 'details', visibale: true }

  ]
  colsToView = {
    user: true,
    type: true,
    uploadDate: true,
    status: true,
    expirationDate: true,
    details: true,
  }

  openUserDialog() {

  }
  ngOnInit(): void {
    this.dataService.refreshDocuments()
    this.dataService.documentsRequests$.subscribe(docs => {
      const group = this.groupByUserEmail(docs)
      console.log(group)

      const grouped = []
      const keys = Object.keys(group).forEach(k=>{

      const obj= {
        user:k,
        requests:group[k]
      }
      grouped.push(obj)
      })
      this.contentService.initContent(grouped)
    })
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Agent' },
      { label: 'Documents requests', active: true }
    ];
  }
  groupByUserEmail(items: DocumentModel[]) {
    return items.reduce((acc, item) => {
      const userEmail = item.user?.email;

      // If the user email doesn't exist in the accumulator, create an empty array for it
      acc[userEmail] = acc[userEmail] || [];

      // Push the item to the array corresponding to its user email
      acc[userEmail].push(item);
      
      
      return acc;
    }, {});
  }


  setType(id: any) {
    this.contentService.filter = id
  }

  approve(id: any) {
    this.modal.open(DatePickerComponent, { centered: true }).closed.subscribe(
      data => {
        if (!data) return
        if (data.later) this.docService.doAction('approve', id).then(() => { this.dataService.refreshDocuments() })
        if (!data.later) this.docService.doAction('approve', id, null, data.date).then(() => { this.dataService.refreshDocuments() })
      }
    )
  }
  reject(id: any) {
    const modal = this.modal.open(AddNoteComponent, { centered: true })
    modal.closed.subscribe(
      note => {
        if (note) this.docService.doAction('reject', id, note).then(() => { this.dataService.refreshDocuments() })


      }
    )
  }
  openViewContent(fileId: string, user?: User, status?: string, docId?: string) {
    this.fileService.getFile(fileId).subscribe({
      next: (res: HttpResponse<Blob>) => {

        const url = URL.createObjectURL(res.body)
        const modal = this.modal.open(ViewContentComponent, { centered: true, size: "xl" })
        const contentTypeHeader = res.headers.get('Content-Type');

        modal.componentInstance.src = url
        modal.componentInstance.user = user
        modal.componentInstance.showUserInfo = true

        if (status === 'pending') modal.componentInstance.view = false
        if (contentTypeHeader.includes('image')) modal.componentInstance.type = 'image'
        else modal.componentInstance.type = 'pdf'

        modal.closed.subscribe(result => {
          if (result) {
            result == 'approve' ? this.approve(docId) : this.reject(docId)
          }
        })
      }

    })

  }
  download(id: string) {
    this.fileService.getFile(id).subscribe({
      next: (res: HttpResponse<Blob>) => {
        this.fileService.saveFileLocally(res)
      }
    })
  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.contentService.sortColumn = column;
    this.contentService.sortDirection = direction;
  }


  openEnd(content: TemplateRef<any>) {

    this.offcanvasService.open(content, { position: 'end' });
  }
  setCols(save?: boolean) {

    this.cols.map(c => this.colsToView[c.name] = c.visibale)
    if (save) {
      //save cols locally
    }
    this.offcanvasService.dismiss()
  }
  clearFilter() {

  }
}
