import { Component } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'date-picker',
    templateUrl: 'date-picker.component.html',
    styleUrls: ['date-picker.component.scss']
})
export class DatePickerComponent {
    later = false
    date: any
    submitted = false
    constructor(private modal: NgbActiveModal) {

    }
    submit() {
        this.submitted = true
        if (!this.date && !this.later) return
        this.modal.close({ later: this.later, date: this.date })
    }
    close() {
        this.modal.dismiss()
    }

}