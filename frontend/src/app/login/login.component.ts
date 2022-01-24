import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";
// import {User} from "../utils/user";
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder,) {
  }

  ngOnInit(): void {
  }

  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  onSubmit() {

    // @ts-ignore
    let username = this.loginForm.get("username").value;
    // @ts-ignore
    let password = this.loginForm.get("password").value;

    if (username === null || password === null)
      return

    if (this.authService.login(username, password)) {
      window.alert("Login successful!");
      setTimeout(() => {
        window.location.replace("");
      });
    } else
      window.alert("Login unsuccessful!");

    this.loginForm.reset();
  }

}
