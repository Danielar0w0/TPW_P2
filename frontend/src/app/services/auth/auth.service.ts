import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const uri = this.baseUrl + '/api/login';
    return this.httpClient.post(uri, {'email': email, 'password': password}, httpOptions);
  }

}
