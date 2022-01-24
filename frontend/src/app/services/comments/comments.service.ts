import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {catchError, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
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
export class CommentsService {

  private baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  getPostComments(postId: number): Observable<Comment[]> {
    const uri = this.baseUrl + `/api/posts/${postId}/comments`;
    return this.httpClient.get<Comment[]>(uri, httpOptions);
  }

  createComment(postId: number, user: string, content: string): Observable<Comment> {
    const uri = this.baseUrl + `/api/posts/${postId}/comments`;
    return this.httpClient.post<Comment>(uri, {'user': user, 'content': content}, httpOptions);
  }

  deleteComment(postId: number, commentId: number): Observable<any> {

    const uri = this.baseUrl + `/api/posts/${postId}/comments`;

    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: {
        'id': commentId
      }
    };

    return this.httpClient.delete(uri, options);

  }

}
