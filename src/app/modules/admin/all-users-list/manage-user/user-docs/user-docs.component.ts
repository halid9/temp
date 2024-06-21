import { HttpResponse } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { User } from "src/app/core/models/auth.models";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { DataService } from "src/app/core/services/data.service";
import { DocumentsService } from "src/app/core/services/documents.service";
import { FileManagerService } from "src/app/core/services/file-manager.service";
import { UploadFormComponent } from "src/app/modules/client/user/profile/upload-form/upload-form.component";
import { AddNoteComponent } from "src/app/modules/shared/shared-components/accounts/add-note/add-note.component";
import { DatePickerComponent } from "src/app/modules/shared/shared-components/date-picker/date-picker.component";
import { Dialogs } from "src/app/shared/dialogs";
import { ViewContentComponent } from "src/app/shared/view-content/view-content.component";

@Component({
    selector:"user-docs",
    templateUrl:"user-docs.component.html"
})
export class UserDocsComponent{
   @Input() docs = []
   @Input() user :User
    constructor(private modal:NgbModal,
        private docService: DocumentsService,
        private dataService:DataService,
        private fileService:FileManagerService,
        private auth:AuthenticationService,
        private translate:TranslateService
    ){

    }
    preview(doc) {
        const modal = this.modal.open(ViewContentComponent, { centered: true, size: 'xl' })
        modal.componentInstance.src = doc.url
        modal.componentInstance.user = this.user
        modal.componentInstance.showUserInfo = true

        if (doc.status === 'pending') modal.componentInstance.view = false
        if (doc.type.includes('image')) modal.componentInstance.type = 'image'
        else modal.componentInstance.type = 'pdf'

        modal.closed.subscribe(result => {
          if (result) {
            result == 'approve' ? this.approve(doc.id) : this.reject(doc.id)
          }
        })
    }
    openUploadForm() {
        const modal = this.modal.open(UploadFormComponent, { centered: true, size: 'lg' })
        modal.componentInstance.user = this.user
        modal.componentInstance.docs = this.docs

        modal.closed.subscribe(async res => {
            if (res) {
                await this.dataService.refreshAllUsers()
                Dialogs.success("Files uploaded successfully!",this.translate)
                this.loading =true
                await this.auth.getUserById(this.user.id).then(
                    res=>{
                        this.user = res
                        this.initDocs()
                    }
                )
            }
        })

    }

    // download(doc){

    // }

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
      download(doc: any) {
        
        const downloadLink = document.createElement('a');
        downloadLink.href = doc.url
        const filename = doc.fileName
        downloadLink.download = filename ?? 'default.jpeg'; // Set the desired file name
        downloadLink.click();
        
      }
    approve(id: any) {

        this.modal.open(DatePickerComponent, { centered: true }).closed.subscribe(
          data => {
            if (!data) return
            if (data.later) this.docService.doAction('approve', id).then(() => { 
                this.dataService.refreshAllUsers()
                this.docs.find(d=>d.id == id).status = 'approved'
                this.docs.find(d=>d.id == id).status_color = 'success'
            
            })
            if (!data.later) this.docService.doAction('approve', id, null, data.date).then(() => {
                 this.dataService.refreshAllUsers() 
                this.docs.find(d=>d.id == id).status = 'approved'
                this.docs.find(d=>d.id == id).status_color = 'success'
            
            })
          }
        )
      }
      reject(id: any) {
        const modal = this.modal.open(AddNoteComponent, { centered: true })
        modal.closed.subscribe(
          note => {
            if (note) this.docService.doAction('reject', id, note).then(() => { 
                this.dataService.refreshAllUsers() 
                this.docs.find(d=>d.id == id).status = 'rejected'
                this.docs.find(d=>d.id == id).status_color = 'danger'
                this.docs.find(d=>d.id == id).note = note 
            })
    
    
          }
        )
      }




      //replace

      type:any
      title:any
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
             this.auth.updateUserById(this.user.id,{ documentFile }).subscribe(
                 {
                     next: async res => {
                         await this.auth.getUserById(this.user.id).then(res => { this.user = res; this.docs = []; this.initDocs() })
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
         loading = false
         initDocs() {
            this.docs = []
            this.user?.documents.forEach((d, i) => {
                this.fileService.getFile(d.file.id).subscribe({
                    next: (res: HttpResponse<Blob>) => {
                        const url = URL.createObjectURL(res.body)
                        const type = res.headers.get('Content-Type')
                        // const fileName = this.fileService.getFileNameFromResponse(res)
                        // const doc = this.docs.find(doc => doc.type == d.type)
                        const doc = {
                            id: d.id,
                            name: d.title,
                            fileId: d.file.id,
                            expirationDate: d.expirationDate,
                            createdAt: d.createdAt,
                            url: url,
                            type: type.includes('image') ? 'image' : 'pdf',
                            fileType: d.type,
                            status: d.status,
                            note: d.note,
                            loading: false,
                            status_color: d.status == 'pending' ? 'warning' : d.status == 'approved' ? 'success' : 'danger',
                            size: d.size
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
}