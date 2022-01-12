import { Component, OnInit } from '@angular/core';
import {User} from "../utils/user";

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css']
})
export class StartScreenComponent implements OnInit {

  user!: User;

  constructor() {
    this.user = new User('test@ua.pt', 'test', 'test', 'trending-design.png', false)
  }

  ngOnInit(): void {
  }

}
