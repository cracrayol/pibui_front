import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './containers/admin/admin.component';
import { MainPageComponent } from './containers/mainPage/mainPage.component';

const routes: Routes = [
  {path: 'admin', component: AdminComponent},
  {path: 'play/:id', component: MainPageComponent},
  {path: '**', component: MainPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
