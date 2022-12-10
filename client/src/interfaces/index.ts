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

export interface Chat {
  _id: string;
  from: string;
  to: string;
  content: 'string';
  status: 'read' | 'unread';
  createdAt: string;
  updatedAt: string;
}

export enum ClientEventType {
  CONNECTION = 'connection',
  DISCONNECT = 'user_disconnect',
  SETNAME = 'set_name',
  MESSAGE = 'message',
  GROUPMESSAGE = 'group_message',
  GETONLINE = 'get_online',
  TYPING = 'typing',
  TYPINGEND = 'typing_end',
  USERONLINE = 'user_online',
}

export enum ServerEventType {
  RECIEVEDMESSAGE = 'recieved_message',
  FORCELOGOUT = 'force_logout',
  ERRORLOGOUT = 'error_logout',
  SENDONLINE = 'send_online',
  TYPING = 'typing',
  TYPINGEND = 'typing_end',
  INFORMFRIENDONLINE = 'inform_friend_online',
  NAMESET = 'name_set',
  USEROFFLINE = 'user_offline',
}
