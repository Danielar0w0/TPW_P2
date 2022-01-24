import {Component, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {Post} from "../utils/post";
import {PostsService} from "../services/posts/posts.service";
import {FriendshipsService} from "../services/friendships/friendships.service";
import {UsersService} from "../services/users/users.service";

@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

    posts: Post[];
    user!: User;

    constructor(private postsService: PostsService, private friendshipsService: FriendshipsService, private usersService: UsersService) {
        this.user = new User('hugogoncalves13@ua.pt', 'hugo', 'hugo', 'trending-design.png', false)
        this.posts = [];
    }

    ngOnInit(): void {

        this.usersService.getUserFriendships(this.user.email).subscribe(friendships => {

            friendships.forEach(friendship => {

                alert(friendship)

                this.usersService.getUserPosts(friendship.second_user.email).subscribe(posts => {
                    alert(posts)
                    posts.forEach(post => this.posts.push(post));
                });

            });

        });

    }

}
