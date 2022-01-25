import {Component, Input, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {Post} from "../utils/post";
import {Session} from "../utils/session";
import {ActivatedRoute} from "@angular/router";
import {UsersService} from "../services/users/users.service";
import {environment} from "../../environments/environment";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreatePostModalComponent} from "../create-post-modal/create-post-modal.component";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    userProfile!: User;
    session!: Session | null;
    friendsCount: number;
    posts: Post[];

    constructor(private route: ActivatedRoute, private usersService: UsersService, public modalService: NgbModal) {
        this.userProfile = User.getNullUser();
        this.session = Session.getCurrentSession();
        this.friendsCount = 0;
        this.posts = [];
    }

    ngOnInit(): void {

        if (this.session === null) return;

        this.route.params.subscribe(parameters => {

            let userEmail = parameters['email'];

            if (userEmail === undefined)
                userEmail = this.session?.email;

            this.usersService.getUser(userEmail)
                .subscribe({
                    error: err => console.log('Error obtaining user by email in profile: ' + err.toString()),
                    next: user => this.userProfile = user
                });

            this.usersService.getUserFriendships(userEmail)
                .subscribe({
                    error: err => console.log('Error obtaining user friendships in profile: ' + err.toString()),
                    next: friendships => this.friendsCount += friendships.length
                });

            this.usersService.getUserPosts(userEmail)
                .subscribe({
                    error: err => console.log('Error obtaining user posts in profile: ' + err.toString()),
                    next: posts => {
                        posts.forEach(post => {
                            if (post.file !== null)
                                post.file = environment.apiURL + post.file.replace("/BubbleAPI", "");
                            this.posts.push(post);
                        });
                    }
                });

        });

    }

    handlePostCreation() {
        this.modalService.open(CreatePostModalComponent)
    }

}
