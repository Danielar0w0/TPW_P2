import { Component, OnInit } from '@angular/core';
import {User} from "../utils/user";
import {Message} from "../utils/message";

@Component({
  selector: 'app-messages-with',
  templateUrl: './messages-with.component.html',
  styleUrls: ['./messages-with.component.css']
})
export class MessagesWithComponent implements OnInit {

  other_user: User;
  messages: Message[];
  current_user: User;

  constructor() {
    this.other_user = new User('friend@ua.pt', 'friend', 'friend', 'trending-design.png', false);
    this.current_user = new User('test@ua.pt', 'test', 'test', 'trending-design.png', false);
    this.messages = [
      new Message(1, this.other_user, this.current_user, "Hello!"),
      new Message(2, this.current_user, this.other_user, "Hello 2!"),
    ]
  }

  ngOnInit(): void {
  }

}
