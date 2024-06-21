import { Component } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { User } from "src/app/core/models/auth.models";
import { FileManagerService } from "src/app/core/services/file-manager.service";
import { NotificationsService } from "src/app/core/services/notifications.service";

@Component({
    selector: 'upload-form',
    templateUrl: 'upload-form.component.html',
    styleUrls: ['upload-form.component.scss']
})
export class UploadFormComponent {

    // files: File[] = [];
    user: User
    constructor(
        private uploadService: FileManagerService,
        private userService: AuthenticationService,
        private notifications: NotificationsService,
        private modal: NgbModal,
        private activeModal: NgbActiveModal) { }
    // onSelect(event: any) {
    //     this.files.push(...event.addedFiles);
    // }

    // onRemove(event: any) {
    //     this.files.splice(this.files.indexOf(event), 1);
    // }
    docTitle = 'id'
    docs = []
    imageSrc;
    idFrontFile: any;
    idBackFile: any;
    passportFile: any;
    personalPictureFile: any;
    //base64s
    idFrontString: string = ''
    idBackString: string = ''
    passportString: string = ''
    personalPictureString: string = ''
    //json
    documents: { image: string, type: string }[] = [];

    currentId: number = 0;



    files: { image: any, type: string, title: string }[] = []

    addFile(event, type) {
        const file = event.target.files[0]
        const reader = new FileReader();
        reader.onloadend = async (e) => {
            const readerResult = e.target.result as string
            const documentFile = { image: readerResult, type, title: type == 'addressDoc' ? 'addressDoc' : this.docTitle + type };
            this.files.some(f => f.type == type) ? this.files.find(f => f.type == type).image = readerResult : this.files.push(documentFile)
        };
        reader.readAsDataURL(file);
    }

    err = false
    msg = ''
    submitted = false
    async finalize() {
        this.submitted = true
        this.notifications.notifyAdmin({ title: "upload submitted", message: "user submitted for uploading docs" })

        await this.uploadDocs(this.files).then(async res => {
            if (res == this.files.length) {
                console.log(res)
                this.submitted = false
                this.activeModal.close("done")
                this.notifications.notifyAdmin({ title: "upload done", message: "user uploaded docs successfully!" })

            }

        }
        ).catch(err => {
            this.submitted = false
            this.err = true
            this.msg = err
        })




    }
    close() {
        this.activeModal.close()
    }
    uploadDocs(files: { image: any, type: string }[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const required = files.length
            let success = 0

            files.forEach(async (documentFile) => {
                this.userService.updateUserById(this.user.id, { documentFile }).subscribe({
                    next: res => {
                        if (res) {
                            console.log(res)
                            success++
                            if (success == required) resolve(success)
                        }
                    },
                    error: err => {
                        reject(err)
                    }
                })

            });
        })





    }

}
