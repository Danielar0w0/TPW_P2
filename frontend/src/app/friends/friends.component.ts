import { Component, OnInit } from '@angular/core';
import {User} from "../utils/user";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  users: User[] = [];

  constructor() { }

  ngOnInit(): void {
    this.users = [
      new User('friend@ua.pt', 'friend', 'friend', 'trending-design.png', false)
    ]
  }

}
