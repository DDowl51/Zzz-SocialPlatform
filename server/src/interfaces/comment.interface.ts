import mongoose from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;

export interface IComment {
  user: ObjectId;
  post: ObjectId;
  content: string;
}
