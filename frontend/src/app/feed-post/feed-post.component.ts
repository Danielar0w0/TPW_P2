import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../utils/post";
import {CommentModalComponent} from "../comment-modal/comment-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../utils/user";

@Component({
  selector: 'FeedPost',
  templateUrl: './feed-post.component.html',
  styleUrls: ['./feed-post.component.css']
})
export class FeedPostComponent implements OnInit {

  @Input() post?: Post;

  constructor(public modal: NgbModal) {
  }

  ngOnInit(): void {

  }

  openModal() {
      const modalRef = this.modal.open(CommentModalComponent);
      modalRef.componentInstance.post = this.post;
      modalRef.componentInstance.user_profile = new User("hugogoncalves13@ua.pt", "hugo", "hugo", "", false);
  }

}
