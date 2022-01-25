import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {User} from "../utils/user";
import {Session} from "../utils/session";
import {UsersService} from "../services/users/users.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    userProfile!: User;
    session!: Session | null;

    searchForm = this.formBuilder.group({
        query_type: '',
        query: ''
    });

    constructor(private router: Router, private usersService: UsersService, private formBuilder: FormBuilder,) {
        this.userProfile = User.getNullUser();
        this.session = Session.getCurrentSession();
    }

    ngOnInit(): void {

        if (this.session === null) return;

        let userEmail = this.session?.email;

        this.usersService.getUser(userEmail)
            .subscribe({
                error: err => console.log('Error obtaining user by email in profile: ' + err.toString()),
                next: user => this.userProfile = user
            });
    }

    onSubmit() {

        // @ts-ignore
        let query_type = this.searchForm.get("query_type").value;

        // @ts-ignore
        let query = this.searchForm.get("query").value;

        if (query === null || query_type === null ||
            query_type < 1 || query_type > 3)
            return;

        this.router.navigate(['/search/' + query_type + '/' + query]);
        window.location.href = '/search/' + query_type + '/' + query;
    }

    logout() {
        localStorage.removeItem('user');
    }
}
