import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountsService } from "src/app/core/services/accounts.service";

@Component({
    selector:'change-first-name-form',
    templateUrl:'change-first-name-form.component.html',
    styleUrls:['change-first-name-form.component.scss']
})
export class ChangeFirstNameComponent{
@Input() accountId:number = 0

firstName:string = ''

constructor(private accountsService:AccountsService,private modal:NgbModal){

}

changeFirstName(){

this.accountsService.changeFirstName(this.accountId,this.firstName).subscribe(
    res =>{
        
            this.modal.dismissAll()
        
    }
    
)
}

}