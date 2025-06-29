import express from 'express';
import { exportTransactions } from '../controllers/exportController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.post('/csv', exportTransactions);

export default router;