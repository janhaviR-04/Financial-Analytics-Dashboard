// src/components/Transactions/FilterPanel.tsx
import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Paper,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { FilterOptions } from '../../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange }) => {
  const handleCategoryChange = (event: SelectChangeEvent) => {
    onChange({ ...filters, category: event.target.value });
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    onChange({ ...filters, status: event.target.value });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: Dayjs | null) => {
    onChange({ ...filters, [field]: value ? value.toDate() : null });
  };

  const resetFilters = () => {
    onChange({});
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filter Transactions
      </Typography>
      <Box display="flex" gap={2} flexWrap="wrap">
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category ?? ''}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Revenue">Revenue</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status ?? ''}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>

        <DatePicker
          label="Start Date"
          value={filters.startDate ? dayjs(filters.startDate) : null}
          onChange={(date) => handleDateChange('startDate', date)}
          slotProps={{ textField: { size: 'small' } }}
        />

        <DatePicker
          label="End Date"
          value={filters.endDate ? dayjs(filters.endDate) : null}
          onChange={(date) => handleDateChange('endDate', date)}
          slotProps={{ textField: { size: 'small' } }}
        />

        <Button variant="outlined" onClick={resetFilters}>
          Reset Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default FilterPanel;
