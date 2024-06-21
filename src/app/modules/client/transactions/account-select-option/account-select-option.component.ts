import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AccountType, Platform } from 'src/app/shared/helper';

@Component({
  selector: 'app-transactions-account-select-option',
  templateUrl: './account-select-option.component.html',
  styleUrls: ['./account-select-option.component.scss']
})
export class TransactionsAccountSelectOptionComponent {
  @Input() accounts: any[]; // Adjust the type accordingly
  @Input() selectedAccountId: number; // Use for two-way data binding
  @Output() accountChanged = new EventEmitter<number>(); // The name should be inputNameChange for two-way binding

  Platform = Platform
  AccountType = AccountType

  onAccountChanged(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newAccountId = Number(selectElement.value);
    this.accountChanged.emit(newAccountId);
  }

  hasAccountsForPlatform(platform: Platform): boolean {
    return this.accounts.some(account => account.platform === platform);
  }
}
