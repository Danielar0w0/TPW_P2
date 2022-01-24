import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Post} from "../../utils/post";
import {ResponseMessage} from "../../utils/response_message";
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
export class PostsService {

    private baseUrl = environment.apiURL;

    constructor(private httpClient: HttpClient) {
    }

    getAllPosts(): Observable<Post[]> {
        const uri = this.baseUrl + `/api/posts`;
        return this.httpClient.get<Post[]>(uri, httpOptions);
    }

    createPost(user: string, description: string, file: File): Observable<HttpResponse<ResponseMessage>> {

        const uri = this.baseUrl + `/api/posts`;
        const formData: FormData = new FormData();

        formData.append('user', user);
        formData.append('description', description);
        formData.append('file', file, file.name);

        return this.httpClient.post<ResponseMessage>(uri, formData, {observe: 'response', headers: new HttpHeaders({'Authorization': 'Bearer ' + Session.getCurrentSession()?.token})});

    }

    deletePost(postId: number): Observable<any> {
        const uri = this.baseUrl + `/api/posts`;

        const options = {
            headers: httpOptions.headers,
            body: {
                'id': postId
            }
        };

        return this.httpClient.delete<ResponseMessage>(uri, options);
    }

}
