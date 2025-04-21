import { Component } from '@angular/core';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'pbi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {

  currentDate = new Date();

  constructor(public dialog: MatDialog) { }
}
