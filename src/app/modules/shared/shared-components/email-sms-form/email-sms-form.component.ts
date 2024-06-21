import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { MailingService } from "src/app/core/services/mailing.service";
import { Dialogs } from "src/app/shared/dialogs";

@Component({
    selector: "email-sms-form",
    templateUrl: "email-sms-form.component.html",
    styleUrls: ["email-sms-form.component.scss"]
})
export class EmailSmsFormComponent {
    sending = false
    @Input() destinations = []
    @Input() type: 'email' | 'phone' = 'email'
    message = ''
    subject = ''
    constructor(private activeModal: NgbActiveModal, private mailService: MailingService,private translate:TranslateService) {

    }
    submit() {
        this.sending = true
        switch (this.type) {
            case 'email':
                this.mailService.SendEmail({ destinations: this.destinations, message: this.message, subject: this.subject }).subscribe(
                    {
                        next:res=>{
                            Dialogs.success('email has been sent',this.translate)
                            this.sending = false
                            this.activeModal.close()
                        },
                        error:err=>{
                            Dialogs.error(err,this.translate)
                            this.sending = false
                        }
                    }
                )
                break;
            case 'phone':
                this.mailService.SendSMS({ destinations: this.destinations, message: this.message, subject: this.subject }).subscribe(
                    {
                        next:res=>{
                            Dialogs.success('SMS has been sent',this.translate)
                            this.sending = false
                            this.activeModal.close()
                        },
                        error:err=>{
                            Dialogs.error(err,this.translate)
                            this.sending = false
                        }
                    }
                )
                break;
            default:
                break;
        }
    }
}