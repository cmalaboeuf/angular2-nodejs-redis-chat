import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import {ChatComponent} from './chat/chat.component';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
  { path: '**', component: AppComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes),

  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }