import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder,) {
  }

  ngOnInit(): void {
  }

  registerForm = this.formBuilder.group({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  onSubmit() {

    // @ts-ignore
    let username = this.registerForm.get("username").value;

    // @ts-ignore
    let email = this.registerForm.get("email").value;

    // @ts-ignore
    let password = this.registerForm.get("password").value;

    // @ts-ignore
    let password2 = this.registerForm.get("password2").value;

    if (username === null || email === null || password === null || password2 === null)
      return
    if (password !== password2)
      return;

    if (this.authService.register(email, username, password)) {
      window.alert("Login successful!");
      setTimeout(() => {
        window.location.replace("");
      });
    } else
      window.alert("Login unsuccessful!");

    this.registerForm.reset();
  }

}

