import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Session} from "../../utils/session";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) {
  }

  login(email: string, password: string): Observable<Session> {
    const uri = this.baseUrl + '/api/login';
    return this.httpClient.post<Session>(uri, {'email': email, 'password': password}, httpOptions);
  }

  register(email: string, username: string, password: string): Observable<Object> {
    const uri = this.baseUrl + '/api/register';
    return this.httpClient.post(uri, {'user_email': email, 'username': username, 'password': password}, httpOptions);
  }
}
