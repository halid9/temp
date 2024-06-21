import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class Mt4managerService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllAccounts(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/mt4manager/get-all-accounts');
  }

  addAccountInfo(
    new_login: number,
    new_password: string,
    name?: string,
    phone?: string,
    email?: string,
    leverage?: number,
    color?: number,
    group?: string,
    comment?: string,
    country?: string,
    agent?: number
  ): Observable<any> {
    const body = {
      new_login: new_login,
      new_password: new_password,
      name: name,
      phone: phone,
      email: email,
      leverage: leverage,
      color: color,
      group: group,
      comment: comment,
      country: country,
      agent: agent
    };
    return this.http.post<any>(this.apiUrl + '/mt4manager/add-account-info', body);
  }

  updateAccountInfo(
    user: number,
    name?: string,
    phone?: string,
    email?: string,
    leverage?: number,
    color?: number,
    group?: string,
    comment?: string,
    country?: string,
    agent?: number
  ): Observable<any> {
    const body = {
      user: user,
      name: name,
      phone: phone,
      email: email,
      leverage: leverage,
      color: color,
      group: group,
      comment: comment,
      country: country,
      agent: agent
    };
    return this.http.post<any>(this.apiUrl + '/mt4manager/update-account-info', body);
  }

  changeAccountPassword(user: number, password: string): Observable<any> {
    const body = {
      user: user,
      password: password
    };
    return this.http.post<any>(this.apiUrl + '/mt4manager/change-account-password', body);
  }

  checkAccountPassword(user: number, password: string): Observable<any> {
    const body = {
      user: user,
      password: password
    };
    return this.http.post<any>(this.apiUrl + '/mt4manager/check-account-password', body);
  }

  accountBalance(user: number, amount: number, comment: string): Observable<any> {
    const body = {
      user: user,
      amount: amount,
      comment: comment
    };
    return this.http.post<any>(this.apiUrl + '/mt4manager/account-balance', body);
  }

  accountHistory(user: number, from: string, to: string): Observable<any> {
    const body = {
      user: user,
      from: from,
      to: to
    };
    return this.http.post<any>(this.apiUrl + '/mt4manager/account-deals', body);
  }

  accountUserRights(user: number, enabled: boolean, readonly: boolean, password: boolean, reports: boolean, otp_enabled: boolean): Observable<any> {
    const body = {
      user: user,
      enabled,
      readonly,
      password,
      reports,
      otp_enabled
    };
    return this.http.post<any>(this.apiUrl + '/mt4manager/account-user-rights', body);
  }

  getOnlineUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/mt4manager/get-online-accounts');
  }

  agentCommission(agent: number, commission: number, from: string, to: string): Observable<any> {
    const body = {
      from: from,
      to: to,
      commission: commission
    };
    return this.http.post<any>(this.apiUrl + '/mt4manager/mt4-agents-commissions/' + agent, body);
  }
  getMt4AccountsGroupsNames(){
    return this.http.get<any[]>(`${this.apiUrl}/account-group/mt4-groups`)
 }
}
