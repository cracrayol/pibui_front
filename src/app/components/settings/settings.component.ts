import { Component, AfterViewChecked, ChangeDetectorRef, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'pbi-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements AfterViewChecked, OnInit {

  deletionForm: UntypedFormGroup;
  passwordForm: UntypedFormGroup;

  constructor(private ref: ChangeDetectorRef, private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<SettingsComponent>,
    public userService: UserService, public auth: AuthService, private snack: MatSnackBar) { }

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
    const user = this.auth.getUser();

    if (user !== null && val.currentPassword && val.newPassword && val.newPasswordCheck && val.newPassword === val.newPasswordCheck) {
      this.userService.changePassword(user, val.currentPassword, val.newPassword).subscribe(() => {
        this.snack.open($localize`Password updated`, null, {
          duration: 5000
        });
      }, (error) => {
        // TODO Better error handling
        this.snack.open($localize`Error during changing password !!`, null, {
          duration: 5000
        });
      })
    }
  }

  deleteAccount() {
    const user = this.auth.getUser();
    if(user !== null) {
      this.userService.delete(user).subscribe(() => {
        this.auth.logout();
        this.dialogRef.close();
        this.snack.open($localize`Account deleted !!`, null, {
          duration: 5000
        });
      }, (error) => {
        // TODO Better error handling
        this.snack.open($localize`Error during deletion !!`, null, {
          duration: 5000
        });
      })
    }
  }

  ngAfterViewChecked() {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

}
