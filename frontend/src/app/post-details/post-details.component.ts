import { Component, OnInit } from '@angular/core';
import {Post} from "../utils/post";
import {Comment} from "../utils/comment";
import {User} from "../utils/user";

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  post!: Post;
  comments!: Comment[];

  constructor() { }

  ngOnInit(): void {
    // let user = {email: 'test@ua.pt', username: 'test', password: 'test', image: 'trending-design.png', admin: false};
    // this.post = {post_id: 1, user: user, description: 'New test!', date: new Date(), file: 'shutterstock_1124866904-report-background-scaled.jpg'};
    let user = new User('test@ua.pt', 'test', 'test', 'trending-design.png', false)
    this.post = new Post(1, user, 'New test!', new Date(), 'shutterstock_1124866904-report-background-scaled.jpg');
    this.comments = []
  }

}
