import { HttpClient, HttpResponse } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { firstValueFrom } from "rxjs";
import { User } from "src/app/core/models/auth.models";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { DataService } from "src/app/core/services/data.service";
import { FileManagerService } from "src/app/core/services/file-manager.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "manage-user",
    templateUrl: "manage-user.component.html"
})
export class ManageUserComponent {
    @Input() user: User
    loadingDocs = true
    docs = []
    userDocs = []
    loggedInDevices = []
    addingNote = false
    note = ''
    constructor(
        private fileManager: FileManagerService,
        private activeModal: NgbActiveModal,
        private auth:AuthenticationService,
        private ds: DataService,
        private http: HttpClient) { }


    close() {
        this.activeModal.dismiss()
    }
    ngOnInit() {
        this.note = this.user?.note ?? ''
        this.ds.refreshLoggedInDevicesByUserId(this.user.id)
        this.ds.loggedInDevicesByUserId$.subscribe(ld=>{
            this.loggedInDevices = ld
        })
        this.getDocs().then(()=>this.loadingDocs = false)
    }



    async addNote(){
        this.addingNote = true
       await this.auth.updateUserById(this.user.id,{note:this.note})
       await this.auth.getUserById(this.user.id).then(res=>{
        if(res) this.user = res
        this.addingNote = false
       })
    }

  
    async getDocs() {
        await firstValueFrom(this.http.get(`${environment.apiUrl}/document/users-documents/${this.user.id}`)).then(docs => {
            this.userDocs = docs as any[]
            this.initFiles()
        })
    }
    initFiles() {
        this.userDocs.forEach(async (d, i) => {
            const res = await firstValueFrom(this.fileManager.getFile<HttpResponse<Blob>>(d.file.id))
            if (res) {
                const url = URL.createObjectURL(res.body)
                    const type = res.headers.get('Content-Type')
                    const doc = {
                        id: d.id,
                        name:d.title,
                        fileId: d.file.id,
                        expirationDate:d.expirationDate,
                        createdAt:d.createdAt ,
                        url: url,
                        type: type.includes('image') ? 'image' : 'pdf',
                        fileType:d.type,
                        status: d.status,
                        note: d.note,
                        loading: false,
                        status_color: d.status == 'pending'?'warning':d.status=='approved'?'success':'danger',
                        size:d.size
                    }
                this.docs.push(doc)
            }
            if (i >= this.userDocs.length - 1) this.loadingDocs = false
        })
    }
}