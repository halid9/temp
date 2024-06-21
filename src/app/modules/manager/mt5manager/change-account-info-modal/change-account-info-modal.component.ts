import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Mt5ManagerService } from 'src/app/modules/manager/services/mt5manager.service';
import { Dialogs } from "src/app/shared/dialogs";
import { AccountType } from 'src/app/shared/helper';

@Component({
  selector: 'app-mt5-account-change-info-modal',
  templateUrl: './change-account-info-modal.component.html',
  styleUrls: ['./change-account-info-modal.component.scss']
})
export class MT5AccountChangeInfoModalComponent {
  @Input() account: any;
  @Input() new_account: boolean = false;
  @Input() accountType:AccountType

  @Input() groups: any[];
  @Output() accountUpdated = new EventEmitter<boolean>();

  constructor(public activeModal: NgbActiveModal,
     private mt5ManagerService: Mt5ManagerService,
     private translate:TranslateService) { }

  closeModal() {
    this.activeModal.close();
  }

  saveChanges() {
    if (this.new_account) {
      this.mt5ManagerService.addAccountInfo(
        this.account.user,
        this.account.password,
        this.accountType,
        this.account.name,
        this.account.first_name,
        this.account.last_name,
        this.account.phone,
        this.account.email,
        this.account.leverage,
        this.account.color,
        this.account.group,
        this.account.comment,
        this.account.country,
        this.account.agent
      ).subscribe({
        next: response => {
          if (response && response.success) {
            this.accountUpdated.emit(true);
            this.closeModal();
            Dialogs.success('Account info added successfully!',this.translate);
          } else {
            Dialogs.error('Failed to add account info. Please try again.',this.translate);
          }
        },
        error: error => {
          Dialogs.error('An error occurred while adding the account info. Please try again later.',this.translate);
        }
      });
    } else {
      this.mt5ManagerService.updateAccountInfo(
        this.account.user,
        this.accountType,
        this.account.name,
        this.account.first_name,
        this.account.last_name,
        this.account.phone,
        this.account.email,
        this.account.leverage,
        this.account.color,
        this.account.group,
        this.account.comment,
        this.account.country,
        this.account.agent
      ).subscribe({
        next: response => {
          if (response && response.success) {
            this.accountUpdated.emit(true);
            this.closeModal();
            Dialogs.success('Account info updated successfully!',this.translate);
          } else {
            Dialogs.error('Failed to update account info. Please try again.',this.translate);
          }
        },
        error: error => {
          Dialogs.error('An error occurred while updating the account info. Please try again later.',this.translate);
        }
      });
    }
  }

  get hexColor(): string {
    return this.decimalToRgb(this.account.color);
  }

  set hexColor(value: string) {
    this.account.color = this.rgbToDecimal(value);
  }

  decimalToRgb(decimalColor: number): string {
    const hex = decimalColor.toString(16).padStart(6, '0');
    return `#${hex}`;
  }

  rgbToDecimal(rgbColor: string): number {
    const hex = rgbColor.slice(1);
    return parseInt(hex, 16);
  }


















  countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic (CAR)',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Democratic Republic of the Congo',
    'Republic of the Congo',
    'Costa Rica',
    'Cote d\'Ivoire',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macedonia (FYROM)',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar (Burma)',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Korea',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates (UAE)',
    'United Kingdom (UK)',
    'United States of America (USA)',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City (Holy See)',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];

}
