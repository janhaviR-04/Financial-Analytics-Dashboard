// src/components/Export/ExportModal.tsx
import React, { useState } from 'react';
import { Typography } from '@mui/material';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  CircularProgress,
} from '@mui/material';
import { FilterOptions } from '../../types';
import { exportAPI } from '../../services/api';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  filters: FilterOptions;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, filters }) => {
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({
    date: true,
    amount: true,
    category: true,
    status: true,
    user_id: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleColumnToggle = (column: string) => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const columns = Object.keys(selectedColumns).filter(col => selectedColumns[col]);
      const response = await exportAPI.exportCSV(columns, filters);
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Transactions</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Select columns to include in the export:
        </Typography>
        <FormGroup>
          {Object.keys(selectedColumns).map((column) => (
            <FormControlLabel
              key={column}
              control={
                <Checkbox
                  checked={selectedColumns[column]}
                  onChange={() => handleColumnToggle(column)}
                />
              }
              label={column.replace('_', ' ').toUpperCase()}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isExporting}>
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          color="primary"
          disabled={isExporting}
          startIcon={isExporting ? <CircularProgress size={20} /> : null}
        >
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;