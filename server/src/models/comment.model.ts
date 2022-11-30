import mongoose from 'mongoose';
import { IComment } from '../interfaces/comment.interface';

const commentSchema = new mongoose.Schema<IComment>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
