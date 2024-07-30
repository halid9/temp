import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigData } from 'src/app/shared/config-data';



@Injectable({
    providedIn: 'root'
})
export class RestApiService {

    constructor(private http: HttpClient) { }
    // get httpOptions() {
    //     return 
    // }
    get(endpoint: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        };
        return this.http.get(ConfigData.config.API_URL + '/' + endpoint, httpOptions);
    }
    post(endpoint: string, body: Map<string, any>): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        };
        return this.http.post(ConfigData.config.API_URL + '/' + endpoint, body, httpOptions);
    }
    patch(endpoint: string, body: Map<string, any>): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        };
        return this.http.patch(ConfigData.config.API_URL + '/' + endpoint, body, httpOptions);
    }

    getTodoData() {
        return this.get('todos');
    }
    getAccountData() {
        // console.log('getAccountData');
        return this.get('account/all');
    }
    changeAccountPassword(id: number, password: string) {
        const body = {
            action: 'UPDATE_MASTER_PASSWORD',
            accountMasterPassword: password
        } as unknown as Map<string, any>;
        return this.patch('account/update/' + id, body)
    }

    changeAccountName(id: number, name: string) {
        const body = {
            accountName: name,
            action: "UPDATE_NAME"
        } as unknown as Map<string, any>;
        return this.patch('account/update/' + id, body)

    }
}
