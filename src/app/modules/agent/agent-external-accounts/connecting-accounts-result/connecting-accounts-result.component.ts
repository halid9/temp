import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { ConnectAccountModel } from "src/app/core/models/connect-account.model";
import { ContentService } from "src/app/core/services/content.service";
import * as XLSX from 'xlsx';




@Component({
    selector: "connecting-accounts-result",
    templateUrl: 'connecting-accounts-result.component.html',
    styleUrls: ['connecting-accounts-result.component.scss'],
    providers: [ContentService]
})
export class ConnectingAccountsResultComponent {
    @Input() accounts: ConnectAccountModel[] = []
    accountsToview: Observable<ConnectAccountModel[]>
    total$:Observable<any>
    loading$:Observable<boolean>
    constructor(private modal: NgbModal, public contentService: ContentService) {
        this.accountsToview = contentService.contentToVeiw$
        this.total$ = contentService.total$
        this.loading$ = contentService.loading$
        contentService.pageSize = 8
    }
    ngOnInit(){
        this.contentService.initContent(this.accounts)
    }
    close() {
        this.modal.dismissAll()
    }

    export() {
        const header = Object.keys(this.accounts[0]);
        const values = this.accounts.map((obj) => Object.values(obj));
    
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([header, ...values]);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        // Export the Excel file
        XLSX.writeFile(wb, 'exported-data.xlsx');
        this.modal.dismissAll()
    }

    
}