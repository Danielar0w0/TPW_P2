import {NgModule} from '@angular/core';
import {Route, RouterModule} from "@angular/router";
import {FeedComponent} from "./feed/feed.component";
import {PostDetailsComponent} from "./post-details/post-details.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {FriendsComponent} from "./friends/friends.component";
import {ProfileComponent} from "./profile/profile.component";
import {MessagesComponent} from "./messages/messages.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {MessagesWithComponent} from "./messages-with/messages-with.component";
import {SearchUsersComponent} from "./search-users/search-users.component";
import {SearchPostsComponent} from "./search-posts/search-posts.component";

// Change type of routes variable to 'Route'
const routes: Route[] = [
    {path: '', component: FeedComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'feed', component: FeedComponent},
    {path: 'post_details/:id', component: PostDetailsComponent},
    {path: 'friends', component: FriendsComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'profile/edit', component: EditProfileComponent},
    {path: 'profile/:email', component: ProfileComponent},
    {path: 'messages', component: MessagesComponent},
    {path: 'messages/:email', component: MessagesWithComponent},
    {path: 'search/3/:query', component: SearchPostsComponent},
    {path: 'search/:query_type/:query', component: SearchUsersComponent},
    {path: '**', component: LoginComponent}
];

@NgModule({
    declarations: [],
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule {
}
