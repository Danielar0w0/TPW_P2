import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {QueryType} from "../../utils/query_type";

@Injectable({
    providedIn: 'root'
})

export class SearchService {

    private baseUrl = environment.apiURL;

    constructor(private httpClient: HttpClient) {
    }

    performSearch(queryType: QueryType, query: string): Observable<any> {

        const uri = this.baseUrl + `/api/search`;

        // @ts-ignore
        let user = JSON.parse(localStorage.getItem('user'));

        let httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token}),
            params: new HttpParams().set('query_type', QueryType[queryType]).set('query', query)
        };

        return this.httpClient.post(uri, httpOptions);
    }
}
