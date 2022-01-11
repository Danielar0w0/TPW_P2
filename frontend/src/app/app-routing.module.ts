import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from "@angular/router";

// Change type of routes variable to 'Route'
const routes: any = [
  //{path: authors}
];

@NgModule({
  declarations: [],
  exports: [
    RouterModule
  ],
  imports: [
    CommonModule
  ]
})
export class AppRoutingModule { }
