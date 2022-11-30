import mongoose from 'mongoose';
import { IPost } from '../interfaces/post.interface';

const postSchema = new mongoose.Schema<IPost>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    picturePath: String,
    likes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Comment',
      default: [],
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.pre('save', function (next) {
  if (this.isModified('likes')) {
    this.likesCount = Array.from(this.likes).length;
  }
  if (this.isModified('comments')) {
    this.commentsCount = this.comments.length;
  }

  next();
});

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
