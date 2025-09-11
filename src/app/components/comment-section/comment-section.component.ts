import { Component } from '@angular/core';
import { CommentServiceService } from 'src/app/services/comment-service.service';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss'],
})
export class CommentSectionComponent implements OnInit {
  @Input() inputData: any = '';

  comments: any = [];

  constructor(private commentService: CommentServiceService) {}

  ngOnInit(): void {
    this.commentService
      .getComments(
        this.inputData.postType,
        this.inputData.postId,
        this.inputData.page,
        this.inputData.limit
      )
      .subscribe({
        next: (response) => {
          console.log('comment api response: ', response);
          this.comments = response;
        },
      });
  }
}
