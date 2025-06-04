import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { NavBarComponent } from '../components/navbar/navbar.component';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

interface ILink {
  path: string;
  label: string;
}

@Component({
  selector: 'pbi-admin',
  templateUrl: './admin.component.html',
  imports: [MatSidenavModule, MatTabsModule, NavBarComponent, RouterOutlet, RouterLink]
})
export class AdminComponent implements OnInit {

  links: ILink[] = [
    { path: 'movie-manage', label: 'Clips' },
    { path: 'author-manage', label: 'Artistes' },
    { path: 'tag-manage', label: 'Tags' },
  ];

  isMobile = window.innerWidth < 1024;
  activePath = this.links[0].path;
  headerButtons = [{}];

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activePath = this.route.snapshot.firstChild.url[0].path;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 1024;
  }

}
