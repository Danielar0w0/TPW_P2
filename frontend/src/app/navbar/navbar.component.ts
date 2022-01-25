import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    searchForm = this.formBuilder.group({
        query_type: '',
        query: ''
    });

    constructor(private router: Router, private formBuilder: FormBuilder,) {
    }

    ngOnInit(): void {
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
