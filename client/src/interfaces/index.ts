export interface User {
  _id: string;
  name: string;
  email: string;
  location: string;
  occupation: string;
  picturePath: string;
  friends: string[]; // UserId[]
  profileVisitor: string[]; // UserId[]
  impressions: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  post: Post;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  user: User;
  description: string;
  picturePath?: string;
  likes: { [userId: string]: boolean }; // UserId
  likesCount: number;
  comments: Comment[];
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type UserType = User | undefined;

export interface Notification {
  _id: string;
  type: 'like' | 'comment';
  from: User; // Populated by Id
  targetPost: string; // Post id
  status: 'read' | 'unread';
  createdAt: string;
  updatedAt: string;
}
