import { getAllComments } from '../controllers/comment.controller';
import express from 'express';

// /api/auth
const router = express.Router();

router.route('/').get(getAllComments);

export default router;
