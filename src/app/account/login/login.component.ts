import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { ConfigData } from 'src/app/shared/config-data';
import { LocaleKeys } from 'src/app/shared/locale_keys';
import { AuthenticationService } from '../../core/services/auth.service';
import { ToastService } from './toast-service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

    uuid: string = ''
    // Login Form
    loginForm!: UntypedFormGroup;
    submitted = false;
    fieldTextType!: boolean;
    error = '';
    returnUrl!: string;
    // set the current year
    year: number = new Date().getFullYear();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private authenticationService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute,
        public toastService: ToastService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit(): void {
        const rememberMe = localStorage.getItem('rememberMe') ? localStorage.getItem('rememberMe') : '';
        const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
        const password = localStorage.getItem('password') ? localStorage.getItem('password') : '';
        if (localStorage.getItem('currentUser')) {
            this.router.navigate(['/']);
        }
        /**
         * Form Validatyion
         */
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            rememberMe: [false],
            totp: ['']
        });
        if (rememberMe) {
            this.loginForm.patchValue({
                email: email,
                password: password,
                rememberMe: true
            });
        }
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    /**
     * Form submit
     */
    get localeKeys() {
        return LocaleKeys;
    }
    get config() {
        return ConfigData.config;
    }
    onSubmit() {
        this.submitted = true;
        // Login Api
        const currentUUID = localStorage.getItem('uuid')
        if (!currentUUID) {
            const random_bytes = new Uint8Array(32);
            window.crypto.getRandomValues(random_bytes);
            const bytesHex = random_bytes.reduce((o, v) => o + ('00' + v.toString(16)).slice(-2), '');
            this.uuid = [bytesHex.substr(0, 8), bytesHex.substr(8, 4), bytesHex.substr(12, 4), bytesHex.substr(16, 4), bytesHex.substr(20, 12)].join('-');
            localStorage.setItem('uuid', this.uuid)
        } else {
            this.uuid = currentUUID
        }
        this.authenticationService.login(this.f['email'].value.toLocaleLowerCase(), this.f['password'].value, this.f['rememberMe'].value, this.uuid, this.f['totp'].value).subscribe(
            (data: any) => {
                if (data.status == 'success') {
                    localStorage.setItem('toast', 'true');
                    localStorage.setItem('currentUser', JSON.stringify(data.data));
                    localStorage.setItem('token', data.token);
                    this.router.navigate(['/']);
                } else {
                    this.toastService.show(data.data, { classname: 'bg-danger text-white', delay: 15000 });
                }
            });
    }

    /**
     * Password Hide/Show
     */
    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }

}
