import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tag } from 'src/app/model/tag';
import { TagService } from 'src/app/services/tag.service';

@Component({
    selector: 'pbi-tag-dialog',
    templateUrl: './tag-dialog.component.html',
    imports: [MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule]
})
export class TagDialogComponent {

  tagForm: FormGroup;
  tag = inject<Tag>(MAT_DIALOG_DATA);
  tagService = inject(TagService);
  snack = inject(MatSnackBar);
  dialogRef = inject(MatDialogRef<TagDialogComponent>);
  fb = inject(FormBuilder);

  constructor() {
    this.tagForm = this.fb.group({
      name: ['', Validators.required]
    });

    if (this.tag != null) {
      this.tagForm.setValue({
        name: this.tag.name,
      });
    } else {
      this.tag = new Tag();
    }
  }

  save() {
    this.tag.name = this.tagForm.value.name;

    // TODO error management
    if (this.tag.id != null) {
      this.tagService.put(this.tag).subscribe(() => {
        this.dialogRef.close(true);
        this.snack.open($localize`Tag successfully updated.`, '', {
          duration: 5000
        });
      });
    } else {
      this.tagService.post(this.tag).subscribe(() => {
        this.dialogRef.close(true);
        this.snack.open($localize`Tag successfully created.`, '', {
          duration: 5000
        });
      });
    }
  }

}
