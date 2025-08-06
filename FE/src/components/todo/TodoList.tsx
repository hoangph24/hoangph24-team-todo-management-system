import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { Todo, TodoStatus, TodoPriority, User, Team } from '../../types';
import TodoItem from './TodoItem';
import AITodoForm from '../ai/AITodoForm';
import TodoFilters from './TodoFilters';
import { useLocation, useNavigate } from 'react-router-dom';

interface TodoListProps {
  todos: Todo[];
  teams: Team[];
  users: User[];
  currentUser: User;
  loading?: boolean;
  error?: string | null;
  onCreateTodo: (data: any) => void;
  onUpdateTodo: (id: string, data: any) => void;
  onDeleteTodo: (id: string) => void;
  onAssignTodo: (id: string, assigneeId: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onFiltersChange: (filters: any) => void;
  onClearError?: () => void;
  filters: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`todo-tabpanel-${index}`}
      aria-labelledby={`todo-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  teams,
  users,
  currentUser,
  loading = false,
  error = null,
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
  onAssignTodo,
  onStatusChange,
  onFiltersChange,
  onClearError,
  filters,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle scroll to task from notification
  useEffect(() => {
    const scrollToTask = location.state?.scrollToTask;
    const highlightTask = location.state?.highlightTask;
    
    if (scrollToTask && todos.length > 0) {
      // Find the task in the current todos
      const task = todos.find(todo => todo.id === scrollToTask);
      if (task) {
        // Set highlighted task
        setHighlightedTaskId(highlightTask || scrollToTask);
        
        // Scroll to the task after a short delay to ensure DOM is ready
        setTimeout(() => {
          const taskElement = taskRefs.current.get(scrollToTask);
          if (taskElement) {
            taskElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
              setHighlightedTaskId(null);
            }, 3000);
            
            // Clear location state to prevent re-scrolling
            navigate(location.pathname, { replace: true });
          }
        }, 100);
      }
    }
  }, [location.state, todos]);

  const getTodosByStatus = (status: TodoStatus) => {
    return todos.filter(todo => todo.status === status);
  };

  const getSortedTodos = (todoList: Todo[]) => {
    return [...todoList].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { [TodoPriority.URGENT]: 4, [TodoPriority.HIGH]: 3, [TodoPriority.MEDIUM]: 2, [TodoPriority.LOW]: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const getStatusCount = (status: TodoStatus) => {
    return todos.filter(todo => todo.status === status).length;
  };

  const getOverdueCount = () => {
    const now = new Date();
    return todos.filter(todo => 
      todo.dueDate && 
      new Date(todo.dueDate) < now && 
      todo.status !== TodoStatus.COMPLETED
    ).length;
  };

  const getUrgentCount = () => {
    return todos.filter(todo => 
      todo.priority === TodoPriority.URGENT && 
      todo.status !== TodoStatus.COMPLETED
    ).length;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }



  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Task Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {todos.length} total tasks
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateForm(true)}
        >
          Create Task
        </Button>
      </Box>

      {/* Create Todo Form - Moved to top */}
      {showCreateForm && (
        <Box sx={{ mb: 3 }}>
          <AITodoForm
            onSubmit={(data) => {
              onCreateTodo(data);
              setShowCreateForm(false);
            }}
            onCancel={() => setShowCreateForm(false)}
            onClearError={onClearError}
            teams={teams}
            users={users}
            currentUser={currentUser}
            loading={loading}
            error={error}
          />
        </Box>
      )}

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <PriorityHighIcon color="error" />
                <Typography variant="h6">{getUrgentCount()}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Urgent Tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <ScheduleIcon color="warning" />
                <Typography variant="h6">{getOverdueCount()}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Overdue Tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6">{getStatusCount(TodoStatus.IN_PROGRESS)}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <GroupIcon color="secondary" />
                <Typography variant="h6">{teams.length}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Active Teams
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <TodoFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        teams={teams}
        users={users}
        currentUser={currentUser}
      />

      {/* Sort Controls */}
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            label="Order"
          >
            <MenuItem value="desc">Newest First</MenuItem>
            <MenuItem value="asc">Oldest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="todo status tabs">
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>All</Typography>
                <Chip label={todos.length} size="small" color="primary" />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Pending</Typography>
                <Chip label={getStatusCount(TodoStatus.PENDING)} size="small" color="default" />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>In Progress</Typography>
                <Chip label={getStatusCount(TodoStatus.IN_PROGRESS)} size="small" color="primary" />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Completed</Typography>
                <Chip label={getStatusCount(TodoStatus.COMPLETED)} size="small" color="success" />
              </Box>
            } 
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {todos.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" gutterBottom>
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Create your first task to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateForm(true)}
            >
              Create Task
            </Button>
          </Box>
        ) : (
          <Box>
            {getSortedTodos(todos).map((todo) => (
              <Box
                key={todo.id}
                ref={(el: HTMLDivElement | null) => {
                  if (el) taskRefs.current.set(todo.id, el);
                }}
                sx={{
                  border: highlightedTaskId === todo.id ? '2px solid #1976d2' : 'none',
                  borderRadius: highlightedTaskId === todo.id ? 1 : 0,
                  backgroundColor: highlightedTaskId === todo.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <TodoItem
                  todo={todo}
                  currentUser={currentUser}
                  users={users}
                  teams={teams}
                  onUpdate={onUpdateTodo}
                  onDelete={onDeleteTodo}
                  onAssign={onAssignTodo}
                  onStatusChange={onStatusChange}
                  loading={loading}
                />
              </Box>
            ))}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {getTodosByStatus(TodoStatus.PENDING).length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" gutterBottom>
              No pending tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All tasks are either in progress or completed
            </Typography>
          </Box>
        ) : (
          <Box>
            {getSortedTodos(getTodosByStatus(TodoStatus.PENDING)).map((todo) => (
              <Box
                key={todo.id}
                ref={(el: HTMLDivElement | null) => {
                  if (el) taskRefs.current.set(todo.id, el);
                }}
                sx={{
                  border: highlightedTaskId === todo.id ? '2px solid #1976d2' : 'none',
                  borderRadius: highlightedTaskId === todo.id ? 1 : 0,
                  backgroundColor: highlightedTaskId === todo.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <TodoItem
                  todo={todo}
                  currentUser={currentUser}
                  users={users}
                  teams={teams}
                  onUpdate={onUpdateTodo}
                  onDelete={onDeleteTodo}
                  onAssign={onAssignTodo}
                  onStatusChange={onStatusChange}
                  loading={loading}
                />
              </Box>
            ))}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {getTodosByStatus(TodoStatus.IN_PROGRESS).length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" gutterBottom>
              No tasks in progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start working on some tasks to see them here
            </Typography>
          </Box>
        ) : (
          <Box>
            {getSortedTodos(getTodosByStatus(TodoStatus.IN_PROGRESS)).map((todo) => (
              <Box
                key={todo.id}
                ref={(el: HTMLDivElement | null) => {
                  if (el) taskRefs.current.set(todo.id, el);
                }}
                sx={{
                  border: highlightedTaskId === todo.id ? '2px solid #1976d2' : 'none',
                  borderRadius: highlightedTaskId === todo.id ? 1 : 0,
                  backgroundColor: highlightedTaskId === todo.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <TodoItem
                  todo={todo}
                  currentUser={currentUser}
                  users={users}
                  teams={teams}
                  onUpdate={onUpdateTodo}
                  onDelete={onDeleteTodo}
                  onAssign={onAssignTodo}
                  onStatusChange={onStatusChange}
                  loading={loading}
                />
              </Box>
            ))}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {getTodosByStatus(TodoStatus.COMPLETED).length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" gutterBottom>
              No completed tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete some tasks to see them here
            </Typography>
          </Box>
        ) : (
          <Box>
            {getSortedTodos(getTodosByStatus(TodoStatus.COMPLETED)).map((todo) => (
              <Box
                key={todo.id}
                ref={(el: HTMLDivElement | null) => {
                  if (el) taskRefs.current.set(todo.id, el);
                }}
                sx={{
                  border: highlightedTaskId === todo.id ? '2px solid #1976d2' : 'none',
                  borderRadius: highlightedTaskId === todo.id ? 1 : 0,
                  backgroundColor: highlightedTaskId === todo.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <TodoItem
                  todo={todo}
                  currentUser={currentUser}
                  users={users}
                  teams={teams}
                  onUpdate={onUpdateTodo}
                  onDelete={onDeleteTodo}
                  onAssign={onAssignTodo}
                  onStatusChange={onStatusChange}
                  loading={loading}
                />
              </Box>
            ))}
          </Box>
        )}
      </TabPanel>

    </Box>
  );
};

export default TodoList;