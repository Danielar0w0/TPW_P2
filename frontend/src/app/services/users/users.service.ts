import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {User} from "../../utils/user";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  getUser(email: string): Observable<User> {
    const uri = this.baseUrl + `/api/user/${email}`;
    return this.httpClient.get<User>(uri, httpOptions);
  }

}
