import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {ResponseMessage} from "../../utils/response_message";
import {Friendship} from "../../utils/friendship";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class FriendshipsService {

  private baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  getFriendships(user_email: string): Observable<Friendship> {
    const uri = this.baseUrl + `/api/friendships/${user_email}`
    return this.httpClient.get<Friendship>(uri, httpOptions);
  }

  createFriendship(current_user: string, other_user: string): Observable<HttpResponse<ResponseMessage>> {
    const uri = this.baseUrl + `/api/friendships`;
    return this.httpClient.post<ResponseMessage>(uri, {'current_user': current_user, 'other_user': other_user}, {observe: 'response'});
  }

  deleteFriendship(current_user: string, other_user: string): Observable<any> {
    const uri = this.baseUrl + `/api/friendships`;

    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: {
        'current_user': current_user,
        'other_user': other_user
      }
    };

    return this.httpClient.delete(uri, options);

  }

}
