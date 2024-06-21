import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountType } from 'src/app/shared/helper';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class Mt5ManagerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllAccounts(accountType:AccountType): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/mt5manager/get-all-accounts/'+accountType);
  }

  changeAccountPassword(user: number, password: string,accountType:AccountType, type?: 'master' | 'investor' | 'api'): Observable<any> {
    const body = {
      user: user,
      password: password,
      type: type
    };
    return this.http.post<any>(this.apiUrl + '/mt5manager/change-account-password/'+ accountType, body);
  }

  checkAccountPassword(user: number, password: string,accountType:AccountType, type?: 'master' | 'investor' | 'api'): Observable<any> {
    const body = {
      user: user,
      password: password,
      type: type
    };
    return this.http.post<any>(this.apiUrl + '/mt5manager/check-account-password/'+accountType, body);
  }

  updateAccountInfo(
    user: number,
    accountType:AccountType,
    name?: string,
    first_name?: string,
    last_name?: string,
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
      first_name: first_name,
      last_name: last_name,
      phone: phone,
      email: email,
      leverage: leverage,
      color: color,
      group: group,
      comment: comment,
      country: country,
      agent: agent
    };
    return this.http.post<any>(this.apiUrl + '/mt5manager/update-account-info/'+accountType, body);
  }

  addAccountInfo(
    new_login: number,
    new_password: string,
    accountType:AccountType,
    name?: string,
    first_name?: string,
    last_name?: string,
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
      first_name: first_name,
      last_name: last_name,
      phone: phone,
      email: email,
      leverage: leverage,
      color: color,
      group: group,
      comment: comment,
      country: country,
      agent: agent
    };
    return this.http.post<any>(this.apiUrl + '/mt5manager/add-account-info/'+accountType, body);
  }

  accountBalance(user: number,accountType:AccountType, operation: "Balance" | "Credit" | "Charge" | "Correction" | "Bonus" | "Commission", amount: number, comment: string, noCheck: boolean): Observable<any> {
    const body = {
      user: user,
      operation: operation,
      amount: amount,
      comment: comment,
      noCheck: noCheck
    };
    return this.http.post<any>(this.apiUrl + '/mt5manager/account-balance/'+accountType, body);
  }

  accountHistory(user: number,accountType:AccountType, from: string, to: string): Observable<any> {
    const body = {
      user: user,
      from: from,
      to: to
    };
    return this.http.post<any>(this.apiUrl + '/mt5manager/account-deals/'+accountType, body);
  }

  accountUserRights(user: number,accountType:AccountType, enabled: boolean, allow_trade: boolean, password: boolean, investor: boolean, confirmed: boolean, trailing: boolean,
    expert: boolean, obsolete: boolean, reports: boolean, readonly: boolean, reset_pass: boolean, otp_enabled: boolean, sponsored_hosting: boolean,
    api_enabled: boolean, push_notification: boolean, technical: boolean, exclude_reports: boolean): Observable<any> {
    const body = {
      user: user,
      enabled,
      allow_trade,
      password,
      investor,
      confirmed,
      trailing,
      expert,
      obsolete,
      reports,
      readonly,
      reset_pass,
      otp_enabled,
      sponsored_hosting,
      api_enabled,
      push_notification,
      technical,
      exclude_reports,
    };
    return this.http.post<any>(this.apiUrl + '/mt5manager/account-user-rights/'+accountType, body);
  }

  getOnlineUsers(accountType:AccountType): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/mt5manager/get-online-accounts/'+accountType);
  }

  agentCommission(agent: number, commission: number, from: string, to: string): Observable<any> {
    const body = {
      from: from,
      to: to,
      commission: commission
    };
    return this.http.post<any>(this.apiUrl + '/mt5manager/mt5-agents-commissions/' + agent, body);
  }
  getMt5AccountsGroupsNames(){
    return this.http.get<any[]>(`${this.apiUrl}/account-group/mt5-groups`)
 }
}
