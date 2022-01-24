import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
// import {environment} from "../../../environments/environment";
// import {Observable} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = "http://127.0.0.1:8000";

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string): boolean {
    const uri = this.baseUrl + '/api/login';
    this.httpClient.post(uri, {'email': email, 'password': password}, httpOptions);
    return true;
  }

  register(email: string, username: string, password: string): boolean {
    const uri = this.baseUrl + '/api/register';
    this.httpClient.post(uri, {'user_email': email, 'username': username, 'password': password}, httpOptions);

    return true;
  }
}
