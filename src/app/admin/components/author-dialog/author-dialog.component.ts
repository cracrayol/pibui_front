import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Author } from 'src/app/model/author';
import { AuthorService } from 'src/app/services/author.service';

@Component({
    selector: 'pbi-author-dialog',
    templateUrl: './author-dialog.component.html',
    imports: [MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule]
})
export class AuthorDialogComponent {

  authorForm: FormGroup;
  author = inject<Author>(MAT_DIALOG_DATA);
  authorService = inject(AuthorService);
  snack = inject(MatSnackBar);
  dialogRef = inject(MatDialogRef<AuthorDialogComponent>);
  fb = inject(FormBuilder);

  constructor() {
    this.authorForm = this.fb.group({
      name: ['', Validators.required],
      subname: ''
    });

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
      this.authorService.put(this.author).subscribe(() => {
        this.dialogRef.close(true);
        this.snack.open($localize`Author successfully updated.`, '', {
          duration: 5000
        });
      });
    } else {
      this.authorService.post(this.author).subscribe(() => {
        this.dialogRef.close(true);
        this.snack.open($localize`Author successfully created.`, '', {
          duration: 5000
        });
      });
    }
  }

}
