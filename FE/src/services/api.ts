import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ErrorResponse, ApiResponse } from '../types';

// Environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
const JWT_STORAGE_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'team_todo_token';

// Create axios instance
const API: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem(JWT_STORAGE_KEY);
      window.location.href = '/login';
    }
    
    // Handle other errors
    const errorResponse: ErrorResponse = {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'An error occurred',
      error: error.response?.data?.error || 'Internal Server Error',
    };
    
    return Promise.reject(errorResponse);
  }
);

// API helper functions
export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await API.get<T>(url, config);
  return response.data;
};

export const apiPost = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await API.post<T>(url, data, config);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await API.put<T>(url, data, config);
  return response.data;
};

export const apiPatch = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await API.patch<T>(url, data, config);
  return response.data;
};

export const apiDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await API.delete<T>(url, config);
  return response.data;
};

export default API;