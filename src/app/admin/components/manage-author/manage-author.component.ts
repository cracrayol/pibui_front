import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
import { Author } from 'src/app/model/author';
import { Page } from 'src/app/model/page';
import { AuthorService } from 'src/app/services/author.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { AuthorDialogComponent } from '../author-dialog/author-dialog.component';

@Component({
    selector: 'pbi-manage-author',
    templateUrl: './manage-author.component.html',
    imports: [MatFormFieldModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatTooltipModule, MatButtonModule, MatInputModule]
})
export class ManageAuthorComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'subname', 'edit'];
  data: Author[];

  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild('searchValue', { static: true }) searchField: ElementRef<HTMLInputElement>;

  constructor(private authorService: AuthorService, public dialog: MatDialog) {
  }

  ngAfterViewInit() {
    fromEvent(this.searchField.nativeElement, 'keyup').pipe(debounceTime(500)).subscribe((data: any) => {
      this.refreshList();
    });

    scheduled([this.sort.sortChange, this.paginator.page], asyncScheduler)
      .pipe(
        mergeAll(),
        startWith({}),
        switchMap(() => {
          return this.authorService.get(this.searchField.nativeElement.value, this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.sort.active, this.sort.direction.toUpperCase());
        }),
        map(data => {
          if (data === null) {
            return new Page<Author>()
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
    this.authorService.get(this.searchField.nativeElement.value, this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.sort.active, this.sort.direction.toUpperCase())
      .subscribe(data => {
        this.data = data.data;
        this.resultsLength = data.total;
      });
  }
}
