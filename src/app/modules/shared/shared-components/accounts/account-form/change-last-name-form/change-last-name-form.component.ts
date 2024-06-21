import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountsService } from "src/app/core/services/accounts.service";

@Component({
    selector:'change-last-name-form',
    templateUrl:'change-last-name-form.component.html',
    styleUrls:['change-last-name-form.component.scss']
})
export class ChangeLastNameComponent{
@Input() accountId:number = 0

lastName:string = ''

constructor(private accountsService:AccountsService,private modal:NgbModal){

}

changeLastName(){

this.accountsService.changeLastName(this.accountId,this.lastName).subscribe(
    res =>{
            this.modal.dismissAll()
    }
)
}

}