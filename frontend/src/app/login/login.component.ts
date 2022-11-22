import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from '@angular/forms';
import {CreatePostModalComponent} from "../create-post-modal/create-post-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../info-modal/info-modal.component";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder, private modalService: NgbModal) {
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

                    const modalReference = this.modalService.open(InfoModalComponent);
                    modalReference.componentInstance.title = 'Successful Log-in'
                    modalReference.componentInstance.body = "You've successfully logged in into your account."

                    setTimeout(() => {
                        window.location.replace("");
                    }, 1000);

                },
                error: err => {
                    const modalReference = this.modalService.open(InfoModalComponent);
                    modalReference.componentInstance.title = 'Error'
                    modalReference.componentInstance.body = 'Unable to log-in into your account.'
                },
            }
        );

        this.loginForm.reset();
    }

}
