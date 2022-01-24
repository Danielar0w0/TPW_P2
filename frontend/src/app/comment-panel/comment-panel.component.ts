import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "../utils/comment";

@Component({
    selector: 'CommentPanel',
    templateUrl: './comment-panel.component.html',
    styleUrls: ['./comment-panel.component.css']
})
export class CommentPanelComponent implements OnInit {

    @Input() comment!: Comment;

    constructor() {
    }

    ngOnInit(): void {
    }

}
