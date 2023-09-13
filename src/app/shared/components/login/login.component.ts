import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'pbi-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements AfterViewChecked {

  loginForm: UntypedFormGroup;
  registerForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private auth: AuthService, private router: Router, private ref: ChangeDetectorRef,
    private snack: MatSnackBar, public dialogRef: MatDialogRef<LoginComponent>) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordCheck: ['', Validators.required]
    });
  }

  login() {
    const val = this.loginForm.value;

    if (val.email && val.password) {
      this.auth.login(val.email, val.password)
        .subscribe(
        () => {
          this.dialogRef.close();
          this.snack.open($localize`Logged in !!`, '', {
            duration: 5000
          });
        }
        );
    }
  }

  register() {
    const val = this.registerForm.value;

    if (val.email && val.password && val.passwordCheck && val.password === val.passwordCheck) {
      this.auth.register(val.email, val.password)
        .subscribe(
        () => {
          this.dialogRef.close();
          this.snack.open($localize`Registered !!`, '', {
            duration: 5000
          });
        }
        );
    }
  }

  ngAfterViewChecked() {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

}
