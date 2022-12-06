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
import { notify } from '../middlewares/notification.middle';

// /api/posts
const router = express.Router();

router.route('/').get(getAllPosts);
router.delete('/:postId', protect, deletePost);
router.patch('/:postId/like', protect, notify('like'), likePost);

router
  .route('/:postId/comments')
  .get(getPostComments)
  .post(protect, notify('comment'), createComment);

export default router;
