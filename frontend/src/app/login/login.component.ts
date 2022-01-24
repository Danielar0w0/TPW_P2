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
    email: '',
    password: ''
  });

  onSubmit() {

    // @ts-ignore
    let email = this.loginForm.get("email").value;
    // @ts-ignore
    let password = this.loginForm.get("password").value;

    if (email === null || password === null)
      return

    this.authService.login(email, password).subscribe({
        next: items => {

          let values = ['token', 'user_id', 'email'];
          for (let param in values) {
            if (!(values[param] in items)) {
              window.alert("Something went wrong! Try again.");
              return;
            }
          }

          localStorage.setItem('user', JSON.stringify(items));
          window.alert("Login successful!");
          setTimeout(() => {
            window.location.replace("");
          }, 1000);
        },
        error: err => {
          window.alert(err.message);
        },
      }
    );

    this.loginForm.reset();
  }

}
