import { Component, OnInit, OnDestroy } from '@angular/core';
import { NoticeServiceService } from 'src/app/services/notice-service.service';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss'],
})
export class NoticeComponent implements OnInit, OnDestroy {
  noticeData: any = [];
  page = 1;
  limit = 5;
  total = 0;
  isLoading = false;
  hasError = false;
  errorMessage = '';
  currentFilters: any = {};
  private destroy$ = new Subject<void>();

  constructor(private noticeService: NoticeServiceService) {}

  ngOnInit(): void {
    this.loadInitialNotices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialNotices() {
    this.page = 1;
    this.hasError = false;
    this.errorMessage = '';
    this.getNotices();
  }

  getNotices() {
    console.log(this.currentFilters);
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    console.log('get notices: ', this.currentFilters);

    this.noticeService
      .getNotices(this.page, this.limit, this.currentFilters)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (notice) => {
          console.log('notices: ', notice);
          this.noticeData = notice;
          this.total = notice?.meta?.totalCount || 0;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = 'Failed to load notices. Please try again.';
        }
      );
  }

  handlePage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getNotices();
  }

  onFiltersApplied(filters: any) {
    this.currentFilters = filters || {};
    console.log('notice current filters', this.currentFilters);
    this.page = 1;
    this.getNotices();
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
    this.getNotices();
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
    this.loadInitialNotices();
  }
}
