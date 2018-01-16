import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'pbi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewChecked {

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private ref: ChangeDetectorRef,
    private snack: MatSnackBar, public dialogRef: MatDialogRef<LoginComponent>, private playlists: PlaylistService) {

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
          this.snack.open('Logged in !!', '', {
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
          this.snack.open('Registered !!', '', {
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
