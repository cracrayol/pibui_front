import { Component, AfterViewChecked, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'pbi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements AfterViewChecked, OnInit {

  deletionForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private ref: ChangeDetectorRef, private fb: FormBuilder, public dialogRef: MatDialogRef<SettingsComponent>) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordCheck: ['', Validators.required]
    });

    this.deletionForm = this.fb.group({
      validDeletion: ['', Validators.required]
    });
  }

  changePassword() {
    const val = this.passwordForm.value;

    if (val.currentPassword && val.newPassword && val.newPasswordCheck && val.newPassword === val.newPasswordCheck) {
      /*this.auth.register(val.email, val.password)
        .subscribe(
        () => {
          this.dialogRef.close();
          this.snack.open('Password changed !!', '', {
            duration: 5000
          });
        }
        );*/
    }
  }

  deleteAccount() {

  }

  ngAfterViewChecked() {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

}
