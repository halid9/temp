/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';

import { firstValueFrom, Observable, of, Subject } from 'rxjs';



// Products Services
import { restApiService } from "../../../core/services/rest-api.service";
import { Lead } from 'src/app/core/models/lead.model';
import { HttpClient } from '@angular/common/http';
import { LeadActions, LeadStatus, UserTypes } from 'src/app/shared/helper';
import { User } from 'src/app/core/models/auth.models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LeadsService {

  import(data: Lead[]): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/lead/import`, data)
  }
  apiUrl = environment.apiUrl
  leads: Lead[] = []
  agents: User[] = []
  supervisors: User[] = []
  owners: User[] = []
  callCenters: User[] = []
  customers: User[] = []

  constructor(public ApiService: restApiService, private http: HttpClient) {
    this._init()
  }

  addLead(lead: Partial<Lead>) {

    return this.http.post(this.apiUrl + '/lead/new', {
      ...lead
    });
  }

  getLeads() {
    return this.http.get(this.apiUrl + '/lead/get');
  }

  updateLead(lead: Partial<Lead> & { action: LeadActions }, id: number) {
    return this.http.post(this.apiUrl + '/lead/save/' + id, {
      ...lead
    })
  }

  convertToDemo(lead: Partial<Lead>, id: number) {
    return this.http.post(this.apiUrl + '/lead/save/' + id, {
      ...lead, action: LeadActions.CONVERT_TO_DEMO
    })
  }


  convertToLive(lead: Partial<Lead>, id: number) {
    return this.http.post(this.apiUrl + '/lead/save/' + id, {
      ...lead, action: LeadActions.CONVERT_TO_LIVE
    })

  }



  convertToBonus(leadsIds: number[]) {
    return this.http.post(this.apiUrl + '/lead/to-bonus', leadsIds)
  }


  rejectBonus(leadsIds: number[]) {
    return this.http.post(this.apiUrl + '/lead/reject-bonus', leadsIds)
  }
  async _init() {

    const leads = await firstValueFrom(this.getLeads()) as Lead[]
    leads.forEach(l => {
      const lead = {
        ...l,
        leadStatus: l.leadStatus == LeadStatus.Potential ? 'Potential' : l.leadStatus == LeadStatus.Bonus ? 'Bonus' : l.leadStatus == LeadStatus.Live ? 'Live' : 'Demo'
      }
      this.leads.push(lead)
    })
    this.agents = await firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/user/by-type/agent`))
    this.supervisors = await firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/user/by-type/manager`))
    this.owners = await firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/user/by-type/crm`))
    this.callCenters = await firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/user/by-type/callcenter`))
    this.customers = await firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/user/by-type/customers`))


  }
  deleteLead(id) {
    return this.http.delete(this.apiUrl + '/lead/delete/' + id)

  }
}
