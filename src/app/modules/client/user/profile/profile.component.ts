import { Component, OnInit } from '@angular/core';

// Swiper Slider

import { ProfileInfo, ProfileService, Activity, LoginHistory, DealResponse, } from '../../../../core/services/profile.service';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/auth.models';
import { UserTypes } from 'src/app/shared/helper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Dialogs } from 'src/app/shared/dialogs';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Deal } from 'src/app/core/models/deals.model';
import { FileManagerService } from 'src/app/core/services/file-manager.service';
import { ViewContentComponent } from 'src/app/shared/view-content/view-content.component';
import { ActivatedRoute, Router } from '@angular/router';

export type DocumentListModel = {
  id: any
  name: string
  type: string
  category: string
  path: string
  createdAt: string
  updatedAt: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Profile Component
 */
export class ProfileComponent implements OnInit {
  userTypes = [{ name: 'Admin', type: UserTypes.Admin },
  { name: 'Customer', type: UserTypes.Customer },
  { name: 'Manager', type: UserTypes.Manager },
  { name: 'Call center', type: UserTypes.CallCenter },
  { name: 'Agent', type: UserTypes.Agent },
  ]
  loadingDeals: boolean = true
  loadingActivity: boolean = true
  loadingLoginHistory: boolean = true
  user: User;
  info: ProfileInfo
  deals: Deal[]
  succeededDeals: Deal[] = []
  lostDeals: Deal[] = []
  recentActivity!: Activity[]
  allActivity: Activity[]
  loginHistory: LoginHistory[] = []
  lastLogins: LoginHistory[] = []
  avatar: any
  percent = 0
  from: string
  to: string
  loggedInDevices: LoginHistory[] = []
  loadingDocuments: boolean = true
  totpUri: string;
  totpCode: string;
  totpToken: string;
  activeId = 1

  constructor(
    public translate: TranslateService,
    private profileService: ProfileService,
    private authService: AuthenticationService,
    private fileService: FileManagerService,
    private modal: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
  ) {
    this.user = this.authService._currentUser

    this.authService.generate2FASecret().subscribe({
      next: (data: any) => {
        this.totpUri = data.uri;
        this.totpCode = data.secret;
      }
    });
  }
  view() {
    const modal = this.modal.open(ViewContentComponent, { centered: true, size: 'xl' })
    modal.componentInstance.src = this.user.avatar
    modal.componentInstance.type = 'image'
  }
  dir = 'ltr'
  ngOnInit() {
    const menuId = this.activatedRoute.snapshot.fragment
    if (menuId) this.activeId = +menuId
    this.dir = this.cookieService.get('lang') == 'ar' ? 'rtl' : 'ltr'

    const now = new Date()
    const to = now.getFullYear() + '-' + (+now.getMonth() + 1) + '-' + (+now.getDate() + 1)
    this.updateToDate(false, to)
    const created = new Date(this.user.createdAt)
    const from = created.getFullYear() + '-' + (+created.getMonth() + 1) + '-' + created.getDate()
    this.updateFromDate(false, from)
    this.info = {
      country: this.user?.address?.country ?? '',
      email: this.user?.email ?? '',
      firstName: this.user?.firstName ?? '',
      lastName: this.user?.lastName ?? '',
      mobile: this.user?.phone ?? '',
      role: this.userTypes.find(u => u.type == this.user?.type)?.name ?? '',
      joiningDate: from ?? '',
      streetAddress: this.user?.address?.streetAdress ?? '',
      city: this.user?.address?.city ?? '',
      zipCode: this.user?.address?.zipCode ?? '',
      birthDate: this.user?.birthDate ?? null
    }

    this.profileService.info = this.info
    const completed = Object.values(this.info)
    this.percent = 0
    completed.forEach((v, i) => {

      if (v) this.percent += 10

    })
    this.getDeals()
    this.initLoginHistory()
    this.initActivity()
    this.authService.avatar$.subscribe(avatar => {
      if (avatar) {
        this.avatar = avatar


      }

    })
  }

  async initActivity() {
    this.loadingActivity = true
    this.recentActivity = []
    this.profileService.getActivity().subscribe(res => {
      this.recentActivity = res.slice(0, 5)
      this.profileService.recentActivity = res.slice()
      this.allActivity = res.slice()
      this.loadingActivity = false
    })

  }

  async initLoginHistory() {
    this.loginHistory = await firstValueFrom(this.profileService.getLoginHistory())
    // this.loggedInDevices = await firstValueFrom(this.profileService.getLoginHistoryByDevice())
    this.profileService.loggedInDevices = this.loggedInDevices
    this.lastLogins = this.loginHistory.slice(0, 4)
  }

  config = {
    slidesPerView: 1,
    initialSlide: 0,
    spaceBetween: 25,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      }
    }
  };

  getDeals() {
    this.loadingDeals = true
    this.deals = []
    this.profileService.getDealsHistory(this.from, this.to).subscribe({
      next: res => {
        if (res.results && res.results.length) {

          this.deals = res.results
          this.succeededDeals = this.deals.filter(d => +d.profit > 0).slice(0, 5)
          this.lostDeals = this.deals.filter(d => +d.profit <= 0).slice(0, 5)
        }
        this.loadingDeals = false
      },
      error: err => {
        Dialogs.error(err, this.translate)
        this.loadingDeals = false
      }
    })
  }

  viewFile(id: any, type: string) {
    this.fileService.getFile(id).subscribe(
      (res: HttpResponse<Blob>) => {

        const modal = this.modal.open(ViewContentComponent, { centered: true, size: 'xxl' })
        modal.componentInstance.type = type.includes('image') ? 'image' : 'pdf',
          modal.componentInstance.src = URL.createObjectURL(res.body)
      }
    )
  }

  saveFile(id: any) {
    this.fileService.getFile(id).subscribe(
      (res: HttpResponse<Blob>) => {

        this.fileService.saveFileLocally(res)

      }
    )
  }

  updateFromDate(input: boolean, event?: any) {
    if (input) {
      const inputElement = event.target as HTMLInputElement;
      this.from = inputElement.value;

    }
    else this.from = event

  }

  updateToDate(input: boolean, event?: any) {
    if (input) {
      const inputElement = event.target as HTMLInputElement;
      this.to = inputElement.value;

    }


    else this.to = event


  }

  copyToClipboard(): void {
    const otopCode = document.getElementById('otopCode') as HTMLInputElement;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(otopCode);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();

  }

  verifyTOTP() {
    this.authService.verify2FAToken(this.totpToken).subscribe({
      next: (response: any) => {
        if (response.isValid) {
          // Handle successful verification
          Dialogs.success('2FA setup successful', this.translate);
          this.user.totp_enabled = true;
        } else {
          // Handle failed verification
          Dialogs.error('Invalid 2FA token', this.translate);
        }
      },
      error: (err) => {
        // Handle error scenario
        console.error(err);
        Dialogs.error(err, this.translate);
      }
    });
  }

  goToSettings() {
    this.router.navigate(['settings', 'edit-profile'])
  }
}
