import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { ConnectAccountModel } from "src/app/core/models/connect-account.model";
import { ContentService } from "src/app/core/services/content.service";
import { Dialogs } from "src/app/shared/dialogs";
import * as XLSX from 'xlsx';




@Component({
    selector: "connect-external-accounts",
    templateUrl: 'connect-external-accounts.component.html',
    styleUrls: ['connect-external-accounts.component.scss'],
    providers: [ContentService]
})
export class ConnectExternalAccountsComponent {
    accounts: ConnectAccountModel[] = []
    platforms = ['MT4', 'MT5']
    accountsToview: Observable<ConnectAccountModel[]>
    total$: Observable<any>
    loading$: Observable<boolean>
    account: ConnectAccountModel = {
        login: '',
        platform: 'MT5',
        // masterPassword: '',
        // investorPassword: ''
    }
    id = 0

    constructor(private modal: NgbModal,
        public contentService: ContentService,
        private translate: TranslateService) {
        this.accountsToview = contentService.contentToVeiw$
        this.total$ = contentService.total$
        this.loading$ = contentService.loading$
        contentService.pageSize = 5
    }
    connectAccounts() {
        this.modal.dismissAll(this.accounts)
    }
    close() {
        this.modal.dismissAll()
    }
    remove(id) {
        this.accounts = this.accounts.filter(a => a.id != id)
        this.contentService.initContent(this.accounts)
    }
    add() {
        if (!this.account.login || !this.account.platform) {
            return Dialogs.error('Please fill all fields', this.translate)
        }
        this.accounts.push({ ...this.account, id: this.id })
        this.contentService.initContent(this.accounts)
        this.clear()
    }
    clear() {
        this.id++
        this.account = {
            login: '',
            platform: 'MT5',

        }
    }



    import() {
        const inputElement = document.createElement('input') as HTMLInputElement;
        inputElement.type = 'file';
        inputElement.style.display = 'none';
        inputElement.addEventListener('change', (event) => {
            const input = event.target as HTMLInputElement;
            if (input.files && input.files.length > 0) {
                const selectedFile = input.files[0];
                // Handle the selected file here
                this.handleFileChanged(selectedFile)
            }

            // Clean up the input element
        });

        inputElement.click();
    }

    handleFileChanged(selectedFile) {
        const file = selectedFile;
        const reader = new FileReader();

        reader.onload = (e: any) => {
            const data = e.target.result;
            this.processExcel(data);
        };
        reader.readAsBinaryString(file);
    }
    processExcel(data: any) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
        const mappedData = excelData.slice(1).map(a => {
            const account: ConnectAccountModel = { login: a[0], platform: a[1]?.toUpperCase(), id: this.id++ }
            return account
        })
        this.accounts = [...this.accounts, ...mappedData]
        this.contentService.initContent(this.accounts)
    }
}