import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'pbi-legal-notice',
  templateUrl: './legal-notice.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class LegalNoticeComponent {

  constructor(public dialogRef: MatDialogRef<LegalNoticeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

}
