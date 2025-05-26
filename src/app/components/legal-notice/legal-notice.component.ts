import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'pbi-legal-notice',
    templateUrl: './legal-notice.component.html',
    imports: [MatDialogModule, MatButtonModule]
})
export class LegalNoticeComponent {
}
