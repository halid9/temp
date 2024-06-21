import { Component, Input } from "@angular/core";
import { User } from "src/app/core/models/auth.models";
import { firstValueFrom } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FileManagerService } from "src/app/core/services/file-manager.service";
import { ViewContentComponent } from "src/app/shared/view-content/view-content.component";

@Component({
    selector: 'acc-req-user-info',
    templateUrl: "acc-req-user-info.component.html",
    styleUrls: ["acc-req-user-info.component.scss"]
})
export class AccReqUserInfoComponent {
    @Input() user: User
    loading = true
    docs: { id: any, name: string, url: any, status: string }[] = [
    ]
    constructor(private fileManager: FileManagerService,private modal:NgbModal) {

    }

    ngOnInit() {
        this.initFiles()
    }




    initFiles() {
        this.user.documents.forEach(async (d,i) => {
            const res = await firstValueFrom(this.fileManager.getFile<HttpResponse<Blob>>(d.file.id))
            if (res) {
                const doc = {
                    name: d.title,
                    status: d.status,
                    url: URL.createObjectURL(res.body),
                    id: d.file.id
                }
                this.docs.push(doc)
            }
            if(i>= this.user.documents.length -1)  this.loading = false
        })
    }
    preview(doc) {
        const modal = this.modal.open(ViewContentComponent, { centered: true, size: 'xl' })
        modal.componentInstance.src = doc.url
        modal.componentInstance.type = doc?.type ?? 'image'
    }



}