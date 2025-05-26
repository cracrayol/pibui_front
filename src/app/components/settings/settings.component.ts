import { Component, AfterViewChecked, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'pbi-settings',
    templateUrl: './settings.component.html',
    imports: [MatDialogModule, MatTabsModule, MatInputModule, MatCheckboxModule, ReactiveFormsModule, MatButtonModule]
})
export class SettingsComponent implements AfterViewChecked, OnInit {
  private ref = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<SettingsComponent>>(MatDialogRef);
  private userService = inject(UserService);
  private auth = inject(AuthService);
  private snack = inject(MatSnackBar);

  deletionForm: FormGroup;
  passwordForm: FormGroup;
  deleteChecked: boolean;

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
      user.oldPassword = val.currentPassword;
      user.password = val.newPassword;
      this.userService.put(user).subscribe({
        next:() => {
          this.snack.open($localize`Password updated`, null, {
            duration: 5000
          });
        },
        error: () => {
          // TODO Better error handling
          this.snack.open($localize`Error during changing password !!`, null, {
            duration: 5000
          });
        }
      });
    }
  }

  deleteAccount() {
    const user = this.auth.getUser();
    if(user !== null) {
      this.userService.delete(user).subscribe({
        next:() => {
          this.auth.logout();
          this.dialogRef.close();
          this.snack.open($localize`Account deleted !!`, null, {
            duration: 5000
          });
        },
        error: () => {
          // TODO Better error handling
          this.snack.open($localize`Error during deletion !!`, null, {
            duration: 5000
          });
        }
      });
    }
  }

  ngAfterViewChecked() {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

}
