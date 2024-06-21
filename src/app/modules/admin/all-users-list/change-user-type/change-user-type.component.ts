import { AfterViewInit, Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { Dialogs } from "src/app/shared/dialogs";
import { UserTypes } from "src/app/shared/helper";

@Component({
    selector: 'change-user-type',
    templateUrl: 'change-user-type.component.html',
    styleUrls: ['change-user-type.component.scss']
})
export class ChangeUserTypeComponent implements AfterViewInit {

    @Input() types: {name:string,type:UserTypes}[] = [
        {
            name:'Agent',
            type:UserTypes.Agent
        },
        {
            name:'Customer',
            type:UserTypes.Customer
        },
        {
            name:'Manager',
            type:UserTypes.Manager
        },
        {
            name:'Call center',
            type:UserTypes.CallCenter
        }
    ]
    typeForm: FormGroup
    constructor(private modal: NgbModal,
        private translate:TranslateService) {
        this.typeForm = new FormGroup({
            type: new FormControl(Validators.required)
        })
    }
    ngAfterViewInit(): void {
        this.typeForm.controls['type'].setValue(this.types[0].type)

    }
    ngOnInit() {
    }
    close() {
        this.modal.dismissAll()
    }
    add() {
        if (this.typeForm.invalid) return (Dialogs.error('you need to select type!',this.translate))
        this.modal.dismissAll(this.types.find(r=>r.type = this.typeForm.controls['type'].value).type)
    }
 
}