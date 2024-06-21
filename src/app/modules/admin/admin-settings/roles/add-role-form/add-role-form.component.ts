import { Component, Input } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountsService } from "src/app/core/services/accounts.service";
import { Dialogs } from "src/app/shared/dialogs";
import { minMaxLengthValidator, preventConsecutiveLettersAndSequencesValidator } from "src/app/shared/validators";
import Swal from "sweetalert2";

@Component({
    selector: 'add-role-form',
    templateUrl: 'add-role-form.component.html',
    styleUrls: ['add-role-form.component.scss']
})
export class AddRoleComponent {

    submitted = false
    @Input() permissions: any[]
    selectedPermissions = []
    changeNameForm: FormGroup
    constructor(private accountsService: AccountsService, private modal: NgbModal) {
        this.changeNameForm = new FormGroup({
            name: new FormControl('', [Validators.required, preventConsecutiveLettersAndSequencesValidator(), minMaxLengthValidator(0,15)])
        })
    }
  
    get f() { return this.changeNameForm.controls; }
    changeValue(event: any, id: any) {

        if (event.target.checked) {

            this.selectedPermissions.push(this.permissions.find(p => p.id == id))
        }
        else {
            this.selectedPermissions = this.selectedPermissions.filter(p => p.id != id)
        }

    }
    onSubmit() {
        this.submitted = true
        if (this.changeNameForm.invalid) return
        this.modal.dismissAll({ name: this.f['name'].value, permissions: this.selectedPermissions.map(p => p.id) })
    }
    close() {
        this.modal.dismissAll()
    }
}