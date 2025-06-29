import express from 'express';
import { getTransactions, getAnalytics, createTransaction } from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getTransactions);
router.get('/analytics', getAnalytics);
router.post('/', createTransaction);

export default router;