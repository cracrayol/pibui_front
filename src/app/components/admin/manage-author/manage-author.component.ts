import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { map, merge, startWith, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { Author } from 'src/app/model/author';
import { AuthorService } from 'src/app/services/author.service';
import { AuthorDialogComponent } from '../author-dialog/author-dialog.component';

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
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.authorService.getList(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.sort.active, this.sort.direction.toUpperCase());
        }),
        map(data => {
          if (data === null) {
            return [];
          }
          this.resultsLength = 1000;
          return data;
        }),
      )
      .subscribe(data => this.data = data);
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
  editAuthor(author: Author) {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      width: '800px',
      data: author
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
      } else {
      }
    });
  }

  deleteAuthor(author: Author) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: $localize`Are you sure you want to delete this author and all of his movies ?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.authorService.delete(author).subscribe(() => {
          this.authorService.getList(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.sort.active, this.sort.direction.toUpperCase())
          .subscribe(data => {
            this.data = data;
          });
        });
      }
    });
  }
}
