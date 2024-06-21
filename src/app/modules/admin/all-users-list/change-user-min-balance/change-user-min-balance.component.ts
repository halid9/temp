import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from "src/app/core/models/auth.models";
import { AllUsersService } from '../../../../core/services/all-users-list.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-user-min-balance',
  templateUrl: './change-user-min-balance.component.html',
  styleUrls: ['./change-user-min-balance.component.scss']
})
export class ChangeAgentSettingsComponent {
  @Input() user: Partial<User>;

  constructor(
    private activeModal: NgbActiveModal,
    private usersService: AllUsersService
  ) { }

  close() {
    this.activeModal.close();
  }

  onSubmit(userForm: NgForm) {
    if (userForm.valid) {
      try {
        this.usersService.updateAgentSettings(this.user.id, +this.user.usdMinBalance, +this.user.eurMinBalance,+this.user.commission).subscribe({
          next: res => {
            this.activeModal.close();
          },
          error: err => {
            console.error(err);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
