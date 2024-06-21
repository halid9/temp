import { Component, Input, Output, EventEmitter } from '@angular/core';
import {  Currency, Platform } from 'src/app/shared/helper';

@Component({
  selector: 'crypto-network-select-option',
  templateUrl: './network-select-option.component.html',
  styleUrls: ['./network-select-option.component.scss']
})
export class CryptoNetworkSelectOptionComponent {
  @Input() networks: Currency[]; // Adjust the type accordingly
  @Input() selectedNetworkId: string; // Use for two-way data binding
  @Output() networkChanged = new EventEmitter<string>(); // The name should be inputNameChange for two-way binding

  Platform = Platform

  onNetworkChanged() {
    this.networkChanged.emit(this.selectedNetworkId);
  }

  // hasAccountsForPlatform(platform: Platform): boolean {
  //   return this.networks.some(network => network.currency === 'usdt');
  // }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    const code = item?.code ?? ''
    const name = item?.name ?? ''
    const network = item?.network ?? ''
    return (
      code.toLowerCase().includes(term) ||
      name.toLowerCase().includes(term) ||
      network.toLowerCase().includes(term)
    );

  }

}
