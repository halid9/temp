import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/core/services/rest-api.service';
import { LocaleKeys } from 'src/app/shared/locale_keys';
import { AccountModel } from 'src/app/store/Account/account_model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-change-name',
    templateUrl: './change-name.component.html',
    styleUrl: './change-name.component.scss'
})
export class ChangeNameComponent {
    isSubmit: boolean = false;
    get localeKeys() {
        return LocaleKeys;
    }
    get form() {
        return this.changeNameForm.controls;
    }
    isInProcess: any;
    @Input() data!: AccountModel;
    changeNameForm!: UntypedFormGroup;
    constructor(private activeModal: NgbActiveModal, private formBuilder: UntypedFormBuilder, private restApiService: RestApiService) {

    }
    ngOnInit(): void {
        this.changeNameForm = this.formBuilder.group({
            name: [this.data.accountName, Validators.required]
        });
    }
    dismiss() {
        this.changeNameForm.reset();
        this.activeModal.dismiss('Cross click');
    }
    submit() {
        this.isInProcess = true;
        this.isSubmit = true;
        if (this.changeNameForm.invalid) {
            return;
        }
        this.restApiService.changeAccountName(this.data.id, this.changeNameForm.value['name']).subscribe((res) => {
            this.isInProcess = false;
            this.activeModal.close('Close click');
            Swal.fire({
                title: LocaleKeys.GLOBAL_SUCCESS,
                text: LocaleKeys.CLIENT_ACCOUNTS_CHANGE_NAME_SUCCESS,
                icon: 'success',
                confirmButtonText: 'Ok'
            });
        }, (error) => {
            this.isInProcess = false;
            Swal.fire({
                title: LocaleKeys.GLOBAL_ERROR,
                text: error,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        });
    }
}
