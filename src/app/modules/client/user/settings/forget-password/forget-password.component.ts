import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'forget-password',
    templateUrl: 'forget-password.component.html',
    styleUrls: ['forget-password.component.scss']
})
export class forgetPasswordComponent {
    forgetForm: FormGroup
    @Input() email: ''
    submitted: boolean = false

    constructor(private modal: NgbModal) {

    }

    ngOnInit() {

        this.forgetForm = new FormGroup({
            email: new FormControl(this.email, Validators.required)
        })
    }
    close() {
        this.modal.dismissAll()
    }
    sendEmail() {
        this.submitted = true
        if (!this.forgetForm.valid) return
        this.modal.dismissAll(this.forgetForm.value)
    }
}