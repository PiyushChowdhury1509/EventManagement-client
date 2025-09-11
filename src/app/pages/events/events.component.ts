import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, OnDestroy {
  eventData: any = [];
  page = 1;
  limit = 5;
  total = 0;
  isLoading = false;
  hasError = false;
  errorMessage = '';
  currentFilters: any = {};
  private destroy$ = new Subject<void>();

  constructor(private eventService: EventsService) {}

  ngOnInit(): void {
    this.loadInitialEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialEvents() {
    this.page = 1;
    this.hasError = false;
    this.errorMessage = '';
    this.getEvents();
  }

  getEvents() {
    console.log(this.currentFilters);
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    console.log('get events: ', this.currentFilters);

    this.eventService
      .getEvents(this.page, this.limit, this.currentFilters)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (event) => {
          console.log('events: ', event);
          this.eventData = event;
          this.total = event?.meta?.totalCount || 0;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = 'Failed to load events. Please try again.';
        }
      );
  }

  handlePage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getEvents();
  }

  onFiltersApplied(filters: any) {
    this.currentFilters = filters || {};
    console.log('event current filters', this.currentFilters);
    this.page = 1;
    this.getEvents();
  }

  get totalPages(): number {
    return this.limit > 0 ? Math.max(1, Math.ceil(this.total / this.limit)) : 1;
  }

  get paginationRange(): (number | string)[] {
    const totalPages = this.totalPages;
    const current = this.page;
    const delta = 1;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const range: (number | string)[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(totalPages - 1, current + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push('...');
    range.push(totalPages);
    return range;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.page) return;
    this.page = page;
    this.getEvents();
  }

  nextPage() {
    this.goToPage(this.page + 1);
  }

  prevPage() {
    this.goToPage(this.page - 1);
  }

  toNumber(value: number | string): number {
    return typeof value === 'number' ? value : Number(value);
  }

  retryLoading() {
    this.hasError = false;
    this.errorMessage = '';
    this.loadInitialEvents();
  }
}
