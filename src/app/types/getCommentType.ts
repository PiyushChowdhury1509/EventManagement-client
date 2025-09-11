export interface UserInfo {
  _id: string;
  name: string;
  profilePicture: string;
}

export interface CommentResponse {
  _id: string;
  content: string;
  createdBy: UserInfo;
  parentId?: string | null;
  targetType: 'event' | 'notice';
  targetPostId: string;
  depth: number;
  likeCount: number;
  commentCount: number;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
  replies: CommentResponse[];
}

export interface GetCommentsApiResponse {
  success: boolean;
  message: string;
  data: CommentResponse[];
}
