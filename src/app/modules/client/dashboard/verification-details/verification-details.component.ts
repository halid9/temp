import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CookieService } from "ngx-cookie-service";
import { VerificationState } from "src/app/core/models/auth.models";
import { DepositComponent } from "../../transactions/deposit/deposit.component";
import { CompleteProfileComponent } from "src/app/modules/shared/shared-components/complete-profile/complete-profile.component";
import { AuthenticationService } from "src/app/core/services/auth.service";

@Component({
    selector: "verification-details",
    templateUrl: "verification-details.component.html"
})
export class VerificationDetailsComponent {
    dir = 'ltr'
    @Input() verificationState: VerificationState
    docsState: 'rejected' | 'pending' | 'approved' | 'empty' = null
    constructor(private cookie: CookieService,
        private activeModal: NgbActiveModal,
        private auth: AuthenticationService,
        private modal: NgbModal,
        private router: Router) {

    }
    ngOnInit() {
        this.dir = this.cookie.get('language')
        const docs = this.verificationState.state.docs
        if (!docs.length) {
            this.docsState = 'empty'
        }
        if (docs.length) {
            this.docsState = docs.some(d => d.status == "rejected") ? 'rejected' : docs.some(d => d.status == "pending") ? 'pending' : 'approved'
        }

    }
    close() {
        this.activeModal.dismiss()
    }
    goToSettings() {
        this.router.navigate(["settings", "edit-profile"])
    }
    openDepositForm(fromVerify?: boolean) {

        const modal = this.modal.open(DepositComponent, { centered: true, size: 'xl' })
        modal.componentInstance.isDialog = true

    }
    openCompleteProfile() {
        this.modal.open(CompleteProfileComponent, { centered: true, size: 'xl' })
    }
    goToDocs() {
        this.router.navigate(['settings', 'profile'], { fragment: '4' })
        this.activeModal.dismiss()
    }
}