import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";
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
                next: session => {

                    localStorage.setItem('user', JSON.stringify(session));

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
