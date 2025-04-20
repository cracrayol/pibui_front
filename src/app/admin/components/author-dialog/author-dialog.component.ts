import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Author } from 'src/app/model/author';
import { AuthService } from 'src/app/services/auth.service';
import { AuthorService } from 'src/app/services/author.service';

@Component({
  selector: 'pbi-author-dialog',
  templateUrl: './author-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule]
})
export class AuthorDialogComponent {

  authorForm: UntypedFormGroup;
  author: Author;

  constructor(private fb: UntypedFormBuilder, private auth: AuthService, private router: Router, private ref: ChangeDetectorRef,
    private snack: MatSnackBar, public dialogRef: MatDialogRef<AuthorDialogComponent>, private authors: AuthorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.authorForm = this.fb.group({
      name: ['', Validators.required],
      subname: ''
    });

    this.author = data;

    if (this.author != null) {
      this.authorForm.setValue({
        name: this.author.name,
        subname: this.author.subname
      });
    } else {
      this.author = new Author();
    }
  }

  save() {
    this.author.name = this.authorForm.value.name;
    this.author.subname = this.authorForm.value.subname;

    // TODO error management
    if (this.author.id != null) {
      this.authors.put(this.author).subscribe(() => {
        this.dialogRef.close(true);
        this.snack.open($localize`Updated !!`, '', {
          duration: 5000
        });
      });
    } else {
      this.authors.post(this.author).subscribe(() => {
        this.dialogRef.close(true);
        this.snack.open($localize`Created !!`, '', {
          duration: 5000
        });
      });
    }
  }

}
