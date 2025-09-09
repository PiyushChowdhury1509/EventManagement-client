import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-notice-card',
  templateUrl: './notice-card.component.html',
  styleUrls: ['./notice-card.component.scss'],
})
export class NoticeCardComponent {
  @Input() notice!: any;

  convertToUpperCase(name: string) {
    return name.toUpperCase();
  }

  isLiked = false;

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
