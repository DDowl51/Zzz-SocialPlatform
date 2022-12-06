import mongoose from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;

type NotificationType = 'like' | 'comment';

export interface INotification {
  type: NotificationType;
  from: ObjectId;
  to: ObjectId;
  targetPost: ObjectId; // Post id
  status: 'read' | 'unread';
}
