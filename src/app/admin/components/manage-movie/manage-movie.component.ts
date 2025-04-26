import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { asyncScheduler, map, mergeAll, scheduled, startWith, switchMap } from 'rxjs';
import { Movie } from 'src/app/model/movie';
import { Page } from 'src/app/model/page';
import { MovieService } from 'src/app/services/movie.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';

@Component({
    selector: 'pbi-manage-movie',
    templateUrl: './manage-movie.component.html',
    imports: [MatFormFieldModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatTooltipModule, MatButtonModule, MatInputModule]
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
      if (result) {
        this.refreshList();
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
      if (result) {
        this.refreshList();
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
          this.refreshList();
        });
      }
    });
  }

  private refreshList() {
    this.movieService.getList(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.sort.active, this.sort.direction.toUpperCase())
    .subscribe(data => {
      this.data = data.data;
      this.resultsLength = data.total;
    });
  }
}
