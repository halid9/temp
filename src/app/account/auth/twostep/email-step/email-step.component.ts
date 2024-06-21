import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { OTPService } from 'src/app/core/services/otp.service';
import { Dialogs } from 'src/app/shared/dialogs';

@Component({
  selector: 'email-step',
  templateUrl: 'email-step.component.html',
  styleUrls: ['email-step.component.scss']
})

/**
 * Two Step Basic Component
 */
export class EmailStepComponent implements OnInit {
  user: User
  // set the current year
  year: number = new Date().getFullYear();
  otpForm: FormGroup
  submitted = false
  loading = true
  path: string = ''
  state: any
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
    if (this.state.emailVerified) this.router.navigate(['auth', 'twostep', 'phone'])
    this.otpService.requestVerifyEmail(this.state.email).subscribe({
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
    this.otpService.verifyEmail(this.state.email, this.otpForm.controls['otp'].value, uuid, this.otpForm.controls['rememberDevice'].value).subscribe({
      next: res => {
        //login if  response has access token
        if (res?.['payload']?.access_token) { localStorage.setItem('token', res['payload'].access_token); this.router.navigate(['']) }
        //verify phone if not verify
        else {
          this.state.phoneVerified ? this.router.navigate(['']) : this.router.navigate(['auth', 'twostep', 'phone'])
        }
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
