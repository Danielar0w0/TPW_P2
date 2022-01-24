import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../utils/post";

@Component({
  selector: 'FeedPost',
  templateUrl: './feed-post.component.html',
  styleUrls: ['./feed-post.component.css']
})
export class FeedPostComponent implements OnInit {

  @Input() post?: Post;

  constructor() {
  }

  ngOnInit(): void {
  }

}
