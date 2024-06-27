import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigData } from 'src/app/shared/config-data';



@Injectable({
    providedIn: 'root'
})
export class restApiService {

    // get httpOptions() {
    //     return 
    // }
    getData(endpoint: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        };
        return this.http.get(ConfigData.config.API_URL + '/' + endpoint, httpOptions);
    }

    getTodoData() {
        return this.getData('todos');
    }
    getAccountData() {
        // console.log('getAccountData');
        return this.getData('account/all');
    }
    constructor(private http: HttpClient) { }

}
