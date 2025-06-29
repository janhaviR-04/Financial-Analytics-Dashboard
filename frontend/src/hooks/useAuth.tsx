import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import {
  Transaction,
  Analytics,
  FilterOptions,
  PaginatedResponse,
  User,
} from '../types';

// === Axios Config ===
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  config.headers = config.headers || {};
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// === API Functions ===
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),

  register: (email: string, password: string, name: string) =>
    api.post<{ token: string; user: User }>('/auth/register', {
      email,
      password,
      name,
    }),
};

export const transactionsAPI = {
  getTransactions: (page: number, limit: number, filters?: FilterOptions) =>
    api.get<PaginatedResponse<Transaction>>('/transactions', {
      params: { page, limit, ...filters },
    }),

  getAnalytics: () => api.get<Analytics>('/transactions/analytics'),

  createTransaction: (transaction: Partial<Transaction>) =>
    api.post<Transaction>('/transactions', transaction),
};

export const exportAPI = {
  exportCSV: (columns: string[], filters?: FilterOptions) =>
    api.post<Blob>('/export/csv', { columns, filters }, { responseType: 'blob' }),
};

// === Auth Context ===
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

// const value: AuthContextType = {
//     user,
//     token,
//     login,
//     register,
//     logout,
//     loading,
//   };
    
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authAPI.login(email, password);
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<void> => {
    const response = await authAPI.register(email, password, name);
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// === Hook ===
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default api;
