import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsComponent } from '../settings/settings.component';
import { LoginComponent } from '../login/login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MovieDialogComponent } from 'src/app/components/movie-dialog/movie-dialog.component';

@Component({
    selector: 'pbi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, RouterModule]
})
export class NavBarComponent {
  private dialog = inject(MatDialog);
  authService = inject(AuthService);
  private snack = inject(MatSnackBar);

  buttons = input<any>();

  openSettings() {
    this.dialog.open(SettingsComponent, {
      width: '800px',
    });
  }

  login() {
    this.dialog.open(LoginComponent);
  }

  addMovie() {
    this.dialog.open(MovieDialogComponent, {
      width: '800px',
      data: null
    });
  }

  logout() {
    this.authService.logout();
    this.snack.open($localize`Logged out !!`, null, {
      duration: 5000
    });
  }

}
