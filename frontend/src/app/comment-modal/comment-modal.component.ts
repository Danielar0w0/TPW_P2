import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {Post} from "../utils/post";
import {User} from "../utils/user";

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent implements OnInit {

  @ViewChild('commentModal') public commentModal!:ModalDirective;
  @Input() post!: Post;
  @Input() user_profile!: User;

  constructor() {
  }
  show(){
    this.commentModal.show();
  }
  hide(){
    this.commentModal.hide();
  }

  ngOnInit(): void {
  }
}
