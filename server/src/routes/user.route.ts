import express from 'express';
import { protect } from '../middlewares/auth.middle';
import {
  getAllUsers,
  register,
  updateProfile,
  getUserById,
  handleFriend,
} from '../controllers/user.controller';
import { getUserPosts } from '../controllers/post.controller';

// /api/users
const router = express.Router();

router.route('/').get(protect, getAllUsers);
// router.post('/register', register);
router.patch('/update', protect, updateProfile);
router.route('/:id').get(getUserById);
router.get('/:id/posts', getUserPosts);
router.patch('/friends/:friendId', protect, handleFriend);
export default router;
