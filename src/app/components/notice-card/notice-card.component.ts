import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { LikeService } from 'src/app/services/like.service';
import { CommentServiceService } from 'src/app/services/comment-service.service';

@Component({
  selector: 'app-notice-card',
  templateUrl: './notice-card.component.html',
  styleUrls: ['./notice-card.component.scss'],
})
export class NoticeCardComponent {
  isLiked: boolean = false;
  comments: { id: string; author: string; text: string; createdAt: string }[] =
    [];
  newComment: string = '';
  isPosting: boolean = false;
  showComments: boolean = false;

  constructor(
    private http: HttpClient,
    private likeService: LikeService,
    private commentService: CommentServiceService
  ) {}

  @Input() notice: any = [];

  convertToUpperCase(name: string) {
    console.log('final data: ', this.notice);
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

  submitComment() {
    const trimmed = this.newComment.trim();
    if (!trimmed || this.isPosting) return;

    this.isPosting = true;
    const payload = {
      targetType: 'notice',
      targetId: this.notice?._id || this.notice?.id,
      commentContent: trimmed,
    };

    this.commentService.postComment(payload).subscribe({
      next: (res) => {
        const createdComment = {
          id: res?.id || Math.random().toString(36).slice(2),
          author: res?.author || 'You',
          text: trimmed,
          createdAt: new Date().toISOString(),
        };
        this.comments = [createdComment, ...this.comments];
        this.newComment = '';
        if (typeof this.notice.commentCount === 'number') {
          this.notice.commentCount = this.notice.commentCount + 1;
        }
      },
      error: () => {
        const createdComment = {
          id: Math.random().toString(36).slice(2),
          author: 'You',
          text: trimmed,
          createdAt: new Date().toISOString(),
        };
        this.comments = [createdComment, ...this.comments];
        this.newComment = '';
      },
      complete: () => {
        this.isPosting = false;
      },
    });
  }

  openComments() {
    this.showComments = true;
  }

  closeComments() {
    this.showComments = false;
  }
}
