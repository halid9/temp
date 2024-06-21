import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountsService } from "src/app/core/services/accounts.service";

@Component({
    selector:'change-note-form',
    templateUrl:'change-note-form.component.html',
    styleUrls:['change-note-form.component.scss']
})
export class ChangeNoteComponent{
@Input() accountId:number = 0

note:string = ''

constructor(private accountsService:AccountsService,private modal:NgbModal){

}

changeNote(){

this.accountsService.changeNote(this.accountId,this.note).subscribe(
    res =>{
            this.modal.dismissAll()
    },
    error=>{

        alert(error)
    }
)
}

}