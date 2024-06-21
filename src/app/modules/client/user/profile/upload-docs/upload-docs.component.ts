import { Component, Input } from "@angular/core";
import { User } from "src/app/core/models/auth.models";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Dialogs } from "src/app/shared/dialogs";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UploadFormComponent } from "../upload-form/upload-form.component";
import { TranslateService } from "@ngx-translate/core";
import { FileManagerService } from "src/app/core/services/file-manager.service";
import { ViewContentComponent } from "src/app/shared/view-content/view-content.component";

export type Doc = {
    name: string
    status: 'rejected' | 'pending' | 'approved' | 'expired' | 'empty'
    id: any
    type: string
    note: string
    file?: {
        id?: any
        url?: any
        type?: 'image' | 'pdf'
        name?: string
    },
    loading: boolean
}
@Component({
    selector: 'upload-docs',
    templateUrl: 'upload-docs.component.html',
    styleUrls: ['upload-docs.component.scss']
})
export class UploadDocsComponent {
    user: User
    loading = true
    type = ''
    config = {
        maxFiles: 1
    };

    @Input() adminView: boolean
    @Input() docs = []
    title: any;
    constructor(private auth: AuthenticationService,
        private fileService: FileManagerService,
        private modal: NgbModal,
        private translate: TranslateService
    ) {

    }

    ngOnInit() {
        this.user = this.auth._currentUser
        if (!this.docs.length) {
            this.initDocs()
        }
        setTimeout(() => {

            this.docs.map(d => d.loading = false)
        }, 1000);
        this.loading = false
    }



    handleInputChange(file) {
        var file = file;
        // var pattern = /image-*/;
        var reader = new FileReader();
        // if (!file.type?.match(pattern)) {
        //     alert('invalid format');
        //     return;
        // }
        reader.onloadend = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
    }
    _handleReaderLoaded(e) {
        const doc = this.docs.find(d => d.fileType == this.type)
        // doc.loading = true
        let reader = e.target;
        var base64result = reader.result
        base64result;
        const documentFile = { image: base64result, type: this.type, title: this.title }
        this.auth.updateUser({ documentFile }).subscribe(
            {
                next: async res => {
                    await this.auth.getCurrentUser().then(res => { this.user = res; this.docs = []; this.initDocs() })
                    // doc.loading = false
                    Dialogs.success(`${doc.title} front uploaded successfully`, this.translate)
                },
                error: err => {
                    Dialogs.error(err, this.translate)
                    doc.loading = false

                }
            }
        )
    }
    // Function to handle the button click
    replace(type: string, status, title) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        if (status === 'approved') {
            Dialogs.confirm('New file will delete the approved file', this.translate, () => {
                fileInput.click();

            })
        }
        else fileInput.click();

        fileInput.addEventListener('change', (event) => {
            const selectedFiles = (event.target as HTMLInputElement).files;

            if (selectedFiles && selectedFiles.length > 0) {
                // Handle the selected files here
                for (let i = 0; i < selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    const doc = this.docs.find(d => d.fileType == type)
                    this.type = type
                    this.title = title
                    const url = URL.createObjectURL(file)
                    doc.url = url
                    // doc.loading = true
                    this.handleInputChange(file)
                }
            }
        });
    }

    preview(doc) {
        const modal = this.modal.open(ViewContentComponent, { centered: true, size: 'xl' })
        modal.componentInstance.src = doc.url
        modal.componentInstance.type = doc.type
    }
    initDocs() {
        this.docs = []
        this.user?.documents.forEach((d, i) => {
            this.fileService.getFile(d?.file?.id).subscribe({
                next: (res: HttpResponse<Blob>) => {
                    const url = URL.createObjectURL(res.body)
                    const type = res.headers.get('Content-Type')
                    // const fileName = this.fileService.getFileNameFromResponse(res)
                    // const doc = this.docs.find(doc => doc.type == d.type)
                    const doc = {
                        id: d?.id,
                        name: d?.title,
                        fileId: d?.file?.id,
                        expirationDate: d.expirationDate,
                        createdAt: d.createdAt,
                        url: url,
                        type: type.includes('image') ? 'image' : 'pdf',
                        fileType: d?.type,
                        status: d?.status,
                        note: d?.note,
                        loading: false,
                        status_color: d.status == 'pending' ? 'warning' : d.status == 'approved' ? 'success' : 'danger',
                        size: d?.size
                    }
                    this.docs.push(doc)
                    if (i >= this.user?.documents.length - 1) this.loading = false

                },

                error: err => {
                    Dialogs.error(err, this.translate)
                }
            }
            )
        })
    }
    openUploadForm() {
        const modal = this.modal.open(UploadFormComponent, { centered: true, size: 'lg' })
        modal.componentInstance.user = this.user
        modal.componentInstance.docs = this.docs

        modal.closed.subscribe(async res => {
            if (res) {
                this.loading = true
                Dialogs.success("Files uploaded successfully!",this.translate)
                this.user = await this.auth.getCurrentUser()
                this.initDocs()
            }
        })

    }
    download(doc) {
        const downloadLink = document.createElement('a');
        downloadLink.href = doc.url
        const filename = doc?.name ?? 'master'
        downloadLink.download = filename ?? 'default.jpeg'; // Set the desired file name
        downloadLink.click();
    }
}