import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  styleUrls: ['./event-page.component.scss'],
})
export class EventPageComponent implements OnInit {
  eventId: string | null = null;
  url: string = 'http://localhost:3000/api/v1';
  event: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap);
    this.eventId = this.route.snapshot.paramMap.get('id');
    console.log('frontend eventId: ', this.eventId);

    this.http.get(`${this.url}/event/${this.eventId}`).subscribe({
      next: (response: any) => {
        console.log('event info: ', response);
        this.event = response.data;
      },
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  registerForEvent() {
    console.log('successfully registered for event');
  }
}
