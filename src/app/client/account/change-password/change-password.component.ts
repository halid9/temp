import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/core/services/rest-api.service';
import { LocaleKeys } from 'src/app/shared/locale_keys';
import { AccountModel } from 'src/app/store/Account/account_model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
    isInProcess: boolean = false;
    dismiss() {
        this.activeModal.dismiss('Cross click');
    }

    constructor(private activeModal: NgbActiveModal, private formBuilder: UntypedFormBuilder, private restApiService: RestApiService) {
    }
    get form() {
        return this.changePasswordForm.controls;
    }
    isSubmit: boolean = false;
    changePasswordForm!: UntypedFormGroup;
    @Input() data!: AccountModel;
    ngOnInit(): void {
        this.changePasswordForm = this.formBuilder.group({
            newPassword: ['', Validators.required],
            confirmPassword: ['', [Validators.required]]
        });
    }
    get localeKeys() {
        return LocaleKeys;
    }
    submit() {
        this.isInProcess = true;
        this.isSubmit = true;
        if (this.changePasswordForm.invalid) {
            return;
        }
        this.restApiService.changeAccountPassword(this.data.id, this.changePasswordForm.value['newPassword']).subscribe((res) => {
            Swal.fire({
                title: LocaleKeys.GLOBAL_SUCCESS,
                text: LocaleKeys.CLIENT_ACCOUNTS_CHANGE_PASSWORD_SUCCESS,
                icon: 'success',
                confirmButtonText: 'Ok'
            });
            this.isInProcess = false;
            this.activeModal.close('Close click');
        }, (error) => {
            Swal.fire({
                title: LocaleKeys.GLOBAL_ERROR,
                text: error,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            // console.log(error);
            this.isInProcess = false;
        });
    }
    // ConfirmedValidator(controlName: string, matchingControlName: string) {
    //     return (formGroup: UntypedFormBuilder) => {
    //         const control = formGroup.control[controlName];
    //         const matchingControl = formGroup.control[matchingControlName];
    //         if (
    //             matchingControl.errors &&
    //             !matchingControl.errors.ConfirmedValidator
    //         ) {
    //             return;
    //         }
    //         if (control.value !== matchingControl.value) {
    //             matchingControl.setErrors({ confirmedValidator: true });
    //         } else {
    //             matchingControl.setErrors(null);
    //         }
    //     };
    // }

}