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
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  user: User;
  post: Post;
  content: string;
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
}

export type UserType = User | undefined;
