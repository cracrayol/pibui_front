import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatSidenavModule, MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatInputModule, MatTooltipModule,
  MatCardModule, MatListModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule, MatSnackBarModule, MatSelectModule,
  MatCheckboxModule
} from '@angular/material';
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
    LegalNoticeComponent
  ],
  imports: [
    AppRoutingModule, BrowserAnimationsModule, BrowserModule, HttpClientModule, ReactiveFormsModule,
    MatSidenavModule, MatButtonModule, MatIconModule, MatInputModule, MatMenuModule, MatToolbarModule, MatTooltipModule, MatButtonModule,
    MatCardModule, MatListModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule, MatSnackBarModule, MatSelectModule,
    FlexLayoutModule, MatMenuModule, MatCheckboxModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CredentialInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent, EditPlaylistComponent, ConfirmDialogComponent, SettingsComponent, LegalNoticeComponent]
})
export class AppModule { }
