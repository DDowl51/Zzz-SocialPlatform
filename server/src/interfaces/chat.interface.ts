import mongoose from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;

export interface IChat {
  from: ObjectId;
  to: ObjectId;
  content: string;
  status: 'read' | 'unread';
}
