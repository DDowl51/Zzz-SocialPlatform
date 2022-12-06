import mongoose from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;

export interface IPost {
  user: ObjectId;
  description: string;
  picturePath?: string;
  likes: mongoose.Types.Map<boolean>;
  likesCount: number;
  comments: ObjectId[];
  commentsCount: number;
}
