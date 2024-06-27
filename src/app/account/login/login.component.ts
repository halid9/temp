import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { ConfigData } from 'src/app/shared/config-data';
import { LocaleKeys } from 'src/app/shared/locale_keys';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../core/services/auth.service';

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
    isLoading = true;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private authenticationService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute,
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
        this.isLoading = false;
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
    async onSubmit() {
        this.submitted = true;
        this.isLoading = true;
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
        try {
            const data = await this.authenticationService.login(this.f['email'].value.toLocaleLowerCase(), this.f['password'].value, this.f['rememberMe'].value, this.uuid, this.f['totp'].value).toPromise();

            if (data.success) {
                const user = data.payload;
                localStorage.setItem('token', user.access_token);
                delete user.access_token;
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.router.navigate(['/']);
            }
        } catch (error) {
            Swal.mixin({
                icon: 'error',
                toast: true,
                // position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                text: error?.toString() ?? 'Login failed',
            }).fire();
        } finally {
            this.isLoading = false;
        }

    }

    /**
     * Password Hide/Show
     */
    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }

}
