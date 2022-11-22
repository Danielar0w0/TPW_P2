import { Component, OnInit } from '@angular/core';
import {User} from "../utils/user";
import {ActivatedRoute} from "@angular/router";
import {SearchService} from "../services/search/search.service";
import {environment} from "../../environments/environment";

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
                        users.forEach((user: User) => {
                            if (user.image)
                                user.image = environment.apiURL + user.image.replace("/BubbleAPI", "");
                            this.users.push(user);
                        })
                    },
                    error: err => {
                        window.alert(err.message);
                    },
                }
            );
        }
    }

}
