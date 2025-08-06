// ========================================
// 🚀 Team Todo Management System - TypeScript Types
// ========================================

// 🔐 Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// 👥 Team Types
export interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: User;
  members: User[];
  todos: Todo[];
}

export interface CreateTeamRequest {
  name: string;
  description: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface AddMemberRequest {
  email: string;
}

export interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  loading: boolean;
  error: string | null;
}

// 📋 Todo Types
export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
  teamId: string | null;
  createdById: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  assignee: User | null;
  team: Team | null;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  priority?: TodoPriority;
  dueDate?: string;
  teamId?: string;
  assigneeId?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string;
  assigneeId?: string;
}

export interface TodoState {
  todos: Todo[];
  filteredTodos: Todo[];
  currentTodo: Todo | null;
  loading: boolean;
  error: string | null;
  filters: TodoFilters;
}

export interface TodoFilters {
  status?: TodoStatus;
  priority?: TodoPriority;
  teamId?: string;
  assigneeId?: string;
  overdue?: boolean;
  search?: string;
}

// 🤖 AI Types
export interface AIDueDateSuggestion {
  suggestedDueDate: string;
  confidence: number;
  reasoning: string;
}

export interface AITaskAnalysis {
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedHours: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
}

export interface AIState {
  suggestions: AIDueDateSuggestion[];
  analysis: AITaskAnalysis | null;
  loading: boolean;
  error: string | null;
}

// ⚡ WebSocket Types
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
}

export interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

// 📊 API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

// 🎨 UI Types
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
}

export interface NotificationState {
  notifications: Notification[];
}

// 🔧 App Types
export interface AppState {
  auth: AuthState;
  teams: TeamState;
  todos: TodoState;
  ai: AIState;
  websocket: WebSocketState;
  notifications: NotificationState;
}

// 📋 Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date';
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
} 