import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {ResponseMessage} from "../../utils/response_message";
import {Friendship} from "../../utils/friendship";
import {QueryType} from "../../utils/query_type";
import {Session} from "../../utils/session";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Session.getCurrentSession()?.token
    })
}

@Injectable({
    providedIn: 'root'
})
export class FriendshipsService {

    private baseUrl = environment.apiURL;

    constructor(private httpClient: HttpClient) { }

    createFriendship(current_user: string, other_user: string): Observable<HttpResponse<ResponseMessage>> {
        const uri = this.baseUrl + `/api/friendships`;
        return this.httpClient.post<ResponseMessage>(uri, {
            'current_user': current_user,
            'other_user': other_user
        }, {observe: 'response', headers: httpOptions.headers});
    }

    deleteFriendship(current_user: string, other_user: string): Observable<any> {
        const uri = this.baseUrl + `/api/friendships`;

        const options = {
            headers: httpOptions.headers,
            body: {
                'current_user': current_user,
                'other_user': other_user
            }
        };

        return this.httpClient.delete(uri, options);

    }

}
