import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticeComponent } from './pages/notice/notice.component';
import { EventsComponent } from './pages/events/events.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminProfileComponent } from './pages/admin/admin-profile/admin-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/notice', pathMatch: 'full' },
  { path: 'notice', component: NoticeComponent },
  { path: 'events', component: EventsComponent },
  {
    path: 'create-event',
    loadComponent: () =>
      import('./pages/admin/create-event/create-event.component').then(
        (m) => m.CreateEventComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: 'form-builder',
    component: FormBuilderComponent,
    canActivate: [AdminGuard],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin/:id',
    component: AdminProfileComponent,
    canActivate: [AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
