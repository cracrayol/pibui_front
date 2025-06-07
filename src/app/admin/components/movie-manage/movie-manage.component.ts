import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { asyncScheduler, debounceTime, fromEvent, mergeAll, scheduled, startWith } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Movie } from 'src/app/model/movie';
import { MovieService } from 'src/app/services/movie.service';
import { Tag } from 'src/app/model/tag';
import { Filter } from 'src/app/model/filter';
import { MovieDialogComponent } from 'src/app/components/movie-dialog/movie-dialog.component';

@Component({
    selector: 'pbi-movie-manage',
    templateUrl: './movie-manage.component.html',
    imports: [MatFormFieldModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatTooltipModule,
        MatButtonModule, MatInputModule, MatSlideToggleModule]
})
export class MovieManageComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'title', 'subtitle', 'author', 'youtubeId', 'tags', 'edit'];
  data: Movie[];
  resultsLength = 0;
  notValidated = false;

  movieService = inject(MovieService);
  dialog = inject(MatDialog);
  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);
  table = viewChild(MatTable);
  searchField = viewChild<ElementRef<HTMLInputElement>>('searchValue');

  ngAfterViewInit() {
    fromEvent(this.searchField().nativeElement, 'keyup').pipe(debounceTime(500)).subscribe(() => {
      this.refreshList();
    });
    scheduled([this.sort().sortChange, this.paginator().page], asyncScheduler).pipe(
      mergeAll(),
      startWith({})
    ).subscribe(() => {
      this.refreshList();
    });
  }

  /**
   * Open the "Edit movie" dialog for the current movie
   */
  async editMovie(movie: Movie) {
    this.movieService.get(movie.id).subscribe(result => {
      const dialogRef = this.dialog.open(MovieDialogComponent, {
        width: '800px',
        data: result 
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.refreshList();
        } 
      });
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

  formatTags(tags: Tag[]) {
    return tags.map(tag => { return tag.name; }).join(", ");
  }

  showUnvalidated() {
    this.notValidated = !this.notValidated;
    this.paginator().firstPage();
    this.refreshList();
  }

  private refreshList() {
    const filter: Filter = {
      filter: this.searchField().nativeElement.value,
      start: this.paginator().pageIndex * this.paginator().pageSize,
      take: this.paginator().pageSize,
      sort: this.sort().active,
      order: this.sort().direction === 'desc' ? 'DESC' : 'ASC',
      notValidated: this.notValidated
    };

    this.movieService.getList(filter)
    .subscribe(data => {
      this.data = data.data;
      this.resultsLength = data.total;
    });
  }
}
