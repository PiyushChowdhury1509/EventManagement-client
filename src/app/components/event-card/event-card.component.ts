import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { LikeService } from 'src/app/services/like.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent {
  isLiked: boolean = false;

  constructor(private http: HttpClient, likeService: LikeService) {}

  @Input() event: any = [];

  convertToUpperCase(name: string) {
    console.log('final data: ', this.event);
    return name.toUpperCase();
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
  }

  formatDate(date: string | Date): string {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

