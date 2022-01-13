import { Component, OnInit } from '@angular/core';
import {User} from "../utils/user";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  search_term: string;
  users: User[];
  friends: User[];

  constructor() {
    this.search_term = "Test";
    this.users = [
      new User('friend@ua.pt', 'friend', 'friend', 'trending-design.png', false)
    ];
    this.friends = [
      this.users[0]
    ]
  }

  ngOnInit(): void {
  }

}
