import {Component, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {FormBuilder} from '@angular/forms';
import {Router} from "@angular/router";
import {SearchService} from "../services/search/search.service";

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

    users: User[] = [];
    searchForm = this.formBuilder.group({
        query_friend: ''
    });

    constructor(private searchService: SearchService, private router: Router, private formBuilder: FormBuilder,) {
    }

    ngOnInit(): void {
    }

    onSubmit() {

        // @ts-ignore
        let query = this.loginForm.get("query_friend").value;
        if (query === null)
            return ;

        // this.searchService.performSearch(query).subscribe(


    }

}
