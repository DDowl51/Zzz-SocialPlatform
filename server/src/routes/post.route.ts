import express from 'express';
import {
  createComment,
  getPostComments,
} from '../controllers/comment.controller';
import {
  createPost,
  deletePost,
  getAllPosts,
  getUserPosts,
  likePost,
} from '../controllers/post.controller';
import { protect } from '../middlewares/auth.middle';

// /api/posts
const router = express.Router();

router.route('/').get(getAllPosts);
router.delete('/:postId', protect, deletePost);
router.patch('/:postId/like', protect, likePost);

router
  .route('/:postId/comments')
  .get(getPostComments)
  .post(protect, createComment);

export default router;
