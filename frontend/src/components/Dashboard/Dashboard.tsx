import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
} from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { transactionsAPI } from '../../services/api';
import { Analytics, Transaction, FilterOptions } from '../../types';
import AnalyticsCards from '../Dashboard/AnalyticsCards';
import ChartSection from '../Dashboard/ChartSection';
import TransactionTable from '../Transactions/TransactionTable';
import FilterPanel from '../Transactions/FilterPanel';
import ExportModal from '../Export/ExportModal';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

 useEffect(() => {
  loadAnalytics();
  loadTransactions();
}, []); // Empty dependency array - might cause lint warnings

  useEffect(() => {
    loadTransactions();
  }, [filters, page]);

  const loadAnalytics = async () => {
    try {
      const response = await transactionsAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getTransactions(page, 10, filters);
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <Box>
      {/* Top Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#222' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            💰 Penta Financial Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ marginRight: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Analytics Cards */}
          <Grid item xs={12}>
            {analytics && <AnalyticsCards analytics={analytics} />}
          </Grid>

          {/* Chart Section */}
          <Grid item xs={12}>
            {analytics && <ChartSection analytics={analytics} />}
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => setExportModalOpen(true)}
              >
                Export Data
              </Button>
              <Button variant="outlined" sx={{ mr: 2 }}>
                Add Transaction
              </Button>
              <Button variant="outlined">Generate Report</Button>
            </Paper>
          </Grid>

          {/* Filter Panel */}
          <Grid item xs={12}>
            <FilterPanel filters={filters} onChange={handleFilterChange} />
          </Grid>

          {/* Transaction Table */}
          <Grid item xs={12}>
            <TransactionTable
              transactions={transactions}
              loading={loading}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        filters={filters}
      />
    </Box>
  );
};

export default Dashboard;
