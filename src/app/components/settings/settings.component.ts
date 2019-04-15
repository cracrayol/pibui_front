import { Component, AfterViewChecked, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'pbi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements AfterViewChecked, OnInit {

  deletionForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private ref: ChangeDetectorRef, private fb: FormBuilder, public dialogRef: MatDialogRef<SettingsComponent>,
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

    if (user!== null && val.currentPassword && val.newPassword && val.newPasswordCheck && val.newPassword === val.newPasswordCheck) {
      // TODO changing password
    }
  }

  deleteAccount() {
    const user = this.auth.getUser();
    if(user !== null) {
      this.userService.delete(user).subscribe(() => {
        this.auth.logout();
        this.dialogRef.close();
        this.snack.open('Account deleted !!', null, {
          duration: 5000
        });
      }, (error) => {
        // TODO Better error handling
        this.snack.open('Error during deletion !!', null, {
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
