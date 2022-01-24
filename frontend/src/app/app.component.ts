import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bubble';

  constructor(public router: Router, public location: Location) {
    router.events.subscribe(val => {
      // If user isn't logged in and the current location isn't Login/Register
      if (!this.loggedIn() && (location.path() !== '/login' && location.path() != '/register')) {
        window.location.href = "/login";
        router.navigate(['/login']);
      }
    })
  }

  // Check if current user is logged in
  loggedIn() {
    if (localStorage.getItem('user')) {
      // @ts-ignore
      let user = JSON.parse(localStorage.getItem('user'));
      if ('token' in user && 'email' in user) {
        if (user.token !== '' && user.email !== '')
          return true;
      }
    }
    return false;
  }
}
