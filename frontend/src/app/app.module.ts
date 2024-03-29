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
import { ProfileRootComponent } from './profile/profile-root/profile-root.component';
import { MessagesComponent } from './messages/messages.component';
import {ModalModule} from "ngx-bootstrap/modal";
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MessagesWithComponent } from './messages-with/messages-with.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FeedPostComponent } from './feed-post/feed-post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FriendPanelComponent } from './friend-panel/friend-panel.component';
import { ProfilePostComponent } from './profile/profile-post/profile-post.component';
import { CreatePostModalComponent } from './create-post-modal/create-post-modal.component';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { CommentPanelComponent } from './comment-panel/comment-panel.component';
import { MessagesUserPanelComponent } from './messages-user-panel/messages-user-panel.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { SearchPostsComponent } from './search-posts/search-posts.component';
import { ProfilePostsComponent } from './profile/profile-posts/profile-posts.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FeedComponent,
    PostDetailsComponent,
    RegisterComponent,
    LoginComponent,
    FriendsComponent,
    ProfileRootComponent,
    MessagesComponent,
    DeleteModalComponent,
    CommentModalComponent,
    EditProfileComponent,
    MessagesWithComponent,
    FeedPostComponent,
    SearchUsersComponent,
    SearchPostsComponent,
    FriendPanelComponent,
    ProfilePostComponent,
    CreatePostModalComponent,
    InfoModalComponent,
    CommentPanelComponent,
    MessagesUserPanelComponent,
    ProfilePostsComponent,
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
