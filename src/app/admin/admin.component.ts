import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ManageAuthorComponent } from './components/manage-author/manage-author.component';
import { ManageMovieComponent } from './components/manage-movie/manage-movie.component';
import { NavBarComponent } from '../components/navbar/navbar.component';

@Component({
    selector: 'pbi-admin',
    templateUrl: './admin.component.html',
    imports: [MatSidenavModule, MatTabsModule, ManageAuthorComponent, ManageMovieComponent, NavBarComponent]
})
export class AdminComponent {
  auth = inject(AuthService);
  dialog = inject(MatDialog);


  isMobile = window.innerWidth < 1024;

  headerButtons = [{
  }];

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 1024;
  }

}
