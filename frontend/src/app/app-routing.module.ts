import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from "@angular/router";
import { FeedComponent} from "./feed/feed.component";
import {StartScreenComponent} from "./start-screen/start-screen.component";
import {PostDetailsComponent} from "./post-details/post-details.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {FriendsComponent} from "./friends/friends.component";
import {ProfileComponent} from "./profile/profile.component";
import {MessagesComponent} from "./messages/messages.component";

// Change type of routes variable to 'Route'
const routes: any = [
  {path: '', component: StartScreenComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'feed', component: FeedComponent},
  {path: 'post_details/:id', component: PostDetailsComponent},
  {path: 'friends', component: FriendsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'profile/:email', component: ProfileComponent},
  {path: 'messages', component: MessagesComponent},
  { path: '**', component: LoginComponent }
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
export class AppRoutingModule { }
