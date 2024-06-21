import { Component, OnInit } from '@angular/core';
import { LoginHistory, ProfileInfo, ProfileService } from '../../../../core/services/profile.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/auth.models';
import { Response, UserTypes } from 'src/app/shared/helper';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Dialogs } from 'src/app/shared/dialogs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { ViewContentComponent } from 'src/app/shared/view-content/view-content.component';
import { CountryCodes } from 'src/app/core/helpers/country-code';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

/**
 * Profile Settings Component
 */
export class SettingsComponent implements OnInit {
  languages = [
    { name: 'العربية', value: "ar" },
    { name: 'English', value: "en" }
  ]
  uploading = false
  lowerCaseLetters = /[a-z]/g;
  upperCaseLetters = /[A-Z]/g;
  numbers = /[0-9]/g;
  info!: ProfileInfo
  loggedInDevices: LoginHistory[] = []
  user: User
  visible = false
  userTypes = [{ name: 'Admin', type: UserTypes.Admin },
  { name: 'Customer', type: UserTypes.Customer },
  { name: 'Manager', type: UserTypes.Manager },
  { name: 'Call center', type: UserTypes.CallCenter },
  { name: 'Agent', type: UserTypes.Agent },
  ]
  avatar: File
  currentAvatar: any
  submitted = false
  updateForm: FormGroup
  changePassword: FormGroup
  passwordSubmit: boolean = false
  dir = 'ltr'
  countryCodes = CountryCodes
  countries = []
  cities = []
  constructor(private profileService: ProfileService,
    private auth: AuthenticationService,
    private router: Router,
    private modal: NgbModal,
    private cookie: CookieService,
    private translate: TranslateService) {
    this.user = this.auth._currentUser

  }

  toggelShow() {
    this.visible = !this.visible
  }
  async refresh() {
    this.loggedInDevices = await firstValueFrom(this.profileService.getLoginHistoryByDevice())
    this.profileService.loggedInDevices = this.loggedInDevices
  }
  initInfo() {
    this.countries = this.countryCodes.map(c => {
      const country = {
        name: c.name,
        isoCode: c.iso2
      }
      return country

    })
    this.info = {
      country: this.user?.address?.country ?? '',
      email: this.user?.email ?? '',
      firstName: this.user?.firstName ?? '',
      lastName: this.user?.lastName ?? '',
      mobile: this.user?.phone ?? '',
      role: this.userTypes.find(u => u.type == this.user?.type)?.name ?? '',
      joiningDate: this.user?.createdAt ?? '',
      zipCode: this.user?.address?.zipCode ?? '',
      city: this.user?.address?.city ?? '',
      streetAddress: this.user?.address?.streetAdress ?? '',
      language: this.user?.language ?? '',
      birthDate: this.user?.birthDate ?? null
    }
    if(this.info?.country){
      this.cities = this.countryCodes.find(c => c.name == this.info.country).states.map(s => {
        const city = {
          name: s.name,
          isoCode: s.state_code
        }
        return city
      })}
    this.profileService.info = this.info
  }
  async ngOnInit(): Promise<void> {
    this.dir = this.cookie.get('lang') == 'ar' ? 'rtl' : 'ltr'
    this.initInfo()
    this.updateForm = new FormGroup({
      firstName: new FormControl(this.info.firstName),
      lastName: new FormControl(this.info.lastName),
      country: new FormControl(this.countries.find(c => c.name == this.info?.country)?.isoCode??null),
      zipCode: new FormControl(this.info.zipCode),
      city: new FormControl({ value:this.info.country? this.cities.find(c => c.name == this.info.city):null, disabled: this.info.country ? false : true }),
      language: new FormControl(this.info.language),
      streetAddress: new FormControl(this.info.streetAddress),
      birthDate:new FormControl(this.info.birthDate)

    })



    // this.state.valueChanges.subscribe((state) => {
    //   this.city.reset();
    //   this.city.disable();
    //   if (state) {
    //     this.cities = this.service.getCitiesByState(this.country.value, state);
    //     this.city.enable();
    //   }
    // });
    this.loggedInDevices = this.profileService.loggedInDevices.slice()
    if (!this.loggedInDevices.length) {
      this.loggedInDevices = await firstValueFrom(this.profileService.getLoginHistoryByDevice())
      this.profileService.loggedInDevices = this.loggedInDevices
    }
    this.changePassword = new FormGroup({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmNewPassword: new FormControl('', Validators.required)
    })
    this.updateForm.controls['country'].valueChanges.subscribe((country) => {
      this.updateForm.controls['city'].reset();
      this.updateForm.controls['city'].disable();
      if (country) {
        this.cities = this.countryCodes.find(c => c.iso2 == country).states.map(s => {
          const city = {
            name: s.name,
            isoCode: s.state_code
          }
          return city
        })
        this.updateForm.controls['city'].enable();
      }
    });
  }
  get f() { return this.changePassword.controls }
  upload(event: any) {
    const file: File = event.target.files[0]
    this.avatar = file
    this.handleInputChange(this.avatar)



  }
  view() {
    const modal = this.modal.open(ViewContentComponent, { centered: true, size: 'xl' })
    modal.componentInstance.src = this.user.avatar
    modal.componentInstance.type = 'image'
  }
  update() {
    this.submitted = true
    const controls = this.updateForm.controls
    if(this.updateForm.invalid) return Dialogs.error('Please complete all information!',this.translate)
    const user: Partial<User> = {
      firstName: controls['firstName'].value,
      lastName: controls['lastName'].value,
      address: {
        country: this.countries.find(c=>c.iso2 == controls['country'].value)?.name??'',
        zipCode: controls['zipCode'].value??'',
        city: controls['city'].value??'',
        streetAdress: controls['streetAddress'].value??'',

      },
      language: controls['language'].value,
      birthDate: controls['birthDate'].value,

    }
    this.auth.updateUser(user).subscribe({
      next: async res => {
        if (res) {
          this.submitted = false
          Dialogs.success('user information has been updated!', this.translate);
          await this.auth.getCurrentUser().then(u => this.user = u)
          this.profileService.refresh()
          this.initInfo()
        }
      },
      error: err => {
        Dialogs.error(err, this.translate)
      }
    }
    )
  }
  handleInputChange(file) {
    this.uploading = true
    var file = file;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type?.match(pattern)) {
      Dialogs.error('invalid format', this.translate);
      this.uploading = false
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    var base64result = reader.result
    base64result;
    const avatar = { image: base64result, type: 'avatar' }

    this.auth.updateUser({ avatar }).subscribe(
      async res => {
        if (res) {
          Dialogs.success('Avatar has been updated!', this.translate)
          this.uploading = false
          await this.auth.getCurrentUser().then(u => this.user = u)
          this.profileService.refresh()
          this.initInfo()
        }
      }
    )


  }
  backToProfile() {
    this.router.navigate(['settings', 'profile'])
  }

  logout(id: any) {
    this.auth.logoutDevice(id).subscribe({
      next: async (res: Response<any>) => {
        Dialogs.success(res.message, this.translate)
        this.loggedInDevices = await firstValueFrom(this.profileService.getLoginHistoryByDevice())
      },
      error: err => {
        Dialogs.error(err, this.translate)
      }
    })
  }

  allLogout() {
    this.auth.logoutAll()
  }

  forgetPassword() {
    this.router.navigate(['auth', 'pass-reset', 'basic'])
  }
  loading: boolean = false
  changePasswprd() {
    this.passwordSubmit = true
    this.loading = true

    if (!this.changePassword.valid
      || this.changePassword.controls['newPassword'].value != this.changePassword.controls['confirmNewPassword'].value
      || !this.changePassword.controls['newPassword'].value.match(this.lowerCaseLetters)
      || !this.changePassword.controls['newPassword'].value.match(this.upperCaseLetters)
      || !this.changePassword.controls['newPassword'].value.match(this.numbers)
      || this.changePassword.controls['newPassword'].value.length < 8) {
      Dialogs.error('Check for password requirements', this.translate)
      this.loading = false
      return
    }


    this.auth.changePassword({ oldPassword: this.changePassword.controls['oldPassword'].value, newPassword: this.changePassword.controls['newPassword'].value }).subscribe({
      next: res => {
        this.loading = false
        Dialogs.success('Password has been changed, Please login again.', this.translate)
        localStorage.removeItem('token')
        this.router.navigate(['auth', 'login'])
      },
      error: err => {
        this.loading = false
        Dialogs.error(err, this.translate)
      }
    })

  }


}


