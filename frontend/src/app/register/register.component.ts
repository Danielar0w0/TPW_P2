import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {InfoModalComponent} from "../info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder, private modalService: NgbModal) {
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

        if (username === null || email === null || password === null || password2 === null) {
            const modalReference = this.modalService.open(InfoModalComponent);
            modalReference.componentInstance.title = 'Error';
            modalReference.componentInstance.body = "Please fill in all required fields.";
            return
        }

        if (password !== password2) {
            const modalReference = this.modalService.open(InfoModalComponent);
            modalReference.componentInstance.title = 'Error';
            modalReference.componentInstance.body = "Your passwords don't match.";
            return;
        }

        this.authService.register(email, username, password).subscribe({
                next: items => {
                    const modalReference = this.modalService.open(InfoModalComponent);
                    modalReference.componentInstance.title = 'Successful Registration';
                    modalReference.componentInstance.body = "You've successfully registered your account.";
                    setTimeout(() => {
                        window.location.replace("/login");
                    });
                },
                error: err => {
                    const modalReference = this.modalService.open(InfoModalComponent);
                    modalReference.componentInstance.title = 'Error';
                    modalReference.componentInstance.body = "An error occurred while registering your account.";
                },
            }
        )

        this.registerForm.reset();
    }

}

