import {
  getAllComments,
  deleteComment,
} from '../controllers/comment.controller';
import express from 'express';
import { protect } from '../middlewares/auth.middle';

// /api/auth
const router = express.Router();

router.route('/').get(getAllComments);
router.route('/:commentId').delete(protect, deleteComment);

export default router;
