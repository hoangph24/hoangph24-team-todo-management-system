import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api';
import { 
  Todo, 
  CreateTodoRequest, 
  UpdateTodoRequest, 
  TodoStatus,
  TodoFilters 
} from '../types';

// Todo service
export const todoService = {
  // Get all todos
  async getAll(): Promise<Todo[]> {
    const response = await apiGet<Todo[]>('/todos');
    return response;
  },

  // Get user's todos
  async getMyTodos(): Promise<Todo[]> {
    const response = await apiGet<Todo[]>('/todos/my-todos');
    return response;
  },

  // Get todos by team
  async getByTeam(teamId: string): Promise<Todo[]> {
    const response = await apiGet<Todo[]>(`/todos/team/${teamId}`);
    return response;
  },

  // Get todos by status
  async getByStatus(status: TodoStatus): Promise<Todo[]> {
    const response = await apiGet<Todo[]>(`/todos/status/${status}`);
    return response;
  },

  // Get overdue todos
  async getOverdueTodos(): Promise<Todo[]> {
    const response = await apiGet<Todo[]>('/todos/overdue');
    return response;
  },

  // Get todo by ID
  async getById(id: string): Promise<Todo> {
    const response = await apiGet<Todo>(`/todos/${id}`);
    return response;
  },

  // Create todo
  async create(todoData: CreateTodoRequest): Promise<Todo> {
    const response = await apiPost<Todo>('/todos', todoData);
    return response;
  },

  // Update todo
  async update(id: string, todoData: UpdateTodoRequest): Promise<Todo> {
    const response = await apiPut<Todo>(`/todos/${id}`, todoData);
    return response;
  },

  // Assign todo
  async assign(id: string, assigneeId: string): Promise<Todo> {
    const response = await apiPut<Todo>(`/todos/${id}/assign/${assigneeId}`);
    return response;
  },

  // Update todo status
  async updateStatus(id: string, status: TodoStatus): Promise<Todo> {
    const response = await apiPut<Todo>(`/todos/${id}/status/${status}`);
    return response;
  },

  // Delete todo
  async delete(id: string): Promise<void> {
    await apiDelete<void>(`/todos/${id}`);
  },

  // Filter todos
  filterTodos(todos: Todo[], filters: TodoFilters): Todo[] {
    let filtered = [...todos];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(todo => todo.status === filters.status);
    }

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter(todo => todo.priority === filters.priority);
    }

    // Filter by team
    if (filters.teamId) {
      filtered = filtered.filter(todo => todo.teamId === filters.teamId);
    }

    // Filter by assignee
    if (filters.assigneeId) {
      filtered = filtered.filter(todo => todo.assigneeId === filters.assigneeId);
    }

    // Filter by overdue
    if (filters.overdue) {
      const now = new Date();
      filtered = filtered.filter(todo => 
        todo.dueDate && new Date(todo.dueDate) < now && todo.status !== TodoStatus.COMPLETED
      );
    }

    // Filter by search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.description.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  },
};

// Legacy functions for backward compatibility
export const fetchTodos = async (): Promise<Todo[]> => {
  return await todoService.getAll();
};

export const createTodo = async (data: { title: string; description: string }): Promise<Todo> => {
  return await todoService.create(data);
};

export const updateTodo = async (id: string, data: Partial<{ title: string; description: string; status: TodoStatus }>): Promise<Todo> => {
  return await todoService.update(id, data);
};