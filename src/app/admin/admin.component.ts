import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthorManageComponent } from './components/author-manage/author-manage.component';
import { TagManageComponent } from './components/tag-manage/tag-manage.component';
import { NavBarComponent } from '../components/navbar/navbar.component';
import { MovieManageComponent } from './components/movie-manage/movie-manage.component';

@Component({
    selector: 'pbi-admin',
    templateUrl: './admin.component.html',
    imports: [MatSidenavModule, MatTabsModule, AuthorManageComponent, MovieManageComponent, NavBarComponent, TagManageComponent]
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
