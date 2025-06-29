import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, category, status, sortBy = 'date', sortOrder = 'desc' } = req.query;
    const userId = req.user?.userId;

    // Build filter object
    const filter: any = { userId };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const transactions = await Transaction.find(filter)
      .sort(sort)
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Get summary metrics
    const totalRevenue = await Transaction.aggregate([
      { $match: { userId, category: 'revenue', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalExpenses = await Transaction.aggregate([
      { $match: { userId, category: 'expense', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get monthly trends (last 12 months)
    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          userId,
          status: 'completed',
          date: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            category: '$category',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Get category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { userId, status: 'completed' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      summary: {
        revenue: totalRevenue[0]?.total || 0,
        expenses: totalExpenses[0]?.total || 0,
        profit: (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0),
      },
      monthlyTrends,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const transactionData = { ...req.body, userId };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};