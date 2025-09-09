import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoticeComponent } from './pages/notice/notice.component';
import { HttpClientModule } from '@angular/common/http';
import { NoticeCardComponent } from './component/notice-card/notice-card.component';
import { EventsComponent } from './pages/events/events.component';
import { CreateEventComponent } from './pages/admin/create-event/create-event.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { LoginComponent } from './pages/login/login.component';
import { CreateNoticeComponent } from './pages/create-notice/create-notice.component';
import { CommentSectionComponent } from './components/comment-section/comment-section.component';

@NgModule({
  declarations: [
    AppComponent,
    NoticeComponent,
    NoticeCardComponent,
    EventsComponent,
    NavbarComponent,
    LoginComponent,
    CreateNoticeComponent,
    CommentSectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormBuilderComponent,
    CreateEventComponent,
    FilterSidebarComponent,
    MatPaginatorModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
