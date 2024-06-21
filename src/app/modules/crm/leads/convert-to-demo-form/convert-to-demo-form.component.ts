import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Lead } from "src/app/core/models/lead.model";
import { LeadsService } from "../leads.service";

@Component({
    selector: 'convert-to-demo-form',
    templateUrl: 'convert-to-demo-form.component.html',
    styleUrls: ['convert-to-demo-form.component.scss']
})
export class ConvertToDemoForm {
    @Input() isDialog = true
    @Input() id: number = 0
    @Input() lead: Partial<Lead> = {
        phone: '',
        email: '',
        firstName: '',
        lastName: '',
        address: ''
    }
    submitted = false
    form: FormGroup

    @Input() convertTo: 'demo' | 'live' = 'demo'

    constructor(private leadSrv: LeadsService,private activeModal:NgbActiveModal) {
        this.form = new FormGroup({
            phone: new FormControl(this.lead.phone, Validators.required),
            email: new FormControl(this.lead.email, Validators.required),
            firstName: new FormControl(this.lead.firstName, Validators.required),
            lastName: new FormControl(this.lead.lastName, Validators.required),
            address: new FormControl(this.lead.address, Validators.required),
        })
    }

    get f() { return this.form.controls }
    ngOnInit() {
        this.form.controls['firstName'].setValue(this.lead.firstName)
        this.form.controls['lastName'].setValue(this.lead.lastName)
        this.form.controls['phone'].setValue(this.lead.phone)
        this.form.controls['address'].setValue(this.lead.address)
        this.form.controls['email'].setValue(this.lead.email)
    }
    onSubmit(to: 'demo' | 'live') {
        this.submitted = true
        if (this.form.valid) {
            if (this.convertTo == 'demo') {

                this.leadSrv.convertToDemo(this.form.value, this.id).subscribe(
                    res => {
                        console.log(res)
                        
                    }
                )

                this.activeModal.close()

            }
            if (this.convertTo == 'live') {

                this.leadSrv.convertToLive(this.form.value, this.id).subscribe(
                    res => {
                        console.log(res)
                    }
                )

                this.activeModal.close()
            }
        }
    }
    closeDialog() {
        this.activeModal.dismiss()
    }
}