import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Post} from "../../utils/post";
import {ResponseMessage} from "../../utils/response_message";
import {Friendship} from "../../utils/friendship";
import {Message} from "../../utils/message";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  getMessagesFromUser(current_user_email: string, receiver_email: string): Observable<Message> {

    const uri = this.baseUrl + `/api/messages`;

    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: {
        'current_user': current_user_email,
        'receptor': receiver_email
      }
    };

    return this.httpClient.get<Message>(uri, options);

  }

  getAllMessages(current_user_email: string) {

    const uri = this.baseUrl + `/api/messages/${current_user_email}`;

    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: {
        'current_user': current_user_email
      }
    };

  }

  sendMessage(sender_email: string, receiver_email: string, content: string): Observable<any> {

    const uri = this.baseUrl + `/api/messages`;

    return this.httpClient.post(uri, {
      'sender': sender_email,
      'receiver': receiver_email,
      'message': content
    }, httpOptions);

  }

}
