import { Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { Dialogs } from "src/app/shared/dialogs";

@Component({
    selector:'add-note',
    templateUrl:'add-note.component.html'
})
export class AddNoteComponent{
    note:string
    
    constructor(private modal:NgbActiveModal,private translate:TranslateService){}
    close(){
        this.modal.dismiss()
    }

    submit(){
        if(!this.note)return Dialogs.error('You need to add reason', this.translate)
        this.modal.close(this.note)
    }
}