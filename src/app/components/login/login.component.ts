import { Component, AfterViewChecked, ChangeDetectorRef, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'pbi-login',
    templateUrl: './login.component.html',
    imports: [MatDialogModule, MatTabsModule, MatInputModule, ReactiveFormsModule, MatButtonModule]
})
export class LoginComponent implements AfterViewChecked {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private ref = inject(ChangeDetectorRef);
  private snack = inject(MatSnackBar);
  dialogRef = inject<MatDialogRef<LoginComponent>>(MatDialogRef);

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor() {
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
      this.authService.login(val.email, val.password)
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
      this.authService.register(val.email, val.password)
        .subscribe({
          next: () => {
            this.dialogRef.close();
            this.snack.open($localize`Successfully registered.`, '', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          },
          error: (error: HttpErrorResponse) => {
            if(error.error.code == 'ER_DUP_ENTRY') {
              this.snack.open($localize`⚠️ Email already registered.`, '', {
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
            }
          }
        });
    }
  }

  ngAfterViewChecked() {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

}
