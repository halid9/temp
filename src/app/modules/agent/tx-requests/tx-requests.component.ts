import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { UserTypes } from "src/app/shared/helper";

@Component({
    selector: 'tx-requests',
    templateUrl: 'tx-requests.component.html',
    styleUrls: ['tx-requests.component.scss'],
})
export class TxRequestsComponent {

    constructor(private router:Router) {

    }
    ngOnInit(){
        this.router.navigate(['transactions','transactions-history'])
    }

}