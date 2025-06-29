import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Analytics } from '../../types';

interface ChartSectionProps {
  analytics: Analytics | null;
}

interface MonthlyTrendItem {
  _id: {
    year: number;
    month: number;
    category: 'revenue' | 'expense';
  };
  total: number;
}

interface MonthlyDataItem {
  month: string;
  revenue: number;
  expense: number;
}

interface PieDataItem {
  _id: string;
  total: number;
}

const ChartSection: React.FC<ChartSectionProps> = ({ analytics }) => {
  const monthlyData = React.useMemo<MonthlyDataItem[]>(() => {
  const trends = analytics?.monthlyTrends as MonthlyTrendItem[] | undefined;
  if (!trends) return [];

  const initialValue: Record<string, MonthlyDataItem> = {};

  const grouped = trends.reduce<Record<string, MonthlyDataItem>>(
    (acc, item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      if (!acc[key]) {
        acc[key] = { month: key, revenue: 0, expense: 0 };
      }
      if (item._id.category === 'revenue') acc[key].revenue = item.total;
      if (item._id.category === 'expense') acc[key].expense = item.total;
      return acc;
    },
    initialValue
  );

  return Object.values(grouped);
}, [analytics?.monthlyTrends]);

//   const pieData: PieDataItem[] = analytics?.categoryBreakdown || [];
const pieData: PieDataItem[] = (analytics?.categoryBreakdown || []).map(item => ({
  _id: item.category,
  total: item.total
}));

  const COLORS = ['#4caf50', '#f44336', '#2196f3', '#ff9800'];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Overview</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4caf50" 
                name="Revenue" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#f44336" 
                name="Expense" 
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="total"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChartSection;