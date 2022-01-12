import { Component, OnInit } from '@angular/core';
import {User} from "../utils/user";
import {Post} from "../utils/post";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  posts: Post[] | undefined;
  user!: User;

  constructor() {
    // this.user = {email: 'test@ua.pt', username: 'test', password: 'test', image: 'trending-design.png', admin: false};
    // this.posts = [{post_id: 1, user: this.user, description: 'New test!', date: new Date(), file: 'shutterstock_1124866904-report-background-scaled.jpg'}]
    this.user = new User('test@ua.pt', 'test', 'test', 'trending-design.png', false)
    this.posts = [
      new Post(1, this.user, 'New test!', new Date(), 'shutterstock_1124866904-report-background-scaled.jpg')
    ]
  }

  ngOnInit(): void {
  }

}
