import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountType, UserTypes } from 'src/app/shared/helper';
import { AccountsService, Counter } from 'src/app/core/services/accounts.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, VerificationState } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { Dialogs } from 'src/app/shared/dialogs';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from 'src/app/core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { VerificationDetailsComponent } from './verification-details/verification-details.component';
import { CompleteProfileComponent } from 'src/app/modules/shared/shared-components/complete-profile/complete-profile.component';
import { DepositComponent } from '../transactions/deposit/deposit.component';
import { AccountFormComponent } from '../../shared/shared-components/accounts/account-form/account-form.component';



@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Starter Component
 */

export class DashboardComponent implements OnInit {
  lang = 'en'
  user: User
  verificationState: VerificationState = {

    verified: false,
    state: {
      completeProfile: false,
      openDemo: false,
      verifyDocs: false,
      openLive: false,
      deposit: false,
      currentStep: 1,
      progress: '0%'
    }
  }
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  tileBoxs3 = []
  favAcc = null
  constructor(private modal: NgbModal,
     private accountService: AccountsService,
      private http: HttpClient,
       private auth: AuthenticationService,
        private router: Router,
        private translateService: LanguageService,
        private cookie:CookieService,
        private translate:TranslateService) { }

        
  async ngOnInit() {
    this.lang = this.cookie.get('lang')
    /**
    * BreadCrumb
    */
    this.user = this.auth._currentUser
    if(this.user.favAccountId){
      this.favAcc = this.user?.accounts.find(a=>a.id == this.user.favAccountId)
    }

    //set default fave account if no favorate account selected and user has at least  1 account
    if(!this.user.favAccountId && this.user.accounts.length > 3 ){
      this.favAcc = this.user.accounts[3]
    }

    if (this.user.verificationState) {

      this.verificationState.verified = this.user.verificationState.verified
      this.verificationState.state = { ...this.verificationState.state, ...this.user.verificationState.state }
      this.verificationState.state.currentStep = this.checkForCurrentStep(this.verificationState) as 1 | 2 | 3 | 4 | 5
      if(this.user.type == UserTypes.Customer && !this.verificationState.verified && (!this.verificationState.state.completeProfile || !this.verificationState.state.requestLive ) ) this.openCompleteProfile()
    }
    let counters: Counter
    const countersRes = await firstValueFrom(this.accountService.getCounters())
    if (!countersRes) counters = { accountsTotalBalance: { USD: 0, EUR: 0 }, activeDemoCount: 0, activeLiveCount: 0, pendingDemoCount: 0, pendingLiveCount: 0, walletsTotalBalance: { USDT: 0 } }
    counters = countersRes.result
    this.accountService.counters$.next(counters)
    this.tileBoxs3 = [
      {
        id: 1,
        label: "LIVEACCOUNTS",
        labelClass: "muted",
        counter: counters.activeLiveCount + counters.pendingLiveCount,
        badgeClass: "bg-soft-warning text-warning",
        badge: "ri-emotion-line",
        percentage: "16.24 %",
        // iconClass: "info",
        feaIcon: "users",
        subCounter: [
          {
            id: 1,
            counter: counters.activeLiveCount,
            decimals: 2,
            suffix: "",
            prefix: "ACTIVE",
          },
          {
            id: 1,
            counter: counters.pendingLiveCount,
            decimals: 2,
            suffix: "",
            prefix: "PENDING",
          },
        ],
      },
      {
        id: 2,
        label: "DEMOACCOUNTS",
        labelClass: "muted",
        badgeClass: "bg-soft-success text-success",
        badge: " ri-timer-line",
        counter: counters.activeDemoCount + counters.pendingDemoCount,
        pending: 5,
        active: 15,
        percentage: "3.96 %",
        // iconClass: "info",
        feaIcon: "activity",
        subCounter: [
          {
            counter: counters.activeDemoCount,
            decimals: 2,
            suffix: "",
            prefix: "ACTIVE",
          },
          {
            counter: counters.pendingDemoCount,
            decimals: 2,
            suffix: "",
            prefix: "PENDING",
          },
        ],
      },
      {
        id: 3,
        // bgColor: "bg-primary",
        label: "WALLETBALANCE",
        labelClass: "muted",
        badgeClass: "bg-soft-danger text-danger",
        // counterClass: "text-white",
        // badgeClass: "badge-soft-light",
        badge: " ri-wallet-3-line",
        percentage: "0.24 %",
        iconClass: "soft",
        feaIcon: "clock",
        decimals: 0,
        suffix: "",
        prefix: "",
        // add all wallet currencies here
        subCounter: Object.entries(counters.walletsTotalBalance).map(([currency, balance]) => {
           return {
              counter: balance,
              decimals: 2,
              suffix: ` ${currency} `,
              prefix: "\u00A0\u00A0\u00A0",
            }  
        }).filter(c=> c.suffix.toLocaleLowerCase().includes('usd')),

        // subCounter: [
        //   {
        //     id: 1,
        //     counter: counters.walletsTotalBalance.USDT ?? 0,
        //     decimals: 1,
        //     suffix: " USD ",
        //     prefix: "",
        //   },
        //   {
        //     id: 2,
        //     counter: 0,
        //     decimals: 1,
        //     suffix: " EUR ",
        //     prefix: "",
        //   },
        // ],
      },
      {
        id: 4,
        label: "ACCOUNTSBALANCE",
        labelClass: "muted",
        badgeClass: "bg-soft-info text-info",
        badge: "ri-coins-line",
        percentage: "7.05 %",
        // iconClass: "info",
        feaIcon: "external-link",
        subCounter: [
          {
            id: 1,
            counter: counters.accountsTotalBalance.USD,
            decimals: 2,
            suffix: "USD ",
            prefix: "\u00A0\u00A0\u00A0",
          },
          //  {
          //   id: 1,
          //   counter: counters.accountsTotalBalance.EUR,
          //   decimals: 2,
          //   suffix: "EUR ",
          //   prefix: "\u00A0\u00A0\u00A0",
          // },
        ],
      },
    ];
    this.breadCrumbItems = [
      { label: 'DASHBOARD', active: true }
    ];
    // this.initVerificationState()
  }
  completeInfo(){
    if(this.user.type == UserTypes.Customer && !this.verificationState.verified && (!this.verificationState.state.completeProfile || !this.verificationState.state.requestLive ) ) this.openCompleteProfile()
  }
  openUploadDialog() {
    // if (this.verificationState.state.verifyDocs && this.verificationState.state.currentStep > 3) return Dialogs.success('step complete!')
    if (this.verificationState.state.verifyDocs || this.verificationState.state.currentStep < 3) return Dialogs.error('complete previues step!',this.translate)
    this.router.navigate(['settings', 'profile'])
  }
  completeProfile() {
    // if (this.verificationState.state.completeProfile && this.verificationState.state.currentStep > 1) return Dialogs.success('step complete!')
    this.router.navigate(['settings', 'edit-profile'])

  }
  openDepositForm(fromVerify?: boolean) {
    if (fromVerify && this.verificationState.state.deposit || fromVerify && this.verificationState.state.currentStep < 5) return Dialogs.error('complete previues step!',this.translate)

    const modal = this.modal.open(DepositComponent, { centered: true, size: 'xl' })
    modal.componentInstance.isDialog = true

  }

  createAccount(type: string, fromVerify?: boolean) {
    // if (fromVerify && !this.verificationState.verified && this.verificationState.state.openLive && this.verificationState.state.currentStep > 4 && type == 'live') return Dialogs.success('step complete')
    // if (fromVerify && !this.verificationState.verified && this.verificationState.state.openDemo && this.verificationState.state.currentStep > 2 && type == 'demo') return Dialogs.success('step complete')
    if (fromVerify && !this.verificationState.verified && !this.verificationState.state.verifyDocs && type == 'live' || fromVerify && type == 'live' && this.verificationState.state.currentStep < 4) return Dialogs.error('complete previues step!',this.translate)
    if (fromVerify && !this.verificationState.verified && !this.verificationState.state.completeProfile || fromVerify && type == 'demo' && this.verificationState.state.currentStep < 2) return Dialogs.error('complete previues step!',this.translate)
    if (!fromVerify && !this.verificationState.verified && !this.verificationState.state.completeProfile && type == 'demo') return Dialogs.error('you need to complete your profile first!',this.translate)
    if (!fromVerify && !this.verificationState.verified && !this.verificationState.state.verifyDocs && type == 'live') return Dialogs.error('you need to verify your account first!',this.translate)
    const modal = this.modal.open(AccountFormComponent, { centered: true })
    modal.componentInstance.type = type == 'live' ? AccountType.Live : AccountType.Demo
    modal.componentInstance.verified = this.verificationState.verified ? true : this.user.verificationState.state.verifyDocs

  }
  goToAccountsRequests(){
    this.router.navigate(['accounts','accounts-requests'])
  }

  async initVerificationState() {
    this.verificationState = await firstValueFrom(this.http.get<VerificationState>(''))
  }
  checkForCurrentStep(verificationState: VerificationState): number | 1 | 2 | 3 | 4 | 5 {
    // let countValues = Object.values(verificationState.state).filter(s=>s == true).length
    // if(countValues<5){
    //   countValues++
    //   return countValues
    // }
    // return countValues
    const states = verificationState.state
    let currentStep: number = 1
    const { completeProfile,
      openDemo,
      verifyDocs,
      openLive,
      deposit,
    } = states
    if (completeProfile && openDemo && verifyDocs && openLive) return currentStep = 5
    if (completeProfile && openDemo && verifyDocs) return currentStep = 4
    if (completeProfile && openDemo) return currentStep = 3
    if (completeProfile) return currentStep = 2
    return currentStep

  }

 



  stepInitializer(){

  }
  openCompleteProfile(){
  const modal   = this.modal.open(CompleteProfileComponent,{centered:true,size:'xl'})
  modal.dismissed.subscribe(async (res)=>{
    if(res){
      await this.auth.getCurrentUser()
      this.user = this.auth._currentUser
      if (this.user.verificationState) {

        this.verificationState.verified = this.user.verificationState.verified
        this.verificationState.state = { ...this.verificationState.state, ...this.user.verificationState.state }
        this.verificationState.state.currentStep = this.checkForCurrentStep(this.verificationState) as 1 | 2 | 3 | 4 | 5
        if(this.user.type == UserTypes.Customer && !this.verificationState.verified && (!this.verificationState.state.completeProfile || !this.verificationState.state.requestLive ) ) this.openCompleteProfile()
      }
    }
    
  })
  }

  showDetails(){
    const modal = this.modal.open(VerificationDetailsComponent,{centered:true})
    modal.componentInstance.verificationState = this.verificationState
  }
  setNewFavAcc(id){
    this.favAcc = this.user?.accounts.find(a=>a.id == id)

  }
}
