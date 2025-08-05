import { apiPost, apiGet, apiPut } from './api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User 
} from '../types';

const JWT_STORAGE_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'team_todo_token';

// Authentication service
export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiPost<AuthResponse>('/auth/login', credentials);
    localStorage.setItem(JWT_STORAGE_KEY, response.access_token);
    return response;
  },

  // Register user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiPost<AuthResponse>('/auth/register', userData);
    localStorage.setItem(JWT_STORAGE_KEY, response.access_token);
    return response;
  },

  // Get user profile
  async getProfile(): Promise<User> {
    const response = await apiGet<User>('/auth/profile');
    return response;
  },

  // Update user profile
  async updateProfile(updateData: Partial<User>): Promise<User> {
    const response = await apiPut<User>('/users/profile', updateData);
    return response;
  },

  // Logout user
  logout(): void {
    localStorage.removeItem(JWT_STORAGE_KEY);
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    return !!token;
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(JWT_STORAGE_KEY);
  },

  // Set token
  setToken(token: string): void {
    localStorage.setItem(JWT_STORAGE_KEY, token);
  },

  // Clear token
  clearToken(): void {
    localStorage.removeItem(JWT_STORAGE_KEY);
  },
};

// Legacy functions for backward compatibility
export const loginUser = async (email: string, password: string): Promise<User> => {
  const response = await authService.login({ email, password });
  return response.user;
};

export const registerUser = async (email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> => {
  return await authService.register({ email, password, firstName, lastName });
};

export const logoutUser = (): void => {
  authService.logout();
};