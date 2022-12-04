import User from '../models/user.model';
import {
  ICreatePostRequest,
  ILoggedRequest,
} from '../interfaces/request.interface';
import Post from '../models/post.model';
import catchAsync, { AppError } from './error.controller';
import ApiFeature, { QueryObject } from '../utils/apiFeatures';
import { likePostNotification, sessionUserMap } from '../utils/serverSentEvent';

export const getAllPosts = catchAsync(async (req, res, next) => {
  //! Potential Bugs
  const queryString = req.query as QueryObject;

  const postQuery = new ApiFeature(
    Post.find().populate('user', '-password').populate('comments'),
    queryString
  )
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const posts = await postQuery.query;

  res.json(posts);
});

export const getUserPosts = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  //! Potential Bugs
  const queryString = req.query as QueryObject;

  const postQuery = new ApiFeature(
    Post.find({ user: id }).populate('user', '-password').populate('comments'),
    queryString
  )
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const posts = await postQuery.query;

  res.json(posts);
});

// Protected
export const createPost = catchAsync(
  async (req: ICreatePostRequest, res, next) => {
    const { userId, description, picturePath } = req.body;

    const newPost = new Post({
      user: userId,
      description,
      picturePath: picturePath,
    });

    const savedPost = await newPost.save();

    const posts = await Post.find()
      .sort('-createdAt')
      .populate('user', '-password');

    res.status(201).json(posts);
  }
);

// Protected
export const likePost = catchAsync(async (req: ILoggedRequest, res, next) => {
  const { postId } = req.params;
  // const { userId } = req.body;
  const userId = req.body.userId || req.params.userIdFromToken;

  const post = await Post.findById(postId).populate('user', '-password');

  if (!post) return next(new AppError('No post found!', 404));

  const postUser = await User.findById(post.user._id);
  const likeUser = await User.findById(userId);

  if (!postUser || !likeUser) return next(new AppError('User not found', 404));

  // Check if user is already liked this post
  if (post.likes.has(userId)) {
    // Cancel it
    post.likes.delete(userId);
    // Decrease impressions number
    postUser.impressions--;
  } else {
    // Like it
    post.likes.set(userId, true);
    postUser.impressions++;

    // Notify post author if author is online - with sse
    if (postUser._id.toString() !== likeUser._id.toString())
      likePostNotification(postUser._id.toString(), likeUser);
  }

  if (postUser) await postUser.save();
  const savedPost = await post.save();

  res.json(savedPost);
});

// Protected, only author can delete his/her posts
export const deletePost = catchAsync(async (req, res, next) => {
  const userId = req.body.userId || req.params.userIdFromToken;
  const postId = req.params.postId;

  const post = await Post.findById(postId);
  const user = await User.findById(userId);

  if (!post) return next(new AppError('Post not found.', 404));
  if (!user) return next(new AppError('User not found.', 404));
  if (post.user.toString() !== userId) {
    return next(new AppError('Action unauthorized.', 401));
  }

  user.impressions -= post.likesCount;

  await post.remove();
  await user.save();
  res.status(204).json();
});
