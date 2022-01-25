import { Component, OnInit } from '@angular/core';
import {User} from "../utils/user";
import {ActivatedRoute} from "@angular/router";
import {SearchService} from "../services/search/search.service";

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent implements OnInit {

    type: string = '';
    search_term: string = '';
    users: User[] = [];

    constructor(private route: ActivatedRoute, private searchService: SearchService) {
    }

    ngOnInit(): void {

        let query = this.route.snapshot.paramMap.get('query');
        let query_type = this.route.snapshot.paramMap.get('query_type');

        if (query && query_type &&
            parseInt(query_type) > 0 && parseInt(query_type) < 3) {

            this.search_term = query;
            let q = parseInt(query_type);

            if (q === 1)
                this.type = 'Username';
            if (q == 2)
                this.type = 'Email';

            this.searchService.performSearch(q, query).subscribe(
                {
                    next: users => {
                        this.users = users;
                        console.log(users);
                    },
                    error: err => {
                        window.alert(err.message);
                    },
                }
            );
        }
    }

}
