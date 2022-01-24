import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bubble';

  constructor(public router: Router) {}

  loggedIn() {

    localStorage.getItem('token');

    if (this.router.url === "/login") {

    }
  }
}
