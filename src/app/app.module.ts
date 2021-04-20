import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SearchComponent } from './components/search/search.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TagsComponent } from './components/tags/tags.component';
import { MainPageComponent } from './containers/mainPage/mainPage.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CredentialInterceptor } from './interceptors/credential.interceptor';
import { EditPlaylistComponent } from './components/editplaylist/editplaylist.component';
import { ConfirmDialogComponent } from './components/confirmDialog/confirmDialog.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MovieDialogComponent } from './components/moviedialog/moviedialog.component';
import { AuthorDialogComponent } from './components/authordialog/authordialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    TagsComponent,
    MainPageComponent,
    NavBarComponent,
    LoginComponent,
    EditPlaylistComponent,
    ConfirmDialogComponent,
    SettingsComponent,
    LegalNoticeComponent,
    MovieDialogComponent,
    AuthorDialogComponent
  ],
  imports: [
    AppRoutingModule, BrowserAnimationsModule, BrowserModule, HttpClientModule, ReactiveFormsModule,
    MatSidenavModule, MatButtonModule, MatIconModule, MatInputModule, MatMenuModule, MatToolbarModule, MatTooltipModule, MatButtonModule,
    MatCardModule, MatListModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule, MatSnackBarModule, MatSelectModule,
    MatAutocompleteModule, FlexLayoutModule, MatMenuModule, MatCheckboxModule, YouTubePlayerModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CredentialInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent, EditPlaylistComponent, ConfirmDialogComponent, SettingsComponent, LegalNoticeComponent]
})
export class AppModule { }
