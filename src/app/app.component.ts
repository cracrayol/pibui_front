import { Component, inject } from '@angular/core';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'pbi-root',
    templateUrl: './app.component.html',
    imports: [RouterOutlet]
})
export class AppComponent {
  dialog = inject(MatDialog);


  currentDate = new Date();
}
