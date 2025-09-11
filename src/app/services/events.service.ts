import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private url: string = `http://localhost:3000/api/v1/event/getEvents`;

  constructor(private http: HttpClient) {}

  getEvents(
    page: number = 1,
    limit: number = 10,
    filters?: any
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('type', 'notregistered')
      .set('status', 'upcoming');

    console.log('filters in service', filters);

    if (filters) {
      if (filters.status) {
        console.log('filter status: ', filters.status);
        params = params.set('status', filters.status);
      }

      if (filters.startDate) {
        const start = new Date(filters.startDate);
        if (!isNaN(start.getTime())) {
          params = params.set('startDate', start.toISOString());
        }
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        if (!isNaN(end.getTime())) {
          params = params.set('endDate', end.toISOString());
        }
      }

      if (filters.categories) {
        const selectedCategories = Object.keys(filters.categories).filter(
          (key) => !!filters.categories[key]
        );
        if (selectedCategories.length > 0) {
          params = params.set('categories', selectedCategories.join(','));
        }
      }
    }
    console.log('api call: ', this.url, { params });
    return this.http.get<any>(this.url, { params });
  }
}
