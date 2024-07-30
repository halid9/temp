import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/core/services/rest-api.service';
import { LocaleKeys } from 'src/app/shared/locale_keys';

@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html',
    styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
    constructor(private activeModal: NgbActiveModal, private formBuilder: UntypedFormBuilder, private restApiService: RestApiService) { }
    isInProcess: boolean = false;
    isSubmit: boolean = false;
    createAccountForm!: UntypedFormGroup;
    get localeKeys() {
        return LocaleKeys;
    }
    get form() {
        return this.createAccountForm.controls;
    }
    dismiss() {
        this.activeModal.dismiss('Cross click');
    }
    submit() {
        throw new Error('Method not implemented.');
    }
}
