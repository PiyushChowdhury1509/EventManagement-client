import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-event-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  standalone: true,
  styleUrls: ['./filter-sidebar.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
})
export class FilterSidebarComponent {
  @Output() filtersChanged = new EventEmitter<any>();

  filterForm: FormGroup;

  categories = ['Academics', 'Competition', 'Sports', 'Fun', 'Others'];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: ['upcoming'],
      startDate: [null],
      endDate: [null],
      categories: this.fb.group(
        this.categories.reduce((acc, category) => {
          acc[category] = [false];
          return acc;
        }, {} as any)
      ),
    });
  }

  applyFilters() {
    this.filtersChanged.emit(this.filterForm.value);
    console.log('sidebar filterform:', this.filterForm.value.status);
  }

  clearFilters() {
    this.filterForm.reset({ status: 'upcoming' });
    this.applyFilters();
  }
}
