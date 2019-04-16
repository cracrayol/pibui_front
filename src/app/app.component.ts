import { Component } from '@angular/core';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'pbi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currentDate = new Date();

  constructor(public dialog: MatDialog) { }

  openLegalNotice() {
    this.dialog.open(LegalNoticeComponent, {
      width: '800px',
    });
  }
}
