import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatRadioModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatTabsModule,
  MatInputModule,
  MatDialogModule,
  MatCheckboxModule,
  MatDividerModule,
  MatSelectModule,
  MatGridListModule,
  MatButtonToggleModule,
  MatSortModule,
  MatSnackBarModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatTableModule, MatProgressBarModule,

} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {NavComponent} from "./nav/nav.component";
import {MenuComponent} from "./menu/menu.component";
import {LoginComponent} from "./login/login.component";
import {LoadingComponent} from "./loading/loading.component";
import { CookieModule } from 'ngx-cookie';
import {RegisterComponent} from "./register/register.component";
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {UserService} from "./User/user.service";
import {BannerComponent} from "./banner/banner.component";
import {IndexComponent} from "./index/index.component";
import {ListComponent} from "./list/list.component";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    MenuComponent,
    LoginComponent,
    LoadingComponent,
    RegisterComponent,
    BannerComponent,
    IndexComponent,
    ListComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSortModule,
    MatSelectModule,
    MatGridListModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    BrowserAnimationsModule,
    MatDividerModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatListModule,
    CookieModule.forRoot(),
    MatButtonToggleModule,
    MatProgressBarModule,
  ],
  providers: [
    UserService,
  ],
  entryComponents: [
    LoginComponent,
    LoadingComponent,
    RegisterComponent,
    ListComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
