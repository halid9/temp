import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { OTPService } from 'src/app/core/services/otp.service';
import { Dialogs } from 'src/app/shared/dialogs';

@Component({
  selector: 'twosteps',
  templateUrl: 'twosteps.component.html',
  styleUrls: ['twosteps.component.scss']
})

/**
 * Two Step Basic Component
 */
export class TwostepsComponent {
  state: any
  year: number = new Date().getFullYear();

  ngOnInit() {
    this.state = JSON.parse(localStorage.getItem('verificationState'))
  }

}
