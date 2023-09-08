import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pbi-legal-notice',
  templateUrl: './legal-notice.component.html'
})
export class LegalNoticeComponent {

  constructor(public dialogRef: MatDialogRef<LegalNoticeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

}
