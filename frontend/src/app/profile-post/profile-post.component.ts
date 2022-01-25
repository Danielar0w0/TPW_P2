import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../utils/post";
import {Session} from "../utils/session";
import {User} from "../utils/user";
import {PostsService} from "../services/posts/posts.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../info-modal/info-modal.component";
import {CommentModalComponent} from "../comment-modal/comment-modal.component";

@Component({
    selector: 'ProfilePost',
    templateUrl: './profile-post.component.html',
    styleUrls: ['./profile-post.component.css']
})
export class ProfilePostComponent implements OnInit {

    @Input() post!: Post;
    @Input() userProfile!: User;
    @Output() dataChanged = new EventEmitter<void>();
    session: Session | null;

    constructor(private postsService: PostsService, private modalService: NgbModal) {
        this.session = Session.getCurrentSession();
    }

    ngOnInit(): void {

    }

    deletePost() {

        this.postsService.deletePost(this.post.post_id)
            .subscribe({
                error: err => {
                    const infoModal = this.modalService.open(InfoModalComponent);
                    infoModal.componentInstance.title = 'Error';
                    infoModal.componentInstance.body = 'Your post could not be deleted.'
                },
                complete: () => {
                    const infoModal = this.modalService.open(InfoModalComponent);
                    infoModal.componentInstance.title = 'Post Deleted';
                    infoModal.componentInstance.body = 'Your post was deleted.'
                    this.dataChanged.emit();
                }
            })

    }

    commentPost() {
        const modalRef = this.modalService.open(CommentModalComponent);
        modalRef.componentInstance.post = this.post;
        modalRef.componentInstance.user_profile = Session.getCurrentSession();
    }

}
