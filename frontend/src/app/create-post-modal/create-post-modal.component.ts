import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PostsService} from "../services/posts/posts.service";
import {Session} from "../utils/session";
import {InfoModalComponent} from "../info-modal/info-modal.component";

@Component({
    selector: 'CreatePostModal',
    templateUrl: './create-post-modal.component.html',
    styleUrls: ['./create-post-modal.component.css']
})
export class CreatePostModalComponent implements OnInit {

    session: Session | null;
    postDescription?: string;
    file?: File | null;

    constructor(private postsService: PostsService, private modal: NgbActiveModal, private modalService: NgbModal) {
        this.session = Session.getCurrentSession();
    }

    ngOnInit(): void {
    }

    closeModal(): void {
        this.modal.close();
    }

    handleFileInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;
        if (!files) return;
        this.file = files.item(0);
    }

    submitPost(): void {

        if (this.session === undefined || this.session === null || this.postDescription === undefined || this.file === undefined || this.file === null)
            return;



        this.postsService.createPost(this.session.email, this.postDescription, this.file)
            .subscribe({
                error: err => {
                    console.log('Error crating post: ' + err.toString())
                    const infoModal = this.modalService.open(InfoModalComponent);
                    infoModal.componentInstance.title = 'Posts';
                    infoModal.componentInstance.body = 'Error creating post.';
                },
                complete: () => {
                    const infoModal = this.modalService.open(InfoModalComponent);
                    infoModal.componentInstance.title = 'Posts';
                    infoModal.componentInstance.body = 'Successfully created new post.';
                }
            })
            .add(() => this.closeModal())

    }

}
