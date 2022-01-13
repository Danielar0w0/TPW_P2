import {Component, Input, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {Post} from "../utils/post";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // TODO: Params
  // @Input() params : string | undefined;
  user_profile: User;
  current_user: User;
  followers: number;
  following: number;
  posts: Post[];

  constructor() {

    this.user_profile = new User('test@ua.pt', 'test', 'test', 'trending-design.png', false);
    this.current_user = new User('test@ua.pt', 'test', 'test', 'trending-design.png', false);
    this.followers = 0;
    this.following = 0;
    this.posts = [
      new Post(1, this.user_profile, 'New test!', new Date(), 'shutterstock_1124866904-report-background-scaled.jpg'),
      new Post(2, this.user_profile, 'Second Test!', new Date(), 'download.jpg'),
    ]
  }

  ngOnInit(): void {
  }

}
