import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Lead } from "src/app/core/models/lead.model";

@Component({
    selector: 'lead-card',
    templateUrl: "lead-card.component.html"
})
export class LeadCardComponent {
    @Input() lead: Partial<Lead>
    constructor(private activeModal: NgbActiveModal) {

    }


    close() {
        this.activeModal.close()
    }

    tradingExperience(v) {

        v = parseInt(v)
    
        return [
          'NOEXPERIENCE',
          'LESSTHANYEAR',
          "ONEYEAR",
          "TWOYEARS",
          "THREEYEARS",
          "FOURYEARS",
          "MORETHANFOURYEARS"
        ][v];
    
      }


}