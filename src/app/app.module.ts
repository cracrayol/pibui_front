import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatSidenavModule, MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatInputModule, MatTooltipModule,
  MatCardModule, MatListModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule, MatSnackBarModule, MatSelectModule
} from '@angular/material';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MovieService } from './services/movie.service';
import { SearchComponent } from './components/search/search.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TagsComponent } from './components/tags/tags.component';
import { IndexComponent } from './containers/index/index.component';
import { SpinnerService } from './services/spinner.service';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { PlaylistService } from './services/playlist.service';
import { CredentialInterceptor } from './interceptors/credential.interceptor';
import { EditPlaylistComponent } from './components/editplaylist/editplaylist.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    TagsComponent,
    IndexComponent,
    SpinnerComponent,
    NavBarComponent,
    LoginComponent,
    EditPlaylistComponent
  ],
  imports: [
    AppRoutingModule, BrowserAnimationsModule, BrowserModule, HttpClientModule, ReactiveFormsModule,
    MatSidenavModule, MatButtonModule, MatIconModule, MatInputModule, MatMenuModule, MatToolbarModule, MatTooltipModule, MatButtonModule,
    MatCardModule, MatListModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule, MatSnackBarModule, MatSelectModule,
    FlexLayoutModule, MatMenuModule
  ],
  providers: [MovieService, SpinnerService, AuthService, PlaylistService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CredentialInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent, EditPlaylistComponent]
})
export class AppModule { }
