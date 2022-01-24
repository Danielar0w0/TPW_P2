import {Component, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {Post} from "../utils/post";
import {PostsService} from "../services/posts/posts.service";
import {FriendshipsService} from "../services/friendships/friendships.service";
import {UsersService} from "../services/users/users.service";
import {environment} from "../../environments/environment";
import {Session} from "../utils/session";

@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

    posts: Post[];
    session!: Session | null;

    constructor(private postsService: PostsService, private friendshipsService: FriendshipsService, private usersService: UsersService) {
        this.posts = [];
        this.session = Session.getCurrentSession();
    }

    ngOnInit(): void {

        if (this.session === null) return;

        this.usersService.getUserFriendships(this.session.email).subscribe(friendships => {

            friendships.forEach(friendship => {

                this.usersService.getUserPosts(friendship.second_user).subscribe(posts => {
                    posts.forEach(post => {
                        if (post.file !== null)
                            post.file = environment.apiURL + post.file.replace("/BubbleAPI", "");
                        this.posts.push(post);
                    });
                });

            });

        });

    }

}
