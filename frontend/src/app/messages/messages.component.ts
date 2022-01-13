import { Component, OnInit } from '@angular/core';
import {User} from "../utils/user";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  users: User[] = [];

  constructor() {
    this.users = [
      new User('friend@ua.pt', 'friend', 'friend', 'trending-design.png', false)
    ]
  }

  ngOnInit(): void {
  }

}
