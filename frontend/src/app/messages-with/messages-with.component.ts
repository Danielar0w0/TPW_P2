import {Component, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {Message} from "../utils/message";
import {ActivatedRoute} from "@angular/router";
import {Session} from "../utils/session";
import {UsersService} from "../services/users/users.service";
import {MessagesService} from "../services/messages/messages.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../info-modal/info-modal.component";

@Component({
    selector: 'app-messages-with',
    templateUrl: './messages-with.component.html',
    styleUrls: ['./messages-with.component.css']
})
export class MessagesWithComponent implements OnInit {

    session: Session | null;
    current_user!: User;
    other_user!: User;
    messages: Message[];
    current_message?: string;

    constructor(private route: ActivatedRoute, private usersService: UsersService, private messagesService: MessagesService, private modalService: NgbModal) {
        this.session = Session.getCurrentSession();
        this.other_user = User.getNullUser();
        this.messages = []
    }

    ngOnInit(): void {

        this.route.params.subscribe(parameters => {

            let receiverEmail = parameters['email'];
            if (receiverEmail === undefined) return;

            this.usersService.getUser(receiverEmail)
                .subscribe({
                    error: err => console.error("Error getting message receiver: " + err.toString()),
                    next: user => this.other_user = user
                });

            if (this.session === undefined || this.session === null) return;

            this.usersService.getUser(this.session.email)
                .subscribe({
                    error: err => console.error("Error getting current user: " + err.toString()),
                    next: user => this.current_user = user
                });

            this.usersService.getUserMessages(this.session.email)
                .subscribe({
                    error: err => console.error("Error getting messages: " + err.toString()),
                    next: messages => {
                        messages.sort(function (m1, m2) { return m1.id - m2.id }).forEach(message => this.messages.push(message))
                    }
                });

            /*
            this.messagesService.getMessagesFromUser(receiverEmail, this.session.email)
                .subscribe({
                    error: err => console.error("Error getting messages: " + err.toString()),
                    next: messages => {
                        messages.forEach(message => this.messages.push(message))
                    }
                });
             */
        });
    }

    sendMessage() {

        if (this.session === undefined || this.session === null || this.other_user.user_email === undefined || this.current_message === undefined) return;

        this.messagesService.sendMessage(this.session.email, this.other_user.user_email, this.current_message)
            .subscribe({
                error: err => console.error("Error sending message: " + err.toString()),
                complete: () => {
                    const modalRef = this.modalService.open(InfoModalComponent);
                    modalRef.componentInstance.title = 'Message Sent';
                    modalRef.componentInstance.body = "You've successfully sent a message to " + this.other_user.username + ".";
                    this.messages = [];
                    this.ngOnInit();
                }
            })
    }

}
