import { Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { loggedInGuard } from './guards/authenticated.guard';

export const routes: Routes = [
    { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes), canActivate: [loggedInGuard] },
    { path: 'play/:id', component: MainContentComponent },
    { path: '**', component: MainContentComponent }
];
