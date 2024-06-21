import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'lockscreen',
  templateUrl: 'lockscreen.component.html',
  styleUrls: ['lockscreen.component.scss']
})

/**
 * Lock Screen Basic Component
 */
export class LockscreenComponent implements OnInit {
  isError = false
  errMessage = ''
  // Login Form
  lockscreenForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  user: User
  uuid: string = ''
  constructor(private formBuilder: UntypedFormBuilder, private auth: AuthenticationService, private router: Router,private modal:NgbModal) { }

  ngOnInit(): void {
   this.modal.dismissAll()

    this.user = this.auth._currentUser
    if (!this.auth._currentUser) this.router.navigate([''])

    this.lockscreenForm = this.formBuilder.group({
      password: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.lockscreenForm.controls; }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.lockscreenForm.invalid) {
      return;
    }
    this.uuid = localStorage.getItem('uuid')
    if (!this.uuid) {
      this.uuid = uuidv4()
      localStorage.setItem('uuid', this.uuid)
    }
    this.auth.login(this.user.email, this.lockscreenForm.controls['password'].value, true, this.uuid).subscribe(
      {
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem('verificationState',JSON.stringify(res.payload))
            localStorage.setItem('token', res.payload.access_token);
            localStorage.setItem('userId', res.payload.id)
            this.auth.getCurrentUser().then(() => { this.router.navigate(['']) })
          }
          if (!res.success) {
            localStorage.setItem('verificationState',JSON.stringify(res.payload))
            this.router.navigate(['auth','twostep','basic'])
            
          }
        },
      error: err => {
        this.isError = true
        this.errMessage = err
        this.lockscreenForm.controls['password'].setValue('')
      }

    })
  }

}
