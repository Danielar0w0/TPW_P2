import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Session} from "../../utils/session";
import {QueryType} from "../../utils/query_type";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Session.getCurrentSession()?.token
    })
}

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    private baseUrl = environment.apiURL;

    constructor(private httpClient: HttpClient) {
    }

    performSearch(queryType: QueryType, query: string): Observable<any> {

        const uri = this.baseUrl + '/api/search';

        let options = {
            headers: httpOptions.headers,
            params: new HttpParams().set('query_type', QueryType[queryType]).set('query', query)
        };

        return this.httpClient.get<any>(uri, options);
    }
}
