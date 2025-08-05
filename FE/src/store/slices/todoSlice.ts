import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  TodoState, 
  Todo, 
  CreateTodoRequest, 
  UpdateTodoRequest, 
  TodoFilters,
  TodoStatus 
} from '../../types';
import { todoService } from '../../services/todo';

// Async thunks
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      return await todoService.getAll();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch todos');
    }
  }
);

export const fetchMyTodos = createAsyncThunk(
  'todos/fetchMyTodos',
  async (_, { rejectWithValue }) => {
    try {
      return await todoService.getMyTodos();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch my todos');
    }
  }
);

export const fetchTeamTodos = createAsyncThunk(
  'todos/fetchTeamTodos',
  async (teamId: string, { rejectWithValue }) => {
    try {
      return await todoService.getByTeam(teamId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch team todos');
    }
  }
);

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todoData: CreateTodoRequest, { rejectWithValue }) => {
    try {
      return await todoService.create(todoData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create todo');
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, data }: { id: string; data: UpdateTodoRequest }, { rejectWithValue }) => {
    try {
      return await todoService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update todo');
    }
  }
);

export const assignTodo = createAsyncThunk(
  'todos/assignTodo',
  async ({ id, assigneeId }: { id: string; assigneeId: string }, { rejectWithValue }) => {
    try {
      return await todoService.assign(id, assigneeId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign todo');
    }
  }
);

export const updateTodoStatus = createAsyncThunk(
  'todos/updateTodoStatus',
  async ({ id, status }: { id: string; status: TodoStatus }, { rejectWithValue }) => {
    try {
      return await todoService.updateStatus(id, status);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update todo status');
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string, { rejectWithValue }) => {
    try {
      await todoService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete todo');
    }
  }
);

// Initial state
const initialState: TodoState = {
  todos: [],
  filteredTodos: [],
  currentTodo: null,
  loading: false,
  error: null,
  filters: {},
};

// Todo slice
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Set current todo
    setCurrentTodo: (state, action: PayloadAction<Todo | null>) => {
      state.currentTodo = action.payload;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<TodoFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters
      state.filteredTodos = todoService.filterTodos(state.todos, state.filters);
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
      state.filteredTodos = state.todos;
    },

    // Add todo (for real-time updates)
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.unshift(action.payload);
      state.filteredTodos = todoService.filterTodos(state.todos, state.filters);
    },

    // Update todo (for real-time updates)
    updateTodoRealTime: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
        state.filteredTodos = todoService.filterTodos(state.todos, state.filters);
      }
    },

    // Remove todo (for real-time updates)
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      state.filteredTodos = todoService.filterTodos(state.todos, state.filters);
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch todos
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.todos = action.payload;
        state.filteredTodos = todoService.filterTodos(action.payload, state.filters);
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch my todos
    builder
      .addCase(fetchMyTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.todos = action.payload;
        state.filteredTodos = todoService.filterTodos(action.payload, state.filters);
        state.error = null;
      })
      .addCase(fetchMyTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch team todos
    builder
      .addCase(fetchTeamTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.todos = action.payload;
        state.filteredTodos = todoService.filterTodos(action.payload, state.filters);
        state.error = null;
      })
      .addCase(fetchTeamTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create todo
    builder
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false;
        state.todos.unshift(action.payload);
        state.filteredTodos = todoService.filterTodos(state.todos, state.filters);
        state.error = null;
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update todo
    builder
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
          state.filteredTodos = todoService.filterTodos(state.todos, state.filters);
        }
        state.error = null;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Assign todo
    builder
      .addCase(assignTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
          state.filteredTodos = todoService.filterTodos(state.todos, state.filters);
        }
        state.error = null;
      })
      .addCase(assignTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update todo status
    builder
      .addCase(updateTodoStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodoStatus.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
          state.filteredTodos = todoService.filterTodos(state.todos, state.filters);
        }
        state.error = null;
      })
      .addCase(updateTodoStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete todo
    builder
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
        state.filteredTodos = todoService.filterTodos(state.todos, state.filters);
        state.error = null;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setCurrentTodo, 
  setFilters, 
  clearFilters, 
  addTodo, 
  updateTodoRealTime, 
  removeTodo, 
  clearError 
} = todoSlice.actions;

export default todoSlice.reducer; 