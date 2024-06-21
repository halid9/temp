import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "header-map",
    templateUrl: "header-map.component.html",
    styleUrls: ["header-map.component.scss"]
})
export class HeaderMapComponent {
    submitted = false
    @Input() headers: string[] = []
    mappedHeaders = {
        firstName:'',
        lastName:'',
        phone:'',
        email:'',
        natunality:'',
        tradingExperience:'',
        anotherCompanyAccount:'',
        anotherCompanyDetails:'',
        leadSource:'',
        leadStatus:'', 
        work:'',
        address:'',
        customerInterestScale:'',
        blackList:'',
        reason:'',
        notes:'',
    
    }
    constructor(private activeModal: NgbActiveModal) {

    }
    submit(){
        this.submitted = true
        if(!this.mappedHeaders.email && !this.mappedHeaders.phone) return
        console.log(this.mappedHeaders)
        this.activeModal.close(this.mappedHeaders)
    }
}