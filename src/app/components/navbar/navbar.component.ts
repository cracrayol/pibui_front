import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'pbi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, RouterModule]
})
export class NavBarComponent {

  @Input() buttons: any[];

  constructor(public dialog: MatDialog, public auth: AuthService, private snack: MatSnackBar) { }

  openSettings() {
    this.dialog.open(SettingsComponent, {
      width: '800px',
    });
  }

  login() {
    this.dialog.open(LoginComponent);
  }

  logout() {
    this.auth.logout();
    this.snack.open($localize`Logged out !!`, null, {
      duration: 5000
    });
  }

}
