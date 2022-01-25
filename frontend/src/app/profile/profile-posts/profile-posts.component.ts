import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Post} from "../../utils/post";
import {User} from "../../utils/user";
import {environment} from "../../../environments/environment";
import {UsersService} from "../../services/users/users.service";
import {Session} from "../../utils/session";

@Component({
    selector: 'ProfilePosts',
    templateUrl: './profile-posts.component.html',
    styleUrls: ['./profile-posts.component.css']
})
export class ProfilePostsComponent implements OnInit, OnChanges {

    @Input() userEmail: string;
    @Input() numOfPosts: number;
    posts: Post[];
    session: Session | null;

    constructor(private usersService: UsersService) {
        this.numOfPosts = 0;
        this.userEmail = '';
        this.posts = [];
        this.session = Session.getCurrentSession();
    }

    ngOnInit(): void {

        this.usersService.getUserPosts(this.userEmail)
            .subscribe({
                error: err => console.log('Error obtaining user posts in profile-root: ' + err.toString()),
                next: posts => {
                    posts.forEach(post => {
                        let shouldAppend = true;

                        if (post.file !== null)
                            post.file = environment.apiURL + post.file.replace("/BubbleAPI", "");

                        this.posts.forEach(postEach => {
                            if (postEach.post_id === post.post_id)
                                shouldAppend = false;
                        })

                        if (shouldAppend) this.posts.push(post);

                    });
                }
            });

    }

    refreshData() {
        this.posts = [];
        this.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.refreshData();
    }

}
