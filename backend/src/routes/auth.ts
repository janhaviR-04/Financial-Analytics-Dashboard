import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = express.Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 1 }),
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
], login);

export default router;