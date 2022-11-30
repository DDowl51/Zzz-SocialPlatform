import { login } from '../controllers/auth.controller';
import express from 'express';

// /api/auth
const router = express.Router();

router.post('/login', login);

export default router;
