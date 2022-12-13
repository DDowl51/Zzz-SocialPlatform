import express from 'express';
import {
  createComment,
  getPostComments,
} from '../controllers/comment.controller';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  getUserPosts,
  likePost,
  searchPosts,
} from '../controllers/post.controller';
import { protect } from '../middlewares/auth.middle';
import { notify } from '../middlewares/notification.middle';

// /api/posts
const router = express.Router();

router.route('/').get(getAllPosts);
router.route('/:postId').delete(protect, deletePost).get(getPostById);
router.patch('/:postId/like', protect, notify('like'), likePost);
router.get('/search/:pattern', searchPosts);

router
  .route('/:postId/comments')
  .get(getPostComments)
  .post(protect, notify('comment'), createComment);

export default router;
