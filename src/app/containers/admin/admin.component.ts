import { Component, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'pbi-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent {

  isMobile = window.innerWidth < 1024;

  headerButtons = [{
  }];

  constructor(public auth: AuthService, public dialog: MatDialog) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 1024;
  }

}
