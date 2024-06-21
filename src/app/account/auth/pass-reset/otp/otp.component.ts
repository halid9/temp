import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from 'src/app/core/services/language.service';
import { OTPService } from 'src/app/core/services/otp.service';
import { Dialogs } from 'src/app/shared/dialogs';
import { Response } from 'src/app/shared/helper';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})

/**
 * Pass-Reset Basic Component
 */
export class OtpComponent implements OnInit {

  // Login Form
  otpForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  dir = 'ltr'
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
  countryName: any
  flagvalue: any
  cookieValue: any
  valueset:any
  // set the current year
  year: number = new Date().getFullYear();
loading = false
  constructor(public otp: OTPService, 
    private router: Router,
    private translate:TranslateService,
    private languageService: LanguageService,
    public _cookiesService: CookieService) { }

    setLanguage(text: string, lang: string, flag: string) {
      this.countryName = text;
      this.flagvalue = flag;
      this.cookieValue = lang;
      this.languageService.setLanguage(lang);
      this.cookieValue == 'ar' ? this.dir = 'rtl' : this.dir = "ltr"
  
    }
  ngOnInit(): void {

    this.cookieValue = this._cookiesService.get('lang');
    this.cookieValue == 'ar' ? this.dir = 'rtl' : this.dir = "ltr"
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.svg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }


    /**
     * Form Validatyion
     */
    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required])
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.otpForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
this.loading = true
    // stop here if form is invalid
    if (this.otpForm.invalid) return;
    this.otp.checkOTP(this.f['otp'].value).subscribe({
      next: (res: Response<any>) => {
        this.otp.otp=this.f['otp'].value
        this.loading = false
        this.router.navigate(['auth', 'pass-create', 'basic'])
        Dialogs.success(res.message,this.translate)
      },
      error: err => {
        this.loading = false
        Dialogs.error(err,this.translate)
      }

    })

  }

}
