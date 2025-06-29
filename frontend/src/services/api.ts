import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import {
  Transaction,
  Analytics,
  FilterOptions,
  PaginatedResponse,
  User
} from '../types';

// ✅ CRA uses process.env.REACT_APP_... for env variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Add token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');

  config.headers = config.headers || {};
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// ✅ Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),

  register: (email: string, password: string, name: string) =>
    api.post<{ token: string; user: User }>('/auth/register', { email, password, name }),
};

// ✅ Transactions API
export const transactionsAPI = {
  getTransactions: (page: number, limit: number, filters?: FilterOptions) =>
    api.get<PaginatedResponse<Transaction>>('/transactions', {
      params: { page, limit, ...filters },
    }),

  getAnalytics: () =>
    api.get<Analytics>('/transactions/analytics'),

  createTransaction: (transaction: Partial<Transaction>) =>
    api.post<Transaction>('/transactions', transaction),
};

// ✅ Export API
export const exportAPI = {
  exportCSV: (columns: string[], filters?: FilterOptions) =>
    api.post('/export/csv', { columns, filters }, {
      responseType: 'blob',
    }),
};

export default api;
