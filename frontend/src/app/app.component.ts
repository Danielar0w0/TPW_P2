import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {Session} from "./utils/session";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bubble';

  constructor(public router: Router, public location: Location) {
    router.events.subscribe(() => {
      // If user isn't logged in and the current location isn't Login/Register
      if (!this.loggedIn() && (location.path() !== '/login' && location.path() != '/register')) {
        window.location.href = "/login";
        router.navigate(['/login']);
      }
    })
  }

  // Check if current user is logged in
  loggedIn() {
    return (Session.getCurrentSession() !== null);
  }
}
