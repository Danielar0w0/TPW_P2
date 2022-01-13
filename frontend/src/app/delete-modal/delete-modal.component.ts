import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {Post} from "../utils/post";
import {User} from "../utils/user";

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  @ViewChild('deleteModal') public deleteModal!:ModalDirective;
  @Input() post!: Post;

  constructor() {
  }
  show(){
    this.deleteModal.show();
  }
  hide(){
    this.deleteModal.hide();
  }

  ngOnInit(): void {
  }

}
