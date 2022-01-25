import {Component, Input, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {Post} from "../utils/post";
import {Session} from "../utils/session";
import {ActivatedRoute} from "@angular/router";
import {UsersService} from "../services/users/users.service";
import {environment} from "../../environments/environment";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreatePostModalComponent} from "../create-post-modal/create-post-modal.component";
import {Friendship} from "../utils/friendship";
import {FriendshipsService} from "../services/friendships/friendships.service";
import {InfoModalComponent} from "../info-modal/info-modal.component";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    userEmail: string;
    userProfile!: User;
    session!: Session | null
    friends: string[];
    posts: Post[];

    constructor(private route: ActivatedRoute, private usersService: UsersService, private modalService: NgbModal, private friendshipService: FriendshipsService) {
        this.userEmail = '';
        this.userProfile = User.getNullUser();
        this.session = Session.getCurrentSession();
        this.friends = [];
        this.posts = [];
    }

    ngOnInit(): void {

        if (this.session === null) return;

        this.route.params.subscribe(parameters => {

            this.userEmail = parameters['email'];

            if (!this.userEmail && this.session)
                this.userEmail = this.session.email;

            this.usersService.getUser(this.userEmail)
                .subscribe({
                    error: err => console.log('Error obtaining user by email in profile: ' + err.toString()),
                    next: user => this.userProfile = user
                });

            this.usersService.getUserFriendships(this.userEmail)
                .subscribe({
                    error: err => console.log('Error obtaining user friendships in profile: ' + err.toString()),
                    next: friendships => {
                        friendships.forEach(friendship => {
                            if (friendship.first_user === this.session?.email)
                                this.friends.push(friendship.second_user)
                            else
                                this.friends.push(friendship.first_user)

                        })
                    }
                });

            this.usersService.getUserPosts(this.userEmail)
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
        const modalReference = this.modalService.open(CreatePostModalComponent);
        modalReference.result.then(value => {
           this.refreshData();
        });
    }

    addFriend() {

        if (!this.session || !this.userProfile.user_email) return;

        this.friendshipService.createFriendship(this.session.email, this.userProfile.user_email)
            .subscribe({
                error: err => console.error("Error adding new friend: " + err.toString()),
                complete: () => {
                    const modalRef = this.modalService.open(InfoModalComponent);
                    modalRef.componentInstance.title = 'Friend Added';
                    modalRef.componentInstance.body = "You're now a friend of " + this.userProfile.user_email + ".";
                    this.refreshData();
                }
            })

    }

    removeFriend() {

        if (!this.session || !this.userProfile.user_email) return;

        this.friendshipService.deleteFriendship(this.session.email, this.userProfile.user_email)
            .subscribe({
                error: err => console.error("Error removing friend: " + err.toString()),
                complete: () => {
                    const modalRef = this.modalService.open(InfoModalComponent);
                    modalRef.componentInstance.title = 'Friend Removed';
                    modalRef.componentInstance.body = "You're no longer a friend of " + this.userProfile.user_email + ".";
                    this.refreshData();
                }
            })

    }

    refreshData() {

        this.userEmail = '';
        this.userProfile = User.getNullUser();
        this.session = Session.getCurrentSession();
        this.friends = [];
        this.posts = [];

        this.ngOnInit();

    }

}
