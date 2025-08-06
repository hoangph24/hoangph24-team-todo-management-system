import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  Remove as PriorityMediumIcon,
  KeyboardArrowDown as PriorityLowIcon,
  Warning as UrgentIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  PlayArrow as InProgressIcon,
  Cancel as CancelledIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isToday, isTomorrow } from 'date-fns';
import { Todo, User, Team, TodoStatus, TodoPriority, UpdateTodoRequest } from '../../types';

interface TodoItemProps {
  todo: Todo;
  currentUser: User;
  users: User[];
  teams: Team[];
  onUpdate: (id: string, data: UpdateTodoRequest) => void;
  onDelete: (id: string) => void;
  onAssign: (id: string, assigneeId: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
  loading?: boolean;
}

const priorityConfig = {
  [TodoPriority.LOW]: { icon: <PriorityLowIcon />, color: 'default', label: 'Low' },
  [TodoPriority.MEDIUM]: { icon: <PriorityMediumIcon />, color: 'primary', label: 'Medium' },
  [TodoPriority.HIGH]: { icon: <PriorityHighIcon />, color: 'warning', label: 'High' },
  [TodoPriority.URGENT]: { icon: <UrgentIcon />, color: 'error', label: 'Urgent' },
};

const statusConfig = {
  [TodoStatus.PENDING]: { icon: <PendingIcon />, color: 'default', label: 'Pending' },
  [TodoStatus.IN_PROGRESS]: { icon: <InProgressIcon />, color: 'primary', label: 'In Progress' },
  [TodoStatus.COMPLETED]: { icon: <CompletedIcon />, color: 'success', label: 'Completed' },
  [TodoStatus.CANCELLED]: { icon: <CancelledIcon />, color: 'error', label: 'Cancelled' },
};

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  currentUser,
  users,
  teams,
  onUpdate,
  onDelete,
  onAssign,
  onStatusChange,
  loading = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editData, setEditData] = useState<UpdateTodoRequest>({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate || undefined,
    assigneeId: todo.assigneeId || undefined,
  });

  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate || undefined,
      assigneeId: todo.assigneeId || undefined,
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(todo.id);
    handleMenuClose();
  };

  const handleAssign = () => {
    setAssignDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusChange = (status: TodoStatus) => {
    onStatusChange(todo.id, status);
    handleMenuClose();
  };

  const handleEditSubmit = () => {
    onUpdate(todo.id, editData);
    setEditDialogOpen(false);
  };

  const handleAssignSubmit = (assigneeId: string) => {
    onAssign(todo.id, assigneeId);
    setAssignDialogOpen(false);
  };

  const getDueDateDisplay = () => {
    if (!todo.dueDate) return null;

    const dueDate = new Date(todo.dueDate);
    const now = new Date();

    if (dueDate < now && todo.status !== TodoStatus.COMPLETED) {
      return (
        <Chip
          icon={<ScheduleIcon />}
          label={`Overdue: ${format(dueDate, 'MMM dd, yyyy')}`}
          color="error"
          size="small"
        />
      );
    }

    if (isToday(dueDate)) {
      return (
        <Chip
          icon={<ScheduleIcon />}
          label="Due today"
          color="warning"
          size="small"
        />
      );
    }

    if (isTomorrow(dueDate)) {
      return (
        <Chip
          icon={<ScheduleIcon />}
          label="Due tomorrow"
          color="warning"
          size="small"
        />
      );
    }

    return (
      <Chip
        icon={<ScheduleIcon />}
        label={`Due: ${format(dueDate, 'MMM dd, yyyy')}`}
        color="default"
        size="small"
      />
    );
  };

  const getAssigneeDisplay = () => {
    if (!todo.assignee) return null;

    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Avatar sx={{ width: 24, height: 24 }}>
          {todo.assignee.firstName.charAt(0)}{todo.assignee.lastName.charAt(0)}
        </Avatar>
        <Typography variant="body2">
          {todo.assignee.firstName} {todo.assignee.lastName}
        </Typography>
      </Box>
    );
  };

  const getTeamDisplay = () => {
    if (!todo.team) return null;

    return (
      <Box display="flex" alignItems="center" gap={1}>
        <GroupIcon fontSize="small" />
        <Typography variant="body2">
          {todo.team.name}
        </Typography>
      </Box>
    );
  };

  const canEdit = todo.createdById === currentUser.id || todo.assigneeId === currentUser.id;

  return (
    <>
      <Card sx={{ mb: 2, position: 'relative' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h6" component="div">
                  {todo.title}
                </Typography>
                <Chip
                  icon={priorityConfig[todo.priority].icon}
                  label={priorityConfig[todo.priority].label}
                  color={priorityConfig[todo.priority].color as any}
                  size="small"
                />
                <Chip
                  icon={statusConfig[todo.status].icon}
                  label={statusConfig[todo.status].label}
                  color={statusConfig[todo.status].color as any}
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                {todo.description}
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {getDueDateDisplay()}
                {getAssigneeDisplay()}
                {getTeamDisplay()}
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" color="text.secondary">
                  Created by:
                </Typography>
                <Avatar sx={{ width: 20, height: 20 }}>
                  {todo.createdBy.firstName.charAt(0)}{todo.createdBy.lastName.charAt(0)}
                </Avatar>
                <Typography variant="caption">
                  {todo.createdBy.firstName} {todo.createdBy.lastName}
                </Typography>
              </Box>
            </Box>

            {canEdit && (
              <IconButton
                aria-label="more"
                aria-controls={open ? 'todo-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
        </CardContent>

        <CardActions>
          <Button
            size="small"
            startIcon={<AssignmentIcon />}
            onClick={handleAssign}
            disabled={loading}
          >
            Assign
          </Button>
        </CardActions>

        {/* Todo Menu */}
        <Menu
          id="todo-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'todo-menu-button',
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Task</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleAssign}>
            <ListItemIcon>
              <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Assign Task</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={() => handleStatusChange(TodoStatus.PENDING)}>
            <ListItemIcon>
              <PendingIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as Pending</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleStatusChange(TodoStatus.IN_PROGRESS)}>
            <ListItemIcon>
              <InProgressIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as In Progress</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleStatusChange(TodoStatus.COMPLETED)}>
            <ListItemIcon>
              <CompletedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as Completed</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleStatusChange(TodoStatus.CANCELLED)}>
            <ListItemIcon>
              <CancelledIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as Cancelled</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Task</ListItemText>
          </MenuItem>
        </Menu>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value as TodoPriority })}
                    label="Priority"
                  >
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <MenuItem key={key} value={key}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {config.icon}
                          {config.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Due Date"
                  value={editData.dueDate ? new Date(editData.dueDate) : null}
                  onChange={(date) => setEditData({ ...editData, dueDate: date ? date.toISOString() : undefined })}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Assignee</InputLabel>
                  <Select
                    value={editData.assigneeId || ''}
                    onChange={(e) => setEditData({ ...editData, assigneeId: e.target.value as string })}
                    label="Assignee"
                  >
                    <MenuItem value="">
                      <em>Unassigned</em>
                    </MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 24, height: 24 }}>
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </Avatar>
                          <Typography>
                            {user.firstName} {user.lastName}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Task</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select a team member to assign this task to:
          </Typography>
          <Box sx={{ mt: 2 }}>
            {users.map((user) => (
              <MenuItem
                key={user.id}
                onClick={() => handleAssignSubmit(user.id)}
                sx={{ py: 1 }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar>
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TodoItem;