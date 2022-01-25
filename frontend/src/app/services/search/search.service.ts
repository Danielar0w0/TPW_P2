import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {QueryType} from "../../utils/query_type";
import {Session} from "../../utils/session";

@Injectable({
    providedIn: 'root'
})

export class SearchService {

    private baseUrl = environment.apiURL;

    constructor(private httpClient: HttpClient) {
    }

    performSearch(queryType: QueryType, query: string): Observable<any> {

        const uri = this.baseUrl + '/api/search';

        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Session.getCurrentSession()?.token
            }),
            params: {'query_type': QueryType[queryType], 'query': query}
        };

        return this.httpClient.get(uri, httpOptions);
    }
}
