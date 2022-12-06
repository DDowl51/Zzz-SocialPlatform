import catchAsync, { AppError } from '../controllers/error.controller';
import { INotification } from '../interfaces/notification.interface';
import Notification from '../models/notification.model';
import Post from '../models/post.model';
import User from '../models/user.model';
import {
  commentPostNotification,
  likePostNotification,
} from '../utils/serverSentEvent';

export const notify = (type: 'like' | 'comment') =>
  catchAsync(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.body.userId || req.params.userIdFromToken;

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) return next(new AppError('Post not found', 404));

    const postUser = await User.findById(post.user);

    if (!postUser) return next(new AppError('User not found', 404));
    if (userId === postUser._id.toString()) return next();
    if (!user) return next(new AppError('User not found', 404));

    if (type === 'like') {
      if (post.likes.has(userId)) return next();
      likePostNotification(post.user.toString(), user);
    }
    if (type === 'comment') {
      commentPostNotification(post.user.toString(), user);
    }

    const newNotification = new Notification<INotification>({
      type,
      from: userId,
      to: post.user,
      targetPost: post._id,
      status: 'unread',
    });

    postUser.notification.push(newNotification._id);

    await newNotification.save();
    await postUser.save();

    next();
  });
