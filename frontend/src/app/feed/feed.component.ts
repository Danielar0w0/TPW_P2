import {Component, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {Post} from "../utils/post";
import {PostsService} from "../services/posts/posts.service";
import {FriendshipsService} from "../services/friendships/friendships.service";

@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

    posts: Post[];
    user!: User;

    constructor(private postsService: PostsService, private friendshipsService: FriendshipsService) {
        this.user = new User('test@ua.pt', 'test', 'test', 'trending-design.png', false)
        this.posts = [];
    }

    ngOnInit(): void {

        this.friendshipsService.getFriendships(this.user.email).subscribe(friendships => {

            friendships.forEach(friendship => {

                this.postsService.getPostsByUser(friendship.second_user.email).subscribe(posts => {
                    posts.forEach(post => this.posts.push(post));
                });

            });

        });

    }

}
