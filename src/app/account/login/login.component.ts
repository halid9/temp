import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
// Login Auth
import { AuthenticationService } from '../../core/services/auth.service';
import { ToastService } from './toast-service';
import { LanguageService } from 'src/app/core/services/language.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  uuid: string = ''
  // set the current year
  year: number = new Date().getFullYear();
  isError = false
  errMessage = ''
  valueset: any;
  dir = 'ltr'
  totp_enabled: boolean = false

  constructor(private formBuilder: UntypedFormBuilder, private authenticationService: AuthenticationService, private router: Router,
    private route: ActivatedRoute, public toastService: ToastService,
    private languageService: LanguageService,
    public _cookiesService: CookieService) {
    // redirect to home if already logged in
    if (this.authenticationService._currentUser) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }
  rememberMe: boolean
  email = ''
  avatar: any
  fullName = ''
  ngOnInit(): void {
    const rememberMe = localStorage.getItem('rememberMe')
    this.rememberMe = rememberMe ? true : false
    this.email = localStorage.getItem('rememberMeEmail')
    this.avatar = this.getBlobFromLocalStorage('rememberMeAvatar')
    this.fullName = localStorage.getItem('rememberMeFullName')

    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    this.cookieValue == 'ar' ? this.dir = 'rtl' : this.dir = "ltr"
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.svg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
    const token = localStorage.getItem('token')
    if (token) {
      // this.authenticationService.verifyToken(token)
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
      this.loginForm.controls['email'].setValue(this.email)
      this.loginForm.controls['rememberMe'].setValue(this.rememberMe)
    }
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.totp_enabled = false

    if (window['rChat']) {
      window['rChatUserID'] = 0;
      window['rChat'].registerGuest({ name: '', email: '' });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  loggingIn = false
  onSubmit() {
    this.submitted = true;
    this.loggingIn = true
    // Login Api
    if (!this.loginForm.valid) {
      this.loggingIn = false
      return
    }
    this.uuid = localStorage.getItem('uuid')
    if (!this.uuid) {
      this.uuid = uuidv4()
      localStorage.setItem('uuid', this.uuid)
    }
    this.authenticationService.login(this.f['email'].value.toLocaleLowerCase(), this.f['password'].value, this.f['rememberMe'].value, this.uuid, this.f['totp'].value).subscribe(
      {
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem('verificationState', JSON.stringify(res.payload))
            localStorage.setItem('token', res.payload.access_token);
            localStorage.setItem('userId', res.payload.id)
            if (this.f['rememberMe'].value) {
              localStorage.setItem('rememberMe', this.f['rememberMe'].value)
              localStorage.setItem('rememberMeEmail', this.f['email'].value.toLocaleLowerCase())

            }
            this.authenticationService.getCurrentUser().then(() => { this.router.navigate(['']) })
          }
          if (!res.success) {
            if (res.payload && res.payload.totp_enabled && !this.totp_enabled) {
              this.totp_enabled = true
              this.loggingIn = false
              this.submitted = false
              
            } else if (res.payload && res.payload.totp_enabled && this.totp_enabled) {
              this.isError = true
              this.loggingIn = false
              this.errMessage = 'Invalid 2FA Code'

            } else {
              this.loggingIn = false
              localStorage.setItem('verificationState', JSON.stringify(res.payload))
              this.router.navigate(['auth', 'twostep', 'email'])
            }
          }
        },
        error: err => {
    this.loggingIn = false

          this.isError = true
          this.errMessage = err

        }
      });
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  goToForgot() {
    this.router.navigate(['auth', 'pass-reset', 'basic'])
  }

  countryName: any
  flagvalue: any
  cookieValue: any
  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    // { text: 'Española', flag: 'assets/images/flags/spain.svg', lang: 'es' },
    // { text: 'Deutsche', flag: 'assets/images/flags/germany.svg', lang: 'de' },
    // { text: 'Italiana', flag: 'assets/images/flags/italy.svg', lang: 'it' },
    // { text: 'русский', flag: 'assets/images/flags/russia.svg', lang: 'ru' },
    // { text: '中国人', flag: 'assets/images/flags/china.svg', lang: 'ch' },
    // { text: 'français', flag: 'assets/images/flags/french.svg', lang: 'fr' },
    { text: 'Arabic', flag: 'assets/images/flags/ae.svg', lang: 'ar' },
  ];

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
    this.cookieValue == 'ar' ? this.dir = 'rtl' : this.dir = "ltr"

  }
  sigInWithDifAcc() {
    this.rememberMe = false
    localStorage.clear()
    this.loginForm.controls['rememberMe'].setValue(false)
  }
  getBlobFromLocalStorage(key): Blob | string | null {
    const base64Data = localStorage.getItem(key);
    if (base64Data) {
      // return this.base64ToBlob(base64Data);
      return base64Data;
    }
    return null;
  }

  private base64ToBlob(base64Data: string): Blob {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/octet-stream' });
  }
}
