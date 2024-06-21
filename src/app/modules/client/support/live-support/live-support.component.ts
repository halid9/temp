import { Component } from "@angular/core";
import { AuthenticationService } from "src/app/core/services/auth.service";

@Component({
    selector: 'live-support',
    templateUrl: 'live-support.component.html',
    styleUrls: ['live-support.component.scss']
})
export class LiveSupportComponent {

    constructor(private auth: AuthenticationService) { }

    ngOnInit() {
        if (window['rChat']) {
            if (!window['rChatUserID']) window['rChatUserID'] = 0;
            if (this.auth._currentUser?.email && window['rChatUserID'] != this.auth._currentUser?.id) {
                window['rChatUserID'] = this.auth._currentUser?.id;
                window['rChat'].registerGuest({ token: 'CRM' + this.auth._currentUser?.id, name: this.auth._currentUser?.firstName + ' ' + this.auth._currentUser?.lastName + ' (' + this.auth._currentUser?.email + ')', email: this.auth._currentUser?.email });
                console.log('registerGuest', this.auth._currentUser?.id)
            }
        }
    }

}