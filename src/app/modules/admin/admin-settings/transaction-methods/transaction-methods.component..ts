import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { Method } from "src/app/core/models/method.model";
import { TransferMethodsService } from "src/app/core/services/transfer-methods.service";
import { Dialogs } from "src/app/shared/dialogs";
import { EditTransferMethodComponent } from "./edit-transfer-method/edit-transfer-method.component";

@Component({
    selector: "transaction-methods",
    templateUrl: "transaction-methods.component.html"
})
export class TransactionMethodsComponent {
    loading = true
    methods: Method[]
    constructor(private methodService: TransferMethodsService,
        private translate: TranslateService,
        private modal: NgbModal
    ) {

    }
    ngOnInit() {
        this.methodService.getMethods().subscribe({
            next: (res: Method[]) => {
                this.methods = res
                this.loading = false
            },
            error: err => {
                this.loading = false
                Dialogs.error(err, this.translate)
            }
        })
    }
    openEditTransferMethod(m: Method) {
        const modal = this.modal.open(EditTransferMethodComponent, { centered: true, size: 'xl' })
        modal.componentInstance.method = m
    }
    changeStatus(method:Method) {
        method.active = !method.active
        this.methodService.addUpdateMethod(method).subscribe({
            next: res => {
                if (res)
                    
                Dialogs.success('Transfer method updated!', this.translate)
            },

            error: err => {
                
                Dialogs.error(err, this.translate)

            }
        })
    }
}