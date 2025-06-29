import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import { generateCSV } from '../util/csvGenerator';

interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export const exportTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { columns, filters } = req.body;
    const userId = req.user?.userId;

    // Build filter object
    const filter: any = { userId };
    
    if (filters?.category && filters.category !== 'all') {
      filter.category = filters.category;
    }
    
    if (filters?.status && filters.status !== 'all') {
      filter.status = filters.status;
    }
    
    if (filters?.dateFrom) {
      filter.date = { ...filter.date, $gte: new Date(filters.dateFrom) };
    }
    
    if (filters?.dateTo) {
      filter.date = { ...filter.date, $lte: new Date(filters.dateTo) };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    const csvData = await generateCSV(transactions, columns);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};