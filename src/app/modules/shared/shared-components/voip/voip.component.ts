import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "src/app/core/models/auth.models";

@Component({
    selector: 'voip',
    templateUrl: 'voip.component.html'
})
export class VoipComponent {

    @Input() user: User
    connectionState = 'connecting'
    phone: any;
    constructor(private activeModal: NgbActiveModal) {

    }
    ngOnInit() {

        this.phone = window.open('', 'popupWindow',
            'width=400,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,left=0,top=0,screenX=0,screenY=0,visible=none,focus=no,alwaysRaised=yes,dependent=yes,chrome=yes,centerscreen=yes');
        this.phone.webphone_api.setparameter('destination', this.user.phone, false);
        this.phone.webphone_api.call(this.user.phone)
        // setTimeout(() => {
        //     this.connectionState = 'connected'
        // }, 2000);

        // setTimeout(() => {
        //     this.connectionState = 'connection failed'
        // }, 10000);
    }
    close() {
        this.activeModal.close()
    }
}