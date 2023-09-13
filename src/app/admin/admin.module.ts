import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { MovieDialogComponent } from './components/movie-dialog/movie-dialog.component';
import { AuthorDialogComponent } from './components/author-dialog/author-dialog.component';
import { ManageMovieComponent } from './components/manage-movie/manage-movie.component';
import { ManageAuthorComponent } from './components/manage-author/manage-author.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdminComponent,
    MovieDialogComponent,
    AuthorDialogComponent,
    ManageMovieComponent,
    ManageAuthorComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTableModule,
    MatTabsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    SharedModule
  ]
})
export class AdminModule { }
