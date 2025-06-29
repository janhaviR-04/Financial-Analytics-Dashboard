export interface User {
  id: string;
  email: string;
  name: string;
}

// export interface Transaction {
//   _id: string;
//   name: string;
//   amount: number;
//   date: string;
//   category: 'revenue' | 'expense' | 'transfer' | 'investment';
//   status: 'completed' | 'pending' | 'failed';
//   description?: string;
//   userId: string;
//   createdAt: string;
// }

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: 'revenue' | 'expense' | 'transfer' | 'investment';
  status: 'completed' | 'pending' | 'failed';
  user_id: string;
  user_profile?: string;
}

export interface Analytics {
  summary: {
    revenue: number;
    expenses: number;
    profit: number;
  };
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    expense: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    total: number;
  }>;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface PaginatedResponse<T> {
  transactions: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}
