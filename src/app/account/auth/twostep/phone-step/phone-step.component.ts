import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { OTPService } from 'src/app/core/services/otp.service';
import { Dialogs } from 'src/app/shared/dialogs';

@Component({
  selector: 'phone-step',
  templateUrl: 'phone-step.component.html',
  styleUrls: ['phone-step.component.scss']
})

/**
 * TwoStep Cover Component
 */
export class PhoneStepComponent implements OnInit {
  user: User
  // set the current year
  year: number = new Date().getFullYear();
  otpForm: FormGroup
  submitted = false
  loading = true
  path: string = ''
  state: any
  showNavigationArrows:any
  constructor(private otpService: OTPService,
     private auth: AuthenticationService,
      private router: Router,
      private translate:TranslateService) {

  }

  ngOnInit(): void {

    this.otpForm = new FormGroup({
      otp: new FormControl<any>(null, Validators.required),
      rememberDevice: new FormControl<any>(false)
    })
    this.state = JSON.parse(localStorage.getItem('verificationState'))
    this.otpService.requestPhoneVerify(this.state.phone).subscribe({
      next: res => {
        if (res) {
          this.loading = false
        }
      },
      error: err => {
        Dialogs.error(err,this.translate)
      }
    })
  }
  isValid = false
  onOtpChange(otp) {
    this.otpForm.controls['otp'].setValue(otp)
    this.otpForm.controls['otp'].value.length == 6 ?this.isValid = true : this.isValid = false

  }
  /**
  * Confirm Otp Verification
  */
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '60px',
      'height': '50px'
    }
  };

  onSubmit() {
    this.submitted = true
    if (this.otpForm.invalid) return
    const uuid = localStorage.getItem('uuid')
    this.otpService.verifyPhone(this.state.phone, this.otpForm.controls['otp'].value,uuid,this.otpForm.controls['rememberDevice'].value).subscribe({
      next: res => {
        //verify phone if not verify
        if (res?.['payload']?.access_token) { localStorage.setItem('token', res['payload'].access_token); this.router.navigate(['']) }
        else this.router.navigate([''])
      },
      error: err => {
        Dialogs.error(err,this.translate)
      }
    })

  }
  resend() {
    this.loading = true
    this.otpService.requestVerifyEmail(this.state.email).subscribe({
      next: res => {
        this.loading = false
        Dialogs.success('Code has been sent!',this.translate)
      },
      error: err => {
        this.loading = false
        Dialogs.error(err,this.translate)
      }
    })
  }

}
