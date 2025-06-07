import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { asyncScheduler, debounceTime, fromEvent, mergeAll, scheduled, startWith } from 'rxjs';
import { Author } from 'src/app/model/author';
import { AuthorService } from 'src/app/services/author.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Filter } from 'src/app/model/filter';
import { AuthorDialogComponent } from '../author-dialog/author-dialog.component';

@Component({
    selector: 'pbi-author-manage',
    templateUrl: './author-manage.component.html',
    imports: [MatFormFieldModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatTooltipModule, MatButtonModule, MatInputModule]
})
export class AuthorManageComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'subname', 'edit'];
  data: Author[];
  resultsLength = 0;

  authorService = inject(AuthorService);
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
        startWith({})
    ).subscribe(() => {
      this.refreshList();
    });
  }

  /**
   * Open the "Edit movie" dialog for the current movie
   */
  addAuthor() {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
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
  editAuthor(author: Author) {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      width: '800px',
      data: author
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshList();
      }
    });
  }

  deleteAuthor(author: Author) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: $localize`Are you sure you want to delete this author and all of his movies ?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authorService.delete(author).subscribe(() => {
          this.refreshList();
        });
      }
    });
  }

  private refreshList() {
      const filter: Filter = {
        filter: this.searchField().nativeElement.value,
        start: this.paginator().pageIndex * this.paginator().pageSize,
        take: this.paginator().pageSize,
        sort: this.sort().active,
        order: this.sort().direction === 'desc' ? 'DESC' : 'ASC'
      };
  
    this.authorService.get(filter)
      .subscribe(data => {
        this.data = data.data;
        this.resultsLength = data.total;
      });
  }
}
