import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../utils/post";
import {Comment} from "../utils/comment";
import {User} from "../utils/user";
import {ActivatedRoute} from "@angular/router";
import {PostsService} from "../services/posts/posts.service";

@Component({
    selector: 'app-post-details',
    templateUrl: './post-details.component.html',
    styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

    @Input() post!: Post;
    postOwner: User;
    comments: Comment[];

    constructor(private route: ActivatedRoute, private postsService: PostsService) {
        this.postOwner = User.getNullUser();
        this.comments = []
    }

    ngOnInit(): void {

        this.route.params.subscribe(parameters => {

            let postId = parameters['id'];
            if (postId === undefined) return;

        });

    }

}
