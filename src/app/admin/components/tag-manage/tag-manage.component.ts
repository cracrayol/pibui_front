import { AfterViewInit, Component, ElementRef, inject, viewChild, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { asyncScheduler, debounceTime, fromEvent, map, mergeAll, scheduled, startWith, switchMap } from 'rxjs';
import { Tag } from 'src/app/model/tag';
import { Page } from 'src/app/model/page';
import { TagService } from 'src/app/services/tag.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { TagDialogComponent } from '../tag-dialog/tag-dialog.component';

@Component({
    selector: 'pbi-tag-manage',
    templateUrl: './tag-manage.component.html',
    imports: [MatFormFieldModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatTooltipModule, MatButtonModule, MatInputModule]
})
export class TagManageComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'edit'];
  data: Tag[];
  resultsLength = 0;

  tagService = inject(TagService);
  dialog = inject(MatDialog);
  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);
  table = viewChild(MatTable);
  searchField = viewChild<ElementRef<HTMLInputElement>>('searchValue');

  ngAfterViewInit() {
    fromEvent(this.searchField().nativeElement, 'keyup').pipe(debounceTime(500)).subscribe((data: any) => {
      this.refreshList();
    });

    scheduled([this.sort().sortChange, this.paginator().page], asyncScheduler)
      .pipe(
        mergeAll(),
        startWith({}),
        switchMap(() => {
          return this.tagService.get(this.searchField().nativeElement.value, this.paginator().pageIndex * this.paginator().pageSize, this.paginator().pageSize, this.sort().active, this.sort().direction.toUpperCase());
        }),
        map(data => {
          if (data === null) {
            return new Page<Tag>()
          }
          this.resultsLength = 1000;
          return data;
        }),
      )
      .subscribe(data => {
        this.data = data.data
        this.resultsLength = data.total;
      });
  }

  /**
   * Open the "Edit movie" dialog for the current movie
   */
  addTag() {
    const dialogRef = this.dialog.open(TagDialogComponent, {
      width: '800px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshList();
      }
    });
  }

  /**
   * Open the "Edit movie" dialog for the current movie
   */
  editTag(tag: Tag) {
    const dialogRef = this.dialog.open(TagDialogComponent, {
      width: '800px',
      data: tag
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshList();
      }
    });
  }

  deleteTag(tag: Tag) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: $localize`Are you sure you want to delete this tag?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tagService.delete(tag).subscribe(() => {
          this.refreshList();
        });
      }
    });
  }

  private refreshList() {
    this.tagService.get(this.searchField().nativeElement.value, this.paginator().pageIndex * this.paginator().pageSize, this.paginator().pageSize, this.sort().active, this.sort().direction.toUpperCase())
      .subscribe(data => {
        this.data = data.data;
        this.resultsLength = data.total;
      });
  }
}
