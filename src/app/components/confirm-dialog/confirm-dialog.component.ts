import { Component, AfterViewChecked, ChangeDetectorRef, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'pbi-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmDialogComponent implements AfterViewChecked {

  public dialogText: String;

  constructor(private ref: ChangeDetectorRef, public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.dialogText = data;
  }

  ngAfterViewChecked() {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

}
