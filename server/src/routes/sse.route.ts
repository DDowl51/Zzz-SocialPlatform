import express from 'express';
import { sseClose, sseConnect } from '../controllers/sse.controller';
import { protect } from '../middlewares/auth.middle';

const router = express.Router();

router.route('/').get(protect, sseConnect).delete(protect, sseClose);

export default router;
