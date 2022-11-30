import User from '../models/user.model';
import {
  ICreatePostRequest,
  ILoggedRequest,
} from '../interfaces/request.interface';
import Post from '../models/post.model';
import catchAsync, { AppError } from './error.controller';
import ApiFeature, { QueryObject } from '../utils/apiFeatures';

export const getAllPosts = catchAsync(async (req, res, next) => {
  //! Potential Bugs
  const queryString = req.query as QueryObject;

  const postQuery = new ApiFeature(
    Post.find().populate('user', '-password'),
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
    Post.find({ user: id }).populate('user', '-password'),
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
// Restricted to Post creator and administrators
export const deletePost = catchAsync(async (req, res, next) => {
  res.status(501).json({
    message: 'Delete not implemented',
  });
});

// Protected
export const likePost = catchAsync(async (req: ILoggedRequest, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const post = await Post.findById(postId).populate('user', '-password');

  if (!post) return next(new AppError('No post found!', 404));
  console.log(post.user);

  const user = await User.findById(post.user._id);

  // Check if user is already liked this post
  if (post.likes.has(userId)) {
    // Cancel it
    post.likes.delete(userId);
    // Decrease impressions number
    if (user) user.impressions--;
  } else {
    // Like it
    post.likes.set(userId, true);
    if (user) user.impressions++;
  }

  if (user) await user.save();
  const savedPost = await post.save();

  res.json(savedPost);
});
