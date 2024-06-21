import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OTPService } from 'src/app/core/services/otp.service';
import { Dialogs } from 'src/app/shared/dialogs';
import { Response } from 'src/app/shared/helper';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})

/**
 * Basic Component
 */
export class BasicComponent implements OnInit {

  // Login Form
  passresetForm!: UntypedFormGroup;
  submitted = false;
  passwordField!: boolean;
  confirmField!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
loading = false
  constructor(private formBuilder: UntypedFormBuilder, 
    private otp: OTPService,
    private router:Router,
    private translate:TranslateService) { }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
    this.passresetForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      cpassword: ['', [Validators.required]]
    });

    // Password Validation set
    var passwordInput = document.getElementById("password-input") as HTMLInputElement;
    var cpasswordInput = document.getElementById("confirm-password-input") as HTMLInputElement;
    var letter = document.getElementById("pass-lower");
    var capital = document.getElementById("pass-upper");
    var number = document.getElementById("pass-number");
    var length = document.getElementById("pass-length");
    var match = document.getElementById("pass-match");

    // When the user clicks on the password field, show the message box
    passwordInput.onfocus = function () {
      let input = document.getElementById("password-contain") as HTMLElement;
      input.style.display = "block"
    };

    // When the user clicks outside of the password field, hide the password-contain box
    // myInput.onblur = function () {
    //   let input = document.getElementById("password-contain") as HTMLElement;
    //   input.style.display = "none"
    // };

    // When the user starts to type something inside the password field
    passwordInput.onkeyup = function () {
      // Validate lowercase letters
      var lowerCaseLetters = /[a-z]/g;
      if (passwordInput.value.match(lowerCaseLetters)) {
        letter?.classList.remove("invalid");
        letter?.classList.add("valid");
      } else {
        letter?.classList.remove("valid");
        letter?.classList.add("invalid");
      }

      // Validate capital letters
      var upperCaseLetters = /[A-Z]/g;
      if (passwordInput.value.match(upperCaseLetters)) {
        capital?.classList.remove("invalid");
        capital?.classList.add("valid");
      } else {
        capital?.classList.remove("valid");
        capital?.classList.add("invalid");
      }

      // Validate numbers
      var numbers = /[0-9]/g;
      if (passwordInput.value.match(numbers)) {
        number?.classList.remove("invalid");
        number?.classList.add("valid");
      } else {
        number?.classList.remove("valid");
        number?.classList.add("invalid");
      }

      // Validate length
      if (passwordInput.value.length >= 8) {
        length?.classList.remove("invalid");
        length?.classList.add("valid");
      } else {
        length?.classList.remove("valid");
        length?.classList.add("invalid");
      }
    };

    cpasswordInput.onkeyup = function () {
    // Validate length
      if (passwordInput.value == cpasswordInput.value) {
        match?.classList.remove("invalid");
        match?.classList.add("valid");
      } else {
        match?.classList.remove("valid");
        match?.classList.add("invalid");
      }
    }
  }


  // convenience getter for easy access to form fields
  get f() { return this.passresetForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
this.loading = true
    // stop here if form is invalid
    if (this.passresetForm.invalid || this.f['password'].value != this.f['cpassword'].value ) {
      Dialogs.error(`You did not achieve password requirments!`,this.translate)
      return;}
    this.otp.resetPassword(this.f['password'].value).subscribe({
      next: (res: Response<any>) => {
        this.loading = false
        Dialogs.success(res.message,this.translate)
        this.router.navigate([''])
      },
      error:err=>{
        this.loading = false
        Dialogs.error(err + `please try again!`,this.translate)
        this.router.navigate(['auth','pass-reset','basic'])

      }
    })

  }

  /**
  * Password Hide/Show
  */
  togglepasswordField() {
    this.passwordField = !this.passwordField;
  }

  /**
 * Password Hide/Show
 */
  toggleconfirmField() {
    this.confirmField = !this.confirmField;
  }

}
