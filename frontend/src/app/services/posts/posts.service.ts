import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Post} from "../../utils/post";
import {ResponseMessage} from "../../utils/response_message";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  getPostsByUser(email: string): Observable<Post[]> {
    const uri = this.baseUrl + `/api/posts`;

    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: {
        'user': email,
      }
    };

    return this.httpClient.get<Post[]>(uri, httpOptions);
  }

  createPost(user: string, description: string, file: File): Observable<HttpResponse<ResponseMessage>> {

    const uri = this.baseUrl + `/api/posts`;
    const formData: FormData = new FormData();

    formData.append('user', user);
    formData.append('description', description);
    formData.append('file', file, file.name);

    return this.httpClient.post<ResponseMessage>(uri, formData, {observe: 'response'});

  }

  deletePost(postId: number): Observable<HttpResponse<ResponseMessage>> {
    const uri = this.baseUrl + `/api/posts`;
    return this.httpClient.post<ResponseMessage>(uri, {'id': postId}, {observe: 'response'});
  }

}
