import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigData } from 'src/app/shared/config-data';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` })
};


@Injectable({
    providedIn: 'root'
})
export class restApiService {

    getData(endpoint: string): Observable<any> {
        return this.http.get(ConfigData.config.API_URL + endpoint, httpOptions);
    }

    getTodoData() {
        return this.http.get(ConfigData.config.API_URL + 'todos', httpOptions);
    }
    constructor(private http: HttpClient) { }

}
