import { Component, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'pbi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
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
    this.snack.open('Logged out !!', null, {
      duration: 5000
    });
  }

}
