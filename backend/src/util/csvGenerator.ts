import { ITransaction } from '../models/Transaction';

export const generateCSV = async (
  transactions: ITransaction[],
  columns: string[]
): Promise<string> => {
  // Validate columns
  const validColumns = ['id', 'date', 'amount', 'category', 'status', 'user_id', 'user_profile'];
  const selectedColumns = columns.filter(col => validColumns.includes(col));
  
  if (selectedColumns.length === 0) {
    throw new Error('No valid columns selected for CSV export');
  }

  const headers = selectedColumns.join(',');

  const rows = transactions.map((transaction) => {
    return selectedColumns.map((column) => {
      let value: string;

      switch (column) {
        case 'id':
          value = transaction.id.toString();
          break;
        case 'date':
          value = transaction.date.toISOString().split('T')[0]; // YYYY-MM-DD format
          break;
        case 'amount':
          value = transaction.amount.toFixed(2); // Format with 2 decimal places
          break;
        case 'category':
          value = transaction.category;
          break;
        case 'status':
          value = transaction.status;
          break;
        case 'user_id':
          value = transaction.user_id;
          break;
        case 'user_profile':
          value = transaction.user_profile;
          break;
        default:
          value = '';
      }

      // Escape special CSV characters
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }

      return value;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
};

