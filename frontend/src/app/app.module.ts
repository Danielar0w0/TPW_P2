import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FeedComponent } from './feed/feed.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FriendsComponent } from './friends/friends.component';
import { ProfileComponent } from './profile/profile.component';
import { MessagesComponent } from './messages/messages.component';
import {ModalModule} from "ngx-bootstrap/modal";
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { MessagesWithComponent } from './messages-with/messages-with.component';
import { CreatePostComponent } from './create-post/create-post.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { FeedPostComponent } from './feed-post/feed-post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";
import { FriendPanelComponent } from './friend-panel/friend-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FeedComponent,
    PostDetailsComponent,
    RegisterComponent,
    LoginComponent,
    FriendsComponent,
    ProfileComponent,
    MessagesComponent,
    DeleteModalComponent,
    CommentModalComponent,
    EditProfileComponent,
    SearchResultsComponent,
    MessagesWithComponent,
    CreatePostComponent,
    FeedPostComponent,
    FriendPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModalModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
