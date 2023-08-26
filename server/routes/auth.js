import express from 'express';
import { login, createEmployee } from '../controllers/auth.js';
import { verifyAccessToken, verifyAccessType } from '../middlewares/index.js';

const router = express.Router();

// Routes beginning with /api/auth
router.post('/login', login);
router.post('/signup', verifyAccessToken, verifyAccessType, createEmployee);

export default router;
