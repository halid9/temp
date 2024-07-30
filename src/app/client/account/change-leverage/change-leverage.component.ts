import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/core/services/rest-api.service';
import { LocaleKeys } from 'src/app/shared/locale_keys';

@Component({
    selector: 'app-change-leverage',
    templateUrl: './change-leverage.component.html',
    styleUrl: './change-leverage.component.scss'
})
export class ChangeLeverageComponent {
    isInProcess: boolean = false;
    constructor(private activeModal: NgbActiveModal, private formBuilder: UntypedFormBuilder, private restApiService: RestApiService) { }
    get form() {
        return this.changeLeverageForm.controls;
    }
    get localeKeys() {
        return LocaleKeys;
    }
    ngOnInit(): void {
        this.changeLeverageForm = this.formBuilder.group({
            leverage: ['']
        });
    }

    dismiss() {

    }
    changeLeverageForm!: UntypedFormGroup;
    isSubmit: any;
    submit() {
        try {
            this.isInProcess = true;
            this.isSubmit = true;
            if (this.changeLeverageForm.invalid) {
                return;
            }
        } catch (e) {
        } finally {
            this.isInProcess = false;
        }
    }

}
