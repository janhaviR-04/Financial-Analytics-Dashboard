// src/components/Transactions/TransactionTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Typography,
  Chip,
} from '@mui/material';
import { Transaction } from '../../types';
import { Box } from '@mui/material';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  page,
  totalPages,
  onPageChange,
}) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1); // MUI pagination is 0-based, our API is 1-based
  };

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography>No transactions found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {transaction.category === 'revenue' ? '+' : '-'}
                ...
                <Chip
                label={transaction.status}
                color={transaction.status === 'completed' ? 'success' : 'warning'}
                size="small"
                />

                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      color={transaction.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <img
                        src={transaction.user_profile}
                        alt="User"
                        style={{ width: 24, height: 24, borderRadius: '50%' }}
                      />
                      {transaction.user_id}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={totalPages * 10} // Assuming 10 items per page
        rowsPerPage={10}
        page={page - 1} // Convert to 0-based for MUI
        onPageChange={handleChangePage}
      />
    </Paper>
  );
};

export default TransactionTable;