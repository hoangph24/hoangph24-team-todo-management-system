import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography as MuiTypography,
} from '@mui/material';
import { RootState, AppDispatch } from '../store';
import {
  fetchMyTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  assignTodo,
  updateTodoStatus,
  setFilters,
  clearFilters,
  clearError,
} from '../store/slices/todoSlice';
import { fetchMyTeams } from '../store/slices/teamSlice';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoStatus, TodoFilters } from '../types';
import TodoList from '../components/todo/TodoList';

const TodosPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error, filters } = useSelector((state: RootState) => state.todos);
  const { teams: allTeams } = useSelector((state: RootState) => state.teams);
  const { user } = useSelector((state: RootState) => state.auth);

  // Remove duplicate teams
  const teams = allTeams.filter((team, index, self) => 
    index === self.findIndex(t => t.id === team.id)
  );

  // Local state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchMyTodos());
    dispatch(fetchMyTeams());
  }, [dispatch]);

  // Note: Team joining is now handled by AutoJoinService globally

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleCreateTodo = async (data: CreateTodoRequest) => {
    try {
      // Clear any existing error before trying again
      dispatch(clearError());
      await dispatch(createTodo(data)).unwrap();
      showSnackbar('Task created successfully!', 'success');
      setShowCreateForm(false);
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to create task', 'error');
      dispatch(clearError());
    }
  };

  const handleUpdateTodo = async (id: string, data: UpdateTodoRequest) => {
    try {
      await dispatch(updateTodo({ id, data })).unwrap();
      showSnackbar('Task updated successfully!', 'success');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to update task', 'error');
      dispatch(clearError());
    }
  };

  const handleDeleteTodo = (todo: Todo) => {
    setTodoToDelete(todo);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteTodoById = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      handleDeleteTodo(todo);
    }
  };

  const confirmDeleteTodo = async () => {
    if (!todoToDelete) return;

    try {
      await dispatch(deleteTodo(todoToDelete.id)).unwrap();
      showSnackbar('Task deleted successfully!', 'success');
      setDeleteConfirmOpen(false);
      setTodoToDelete(null);
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to delete task', 'error');
      dispatch(clearError());
    }
  };

  const handleAssignTodo = async (id: string, assigneeId: string) => {
    try {
      await dispatch(assignTodo({ id, assigneeId })).unwrap();
      showSnackbar('Task assigned successfully!', 'success');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to assign task', 'error');
      dispatch(clearError());
    }
  };

  const handleStatusChange = async (id: string, status: TodoStatus) => {
    try {
      await dispatch(updateTodoStatus({ id, status })).unwrap();
      showSnackbar(`Task status updated to ${status.replace('_', ' ')}!`, 'success');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to update task status', 'error');
      dispatch(clearError());
    }
  };

  const handleFiltersChange = (newFilters: TodoFilters) => {
    dispatch(setFilters(newFilters));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Please log in to view tasks.</Alert>
      </Container>
    );
  }

  // Use all team members + current user
  const allTeamMembers = teams.flatMap(team => team.members);
  const uniqueMembers = allTeamMembers.filter((member, index, self) => 
    index === self.findIndex(m => m.id === member.id)
  );
  const mockUsers = [
    user,
    ...uniqueMembers.filter(member => member.id !== user.id)
  ];



  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <TodoList
        todos={todos}
        teams={teams}
        users={mockUsers}
        currentUser={user}
        loading={loading}
        error={error}
        onCreateTodo={handleCreateTodo}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodo={handleDeleteTodoById}
        onAssignTodo={handleAssignTodo}
        onStatusChange={handleStatusChange}
        onFiltersChange={handleFiltersChange}
        onClearError={() => dispatch(clearError())}
        filters={filters}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <MuiTypography>
            Are you sure you want to delete "{todoToDelete?.title}"? This action cannot be undone.
          </MuiTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteTodo} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TodosPage; 