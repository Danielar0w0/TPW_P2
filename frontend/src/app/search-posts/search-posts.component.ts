import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SearchService} from "../services/search/search.service";
import {Post} from "../utils/post";

@Component({
  selector: 'app-search-posts',
  templateUrl: './search-posts.component.html',
  styleUrls: ['./search-posts.component.css']
})
export class SearchPostsComponent implements OnInit {

    search_term: string = '';
    posts: Post[] = [];

    constructor(private route: ActivatedRoute, private searchService: SearchService) {
    }

    ngOnInit(): void {

        let query = this.route.snapshot.paramMap.get('query');

        if (query) {
            this.search_term = query;
            this.searchService.performSearch(3, query).subscribe(
                {
                    next: posts => {
                        this.posts = posts;
                    },
                    error: err => {
                        window.alert(err.message);
                    },
                }
            );
        }
    }
}
