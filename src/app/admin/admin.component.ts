import { Component, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ManageAuthorComponent } from './components/manage-author/manage-author.component';
import { ManageMovieComponent } from './components/manage-movie/manage-movie.component';
import { NavBarComponent } from '../shared/components/navbar/navbar.component';

@Component({
  selector: 'pbi-admin',
  templateUrl: './admin.component.html',
  standalone: true,
  imports: [MatSidenavModule, MatTabsModule, ManageAuthorComponent, ManageMovieComponent, NavBarComponent]
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
