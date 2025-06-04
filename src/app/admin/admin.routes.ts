import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";

export const adminRoutes: Routes = [{
    path: '',
    component: AdminComponent,
    children: [
        {
            path: 'movie-manage',
            loadComponent: () =>
                import('./components/movie-manage/movie-manage.component').then((m) => m.MovieManageComponent),
        },
        {
            path: 'author-manage',
            loadComponent: () =>
                import('./components/author-manage/author-manage.component').then((m) => m.AuthorManageComponent),
        },
        {
            path: 'tag-manage',
            loadComponent: () =>
                import('./components/tag-manage/tag-manage.component').then((m) => m.TagManageComponent),
        }]
}];