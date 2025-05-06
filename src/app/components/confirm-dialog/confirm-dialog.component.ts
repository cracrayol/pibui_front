import { Component, AfterViewChecked, ChangeDetectorRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'pbi-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmDialogComponent implements AfterViewChecked {
  private ref = inject(ChangeDetectorRef);
  dialogRef = inject<MatDialogRef<ConfirmDialogComponent>>(MatDialogRef);
  dialogText = inject<string>(MAT_DIALOG_DATA);

  ngAfterViewChecked() {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

}
