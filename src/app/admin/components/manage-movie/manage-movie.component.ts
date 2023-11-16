import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { asyncScheduler, map, mergeAll, scheduled, startWith, switchMap } from 'rxjs';
import { Movie } from 'src/app/model/movie';
import { MovieService } from 'src/app/services/movie.service';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Page } from 'src/app/model/page';

@Component({
  selector: 'pbi-manage-movie',
  templateUrl: './manage-movie.component.html'
})
export class ManageMovieComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'title', 'subtitle', 'author', 'edit'];
  data: Movie[];

  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private movieService: MovieService, public dialog: MatDialog) {
  }

  ngAfterViewInit() {
    scheduled([this.sort.sortChange, this.paginator.page], asyncScheduler)
      .pipe(
        mergeAll(),
        startWith({}),
        switchMap(() => {
          return this.movieService.getList(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.sort.active, this.sort.direction.toUpperCase(), true);
        }),
        map(data => {
          if (data === null) {
            return new Page<Movie>();
          }
          this.resultsLength = 1000;
          return data;
        }),
      )
      .subscribe(data => {
        this.data = data.data;
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
  editMovie(movie: Movie) {
    const dialogRef = this.dialog.open(MovieDialogComponent, {
      width: '800px',
      data: movie
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
      } else {
      }
    });
  }

  /**
   * Open the "Edit movie" dialog for the current movie
   */
  addMovie() {
    const dialogRef = this.dialog.open(MovieDialogComponent, {
      width: '800px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
      } else {
      }
    });
  }

  deleteMovie(movie: Movie) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: $localize`Are you sure you want to delete this movie ?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.movieService.delete(movie).subscribe(() => {
          this.movieService.getList(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.sort.active, this.sort.direction.toUpperCase())
          .subscribe(data => {
            this.data = data.data;
            this.resultsLength = data.total;
          });
        });
      }
    });
  }
}
