import { Component, AfterViewChecked, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pbi-confirm-dialog',
  templateUrl: './confirmDialog.component.html',
  styleUrls: ['./confirmDialog.component.scss']
})
export class ConfirmDialogComponent implements AfterViewChecked {

  public dialogText: String;

  constructor(private ref: ChangeDetectorRef, public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.dialogText = data;
  }

  valid() {
    this.dialogRef.close();
  }

  ngAfterViewChecked() {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

}
