import { AfterViewInit, Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { Role } from "src/app/core/models/role.model";
import { Dialogs } from "src/app/shared/dialogs";

@Component({
    selector: 'add-user-role',
    templateUrl: 'add-user-role.component.html',
    styleUrls: ['add-user-role.component.scss']
})
export class AddUserRoleComponent implements AfterViewInit {

    @Input() roles: Role[] = []
    @Input() status: ''
    roleForm: FormGroup
    constructor(private modal: NgbModal,
        private translate:TranslateService) {
        this.roleForm = new FormGroup({
            role: new FormControl(Validators.required)
        })
    }
    ngAfterViewInit(): void {
        this.roleForm.controls['role'].setValue(this.roles[0].id)

    }
    ngOnInit() {
    }
    close() {
        this.modal.dismissAll()
    }
    add() {
        if (this.roleForm.invalid) return (Dialogs.error('you need to select role!',this.translate))
        this.modal.dismissAll(this.roles.find(r=>r.id == this.roleForm.controls['role'].value))
    }
 
}