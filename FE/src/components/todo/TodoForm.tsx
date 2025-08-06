import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  AvatarGroup,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  PriorityHigh as PriorityHighIcon,
  Remove as PriorityMediumIcon,
  KeyboardArrowDown as PriorityLowIcon,
  Warning as UrgentIcon,
} from '@mui/icons-material';
import { CreateTodoRequest, Todo, Team, User, TodoPriority } from '../../types';

interface TodoFormProps {
  onSubmit: (data: CreateTodoRequest) => void;
  teams: Team[];
  users: User[];
  currentUser: User;
  loading?: boolean;
  error?: string | null;
  todo?: Todo | null; // For editing existing todo
}

const priorityOptions = [
  { value: TodoPriority.LOW, label: 'Low', icon: <PriorityLowIcon />, color: 'default' },
  { value: TodoPriority.MEDIUM, label: 'Medium', icon: <PriorityMediumIcon />, color: 'primary' },
  { value: TodoPriority.HIGH, label: 'High', icon: <PriorityHighIcon />, color: 'warning' },
  { value: TodoPriority.URGENT, label: 'Urgent', icon: <UrgentIcon />, color: 'error' },
];

const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  teams,
  users,
  currentUser,
  loading = false,
  error = null,
  todo = null,
}) => {
  const [formData, setFormData] = useState<CreateTodoRequest>({
    title: '',
    description: '',
    priority: TodoPriority.MEDIUM,
    dueDate: undefined,
    teamId: undefined,
    assigneeId: undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dueDate: todo.dueDate || undefined,
        teamId: todo.teamId || undefined,
        assigneeId: todo.assigneeId || undefined,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: TodoPriority.MEDIUM,
        dueDate: undefined,
        teamId: undefined,
        assigneeId: undefined,
      });
    }
    setErrors({});
  }, [todo]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Clean up the data before submitting
      const submitData: CreateTodoRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate,
        teamId: formData.teamId,
        assigneeId: formData.assigneeId,
      };

      onSubmit(submitData);
    }
  };

  const handleChange = (field: keyof CreateTodoRequest) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }> | SelectChangeEvent
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, dueDate: date ? date.toISOString() : undefined }));
    if (errors.dueDate) {
      setErrors(prev => ({ ...prev, dueDate: '' }));
    }
  };

  const getSelectedTeam = () => {
    return teams.find(team => team.id === formData.teamId);
  };

  const getSelectedAssignee = () => {
    return users.find(user => user.id === formData.assigneeId);
  };

  const getPriorityOption = (priority: TodoPriority) => {
    return priorityOptions.find(option => option.value === priority);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              label="Task Title"
              value={formData.title}
              onChange={handleChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
              disabled={loading}
              placeholder="Enter task title..."
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              fullWidth
              required
              multiline
              rows={3}
              disabled={loading}
              placeholder="Describe the task in detail..."
            />
          </Grid>

          {/* Priority */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.priority}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleChange('priority')}
                label="Priority"
                disabled={loading}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {option.icon}
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Due Date */}
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Due Date (Optional)"
              value={formData.dueDate ? new Date(formData.dueDate) : null}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dueDate,
                  helperText: errors.dueDate,
                  disabled: loading,
                },
              }}
            />
          </Grid>

          {/* Team Assignment */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Team (Optional)</InputLabel>
              <Select
                value={formData.teamId || ''}
                onChange={handleChange('teamId')}
                label="Team (Optional)"
                disabled={loading}
              >
                <MenuItem value="">
                  <em>No team assigned</em>
                </MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography>{team.name}</Typography>
                      <Chip
                        label={team.members.length}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Assignee */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Assignee (Optional)</InputLabel>
              <Select
                value={formData.assigneeId || ''}
                onChange={handleChange('assigneeId')}
                label="Assignee (Optional)"
                disabled={loading}
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

          {/* Selected Team Info */}
          {formData.teamId && getSelectedTeam() && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Team: {getSelectedTeam()?.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="text.secondary">
                    Members:
                  </Typography>
                  <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                    {getSelectedTeam()?.members.map((member) => (
                      <Avatar key={member.id} alt={`${member.firstName} ${member.lastName}`}>
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Selected Assignee Info */}
          {formData.assigneeId && getSelectedAssignee() && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Assigned to: {getSelectedAssignee()?.firstName} {getSelectedAssignee()?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getSelectedAssignee()?.email}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Priority Display */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Priority:
              </Typography>
              {formData.priority && getPriorityOption(formData.priority) && (
                <Chip
                  icon={getPriorityOption(formData.priority)?.icon}
                  label={getPriorityOption(formData.priority)?.label}
                  color={getPriorityOption(formData.priority)?.color as any}
                  size="small"
                />
              )}
            </Box>
          </Grid>
        </Grid>

        <Box display="flex" gap={2} mt={3}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Creating...' : (todo ? 'Update Task' : 'Create Task')}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default TodoForm;