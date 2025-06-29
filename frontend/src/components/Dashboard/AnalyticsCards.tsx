import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  TrendingUpOutlined,
  TrendingDownOutlined,
  AccountBalanceWalletOutlined,
  SavingsOutlined,
} from '@mui/icons-material';
import { Analytics } from '../../types';

interface AnalyticsCardsProps {
  analytics: Analytics | null;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ analytics }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const cards = [
    {
      title: 'Balance',
      value: analytics?.summary.revenue || 0,
      icon: <AccountBalanceWalletOutlined fontSize="large" />,
      color: '#4caf50',
    },
    {
      title: 'Revenue',
      value: analytics?.summary.revenue || 0,
      icon: <TrendingUpOutlined fontSize="large" />,
      color: '#4caf50',
    },
    {
      title: 'Expenses',
      value: analytics?.summary.expenses || 0,
      icon: <TrendingDownOutlined fontSize="large" />,
      color: '#f44336',
    },
    {
      title: 'Profit',
      value: analytics?.summary.profit || 0,
      icon: <SavingsOutlined fontSize="large" />,
      color: '#2196f3',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 2, color: card.color }}>
              {card.icon}
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                {card.title}
              </Typography>
              <Typography variant="h6">
                {formatCurrency(card.value)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsCards;
