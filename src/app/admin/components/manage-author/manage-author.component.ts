import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { asyncScheduler, map, mergeAll, scheduled, startWith, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Author } from 'src/app/model/author';
import { AuthorService } from 'src/app/services/author.service';
import { AuthorDialogComponent } from '../author-dialog/author-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Page } from 'src/app/model/page';

@Component({
  selector: 'pbi-manage-author',
  templateUrl: './manage-author.component.html'
})
export class ManageAuthorComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'subname', 'edit'];
  data: Author[];

  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private authorService: AuthorService, public dialog: MatDialog) {
  }

  ngAfterViewInit() {
    scheduled([this.sort.sortChange, this.paginator.page], asyncScheduler)
      .pipe(
        mergeAll(),
        startWith({}),
        switchMap(() => {
          return this.authorService.getList(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.sort.active, this.sort.direction.toUpperCase());
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

  applyFilter(event: Event) {
    /*const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }*/
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
    this.authorService.getList(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.sort.active, this.sort.direction.toUpperCase())
      .subscribe(data => {
        this.data = data.data;
        this.resultsLength = data.total;
      });
  }
}
