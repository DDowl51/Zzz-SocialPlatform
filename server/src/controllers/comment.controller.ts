import catchAsync, { AppError } from './error.controller';
import { ICommentRequest } from '../interfaces/request.interface';
import User from '../models/user.model';
import Comment from '../models/comment.model';
import Post from '../models/post.model';

export const getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find();

  res.json(comments);
});

// Protected
export const createComment = catchAsync(
  async (req: ICommentRequest, res, next) => {
    const { userId, content } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return next(new AppError('Post not found.', 404));

    const newComment = new Comment({
      post: postId,
      user: userId,
      content,
    });

    post.comments.push(newComment._id);
    await newComment.save();

    const savedPost = await (await post.populate('user', '-password')).save();

    res.status(201).json(savedPost);
  }
);

export const getPostComments = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .populate('user', 'picturePath _id location occupation name email')
    .sort('-createdAt');

  res.json(comments);
});

export const deleteComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.body.userId || req.params.userIdFromToken;

  const post = await Post.findOne({ comments: commentId });
  const comment = await Comment.findById(commentId);

  if (!post) return next(new AppError('Post not found', 404));
  if (!comment) return next(new AppError('Comment not found', 404));

  if (userId !== comment.user.toString()) {
    return next(new AppError('Not authorized', 401));
  }

  post.comments = post.comments.filter(c => c.toString() !== commentId);
  post.commentsCount = post.comments.length;
  await comment.remove();
  await post.save();

  res.status(204).json({});
});
