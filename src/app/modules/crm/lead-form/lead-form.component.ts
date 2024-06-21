import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Lead } from "src/app/core/models/lead.model";
import { LeadsService } from "../leads/leads.service";
import { AccountType, LeadActions, LeadStatus, UserStatus, UserTypes } from "src/app/shared/helper";
import { Dialogs } from "src/app/shared/dialogs";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'lead-form',
    templateUrl: 'lead-form.component.html',
    styleUrls: ['lead-form.component.scss']
})
export class LeadForm {
    @Input() viewMode: boolean 
    @Input() isDialog: boolean = true
    @Input() edit: boolean = false
    @Input() title: string = 'New lead'
    @Input() lead: Lead = {
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        leadOwner: undefined,
        phone: '',
        natunality: undefined,
        tradingExperience: undefined,
        anotherCompanyAccount: false,
        anotherCompanyDetails: undefined,
        callForwarding: undefined,
        leadSource: undefined,
        leadStatus: LeadStatus.Potential,
        work: undefined,
        address: undefined,
        customerInterestScale: undefined,
        blackList: false,
        reason: undefined,
        hasAccountByUs: false,
        notes: undefined,
        created_at: undefined,
        tradingPlatforms: undefined,
        accountType: undefined,
        status: UserStatus.Draft,
        type: UserTypes.Customer,
        id:undefined
    }
    leadForm: FormGroup
    submitted: boolean = false

    get f() { return this.leadForm.controls }
    @Input() leadOwners = [{ _id: 'id1', name: 'owner1' },
    { _id: 'id2', name: 'owner2' }

    ]
    @Input() userStatus = [{ name: 'draft', value: UserStatus.Draft, },
    { name: 'Active', value: UserStatus.Active, },
    { name: 'Deleted', value: UserStatus.Deleted, },
    { name: 'Disable', value: UserStatus.Disable, },
    { name: 'InActive', value: UserStatus.InActive, },
    { name: 'Pending', value: UserStatus.Pending, }
    ]
    @Input() experiences = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    @Input() leadStatus = [{ name: 'demo', value: LeadStatus.Demo }, { name: 'live', value: LeadStatus.Live }, { name: 'potential', value: LeadStatus.Potential }, { name: 'deleted', value: LeadStatus.Deleted }]
    @Input() scales = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    @Input() leadSources = [{ _id: 'id1111', name: 'source1' },
    { _id: 'id222', name: 'source1' }]

    @Input() callCenters = [{ _id: 'id11111111', name: 'call center 1' },
    { _id: 'id2222222', name: 'call center 2' }]

    @Input() accountTypes = [{ name: 'demo', value: AccountType.Demo }, { name: 'live', value: AccountType.Live }]
    constructor(private modalRef: NgbModal,
         private leadSrv: LeadsService,
         private translate:TranslateService) {
        this.leadForm = new FormGroup({

            email: new FormControl({value:this.lead.email,disabled:this.viewMode}),
            firstName: new FormControl({value:this.lead.firstName,disabled:this.viewMode}),
            lastName: new FormControl({value:this.lead.lastName,disabled:this.viewMode}),
            // leadOwner: new {value:FormControl(this.lead,disabled:this.viewMode}.leadOwner),
            phone: new FormControl({value:this.lead.phone,disabled:this.viewMode}),
            natunality: new FormControl({value:this.lead.natunality,disabled:this.viewMode}),
            tradingExperience: new FormControl({value:this.lead.tradingExperience,disabled:this.viewMode}),
            anotherCompanyAccount: new FormControl({value:this.lead.anotherCompanyAccount,disabled:this.viewMode}),
            anotherCompanyDetails: new FormControl({value:this.lead.anotherCompanyDetails,disabled:this.viewMode}),
            callForwarding: new FormControl({value:this.lead.callForwarding,disabled:this.viewMode}),
            leadSource: new FormControl({value:this.lead.leadSource,disabled:this.viewMode}),
            // leadStatus: new FormControl({value:this.lead.leadStatus,disabled:this.viewMode}),
            work: new FormControl({value:this.lead.work,disabled:this.viewMode}),
            address: new FormControl({value:this.lead.address,disabled:this.viewMode}),
            customerInterestScale: new FormControl({value:this.lead.customerInterestScale,disabled:this.viewMode}),
            blackList: new FormControl({value:this.lead.blackList,disabled:this.viewMode}),
            reason: new FormControl({value:this.lead.reason,disabled:this.viewMode}),
            hasAccountByUs: new FormControl({value:this.lead.hasAccountByUs,disabled:this.viewMode}),
            accountType: new FormControl({value:this.lead.accountType,disabled:this.viewMode}),
            tradingPlatforms: new FormControl({value:this.lead.tradingPlatforms,disabled:this.viewMode}),
            notes: new FormControl({value:this.lead.notes,disabled:this.viewMode}),
            // created_at: new FormControl(this.lead.created_at),
        })

    }


    ngOnInit() {
        this.f['email'].setValue(this.lead.email)
        this.f['firstName'].setValue(this.lead.firstName)
        this.f['lastName'].setValue(this.lead.lastName)
        // this.f['leadOwner'].setValue(this.lead.leadOwner)
        this.f['phone'].setValue(this.lead.phone)
        this.f['natunality'].setValue(this.lead.natunality)
        this.f['tradingExperience'].setValue(this.lead.tradingExperience)
        this.f['anotherCompanyAccount'].setValue(this.lead.anotherCompanyAccount)
        this.f['anotherCompanyDetails'].setValue(this.lead.anotherCompanyDetails)
        this.f['callForwarding'].setValue(this.lead.callForwarding)
        this.f['leadSource'].setValue(this.lead.leadSource)
        // this.f['leadStatus'].setValue(this.lead.leadStatus)
        this.f['work'].setValue(this.lead.work)
        this.f['address'].setValue(this.lead.address)
        this.f['customerInterestScale'].setValue(this.lead.customerInterestScale)
        this.f['blackList'].setValue(this.lead.blackList)
        this.f['reason'].setValue(this.lead.reason)
        this.f['hasAccountByUs'].setValue(this.lead.hasAccountByUs)
        this.f['accountType'].setValue(this.lead.accountType)
        this.f['tradingPlatforms'].setValue(this.lead.tradingPlatforms)
        this.f['notes'].setValue(this.lead.notes)
        // this.f['created_at'].setValue(this.lead.created_at)

    }

    onSubmit() {
        this.submitted = true
        if (this.leadForm.valid) {
            if (!this.leadForm.controls['phone'].value && !this.leadForm.controls['email'].value) {
                alert('you must enter at least email or phone number!')
                return
            }
            const date = new Date()
            const lead: Lead = {
                ...this.leadForm.value,
                tradingExperience: parseInt(this.leadForm.controls['tradingExperience'].value),
                tradingPlatforms: parseInt(this.leadForm.controls['tradingPlatforms'].value),
                customerInterestScale: parseInt(this.leadForm.controls['customerInterestScale'].value),
                // leadStatus: parseInt(this.leadForm.controls['leadStatus'].value),
                leadStatus:LeadStatus.Potential,
                accountType: parseInt(this.leadForm.controls['accountType'].value),
                // created_at: this.leadForm.controls['created_at'].value ?? date,
                // leadOwner: 0,
                phone: this.leadForm.controls['phone'].value.e164Number
            }
            if (!this.edit){

                this.leadSrv.addLead(lead).subscribe({
                    next: res => {
                        if (res.hasOwnProperty('phone')) {
                            this.modalRef.dismissAll(res)
                        }
                    },
                    error: err => {
                        this.modalRef.dismissAll()
                        Dialogs.error(err,this.translate)
                    }
                })
            }
            if(this.edit){
                
                this.leadSrv.updateLead({...lead,action:LeadActions.UPDATE_LEAD,leadOwner:this.lead.leadOwner},this.lead.id).subscribe({
                    next: res => {
                        if (res.hasOwnProperty('phone')) {
                            this.modalRef.dismissAll(res)
                        }
                    },
                    error: err => {
                        this.modalRef.dismissAll()
                        Dialogs.error(err,this.translate)
                    }
                })
            }


        }
    }
    closeDialog() {
        this.modalRef.dismissAll()

    }
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];


    changePreferredCountries() {
        this.preferredCountries = [CountryISO.India, CountryISO.Canada];
    }

}