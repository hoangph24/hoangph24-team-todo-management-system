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
  Card,
  CardContent,
  Collapse,
  IconButton,
  Tooltip,
  LinearProgress,
  SelectChangeEvent,
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  PriorityHigh as PriorityHighIcon,
  Remove as PriorityMediumIcon,
  KeyboardArrowDown as PriorityLowIcon,
  Warning as UrgentIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { CreateTodoRequest, Todo, Team, User, TodoPriority } from '../../types';
import { useAI } from '../../hooks/useAI';

interface AITodoFormProps {
  onSubmit: (data: CreateTodoRequest) => void;
  onCancel?: () => void;
  onClearError?: () => void;
  teams: Team[];
  users: User[];
  currentUser: User;
  loading?: boolean;
  error?: string | null;
  todo?: Todo | null;
}

const priorityOptions = [
  { value: TodoPriority.LOW, label: 'Low', icon: <PriorityLowIcon />, color: 'default' },
  { value: TodoPriority.MEDIUM, label: 'Medium', icon: <PriorityMediumIcon />, color: 'primary' },
  { value: TodoPriority.HIGH, label: 'High', icon: <PriorityHighIcon />, color: 'warning' },
  { value: TodoPriority.URGENT, label: 'Urgent', icon: <UrgentIcon />, color: 'error' },
];

const AITodoForm: React.FC<AITodoFormProps> = ({
  onSubmit,
  onCancel,
  onClearError,
  teams,
  users,
  currentUser,
  loading = false,
  error = null,
  todo = null,
}) => {
  const {
    dueDateSuggestion,
    complexityAnalysis,
    taskCategorization,
    detectedConflicts,
    loading: aiLoading,
    error: aiError,
    suggestDueDateForTask,
    analyzeTaskComplexity,
  } = useAI();

  const [formData, setFormData] = useState<CreateTodoRequest>({
    title: '',
    description: '',
    priority: TodoPriority.MEDIUM,
    dueDate: undefined,
    teamId: undefined,
    assigneeId: undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);

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

  // Auto-analyze when form data changes
  useEffect(() => {
    if (aiEnabled && formData.title && formData.description && !todo) {
      const analyzeWithAI = async () => {
        try {
          // Temporarily disabled AI API calls
          // await Promise.all([
          //   suggestDueDateForTask({
          //     title: formData.title,
          //     description: formData.description,
          //     priority: formData.priority || TodoPriority.MEDIUM,
          //     teamId: formData.teamId,
          //     assigneeId: formData.assigneeId,
          //   }),
          //   analyzeTaskComplexity({
          //     title: formData.title,
          //     description: formData.description,
          //     priority: formData.priority || TodoPriority.MEDIUM,
          //     teamId: formData.teamId,
          //     assigneeId: formData.assigneeId,
          //   }),
          //   categorizeTaskData({
          //     title: formData.title,
          //     description: formData.description,
          //   }),
          // ]);
        } catch (error) {
          console.error('Error analyzing with AI:', error);
        }
      };

      const timeoutId = setTimeout(analyzeWithAI, 1000); // Debounce
      return () => clearTimeout(timeoutId);
    }
  }, [formData, aiEnabled, todo, suggestDueDateForTask, analyzeTaskComplexity]);

  // Detect conflicts when form data changes
  useEffect(() => {
    if (aiEnabled && formData.title && formData.description && !todo) {
      const detectConflicts = async () => {
        try {
          // Temporarily disabled AI conflict detection
          // await detectConflictsForTask(currentUser.id, {
          //   title: formData.title,
          //   description: formData.description,
          //   estimatedHours: complexityAnalysis?.estimatedHours || 2,
          //   dueDate: formData.dueDate,
          // });
        } catch (error) {
          console.error('Error detecting conflicts:', error);
        }
      };

      const timeoutId = setTimeout(detectConflicts, 1500); // Debounce
      return () => clearTimeout(timeoutId);
    }
  }, [formData, aiEnabled, todo, currentUser.id, complexityAnalysis]);

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

  const applyAISuggestion = (suggestion: any) => {
    if (suggestion.dueDate) {
      setFormData(prev => ({ ...prev, dueDate: suggestion.dueDate }));
    }
    if (suggestion.priority) {
      setFormData(prev => ({ ...prev, priority: suggestion.priority }));
    }
    if (suggestion.teamId) {
      setFormData(prev => ({ ...prev, teamId: suggestion.teamId }));
    }
    if (suggestion.assigneeId) {
      setFormData(prev => ({ ...prev, assigneeId: suggestion.assigneeId }));
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

  const getConflictSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          mb: 3,
          maxWidth: '800px',
          mx: 'auto',
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
          border: 1,
          borderColor: 'divider'
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* AI Status */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <AutoAwesomeIcon color="primary" />
          <Typography variant="h6">AI-Enhanced Task Creation</Typography>
          <Tooltip title="Toggle AI features">
            <IconButton
              size="small"
              onClick={() => setAiEnabled(!aiEnabled)}
              color={aiEnabled ? 'primary' : 'default'}
            >
              <AutoAwesomeIcon />
            </IconButton>
          </Tooltip>
          {aiLoading.dueDateSuggestion || aiLoading.complexityAnalysis || aiLoading.taskCategorization && (
            <CircularProgress size={20} />
          )}
        </Box>

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

          {/* AI Insights */}
          {aiEnabled && (dueDateSuggestion || complexityAnalysis || taskCategorization || detectedConflicts.length > 0) && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PsychologyIcon color="primary" />
                      <Typography variant="h6">AI Insights</Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => setShowAIInsights(!showAIInsights)}
                    >
                      {showAIInsights ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={showAIInsights}>
                    <Grid container spacing={2}>
                      {/* Due Date Suggestion */}
                      {dueDateSuggestion && (
                        <Grid item xs={12} md={6}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <ScheduleIcon color="primary" />
                            <Typography variant="subtitle2">Due Date Suggestion</Typography>
                            <Chip
                              label={`${Math.round(dueDateSuggestion.confidence * 100)}% confidence`}
                              size="small"
                              color="primary"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            {dueDateSuggestion.reasoning}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => applyAISuggestion({ dueDate: dueDateSuggestion.suggestedDate })}
                          >
                            Apply Suggestion
                          </Button>
                        </Grid>
                      )}

                      {/* Complexity Analysis */}
                      {complexityAnalysis && (
                        <Grid item xs={12} md={6}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <PsychologyIcon color="secondary" />
                            <Typography variant="subtitle2">Complexity Analysis</Typography>
                            <Chip
                              label={complexityAnalysis.complexity}
                              size="small"
                              color={complexityAnalysis.complexity === 'high' ? 'error' : complexityAnalysis.complexity === 'medium' ? 'warning' : 'success'}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            Estimated: {complexityAnalysis.estimatedHours}h
                          </Typography>
                          <Box mb={1}>
                            <Typography variant="caption" color="text.secondary">
                              Factors: {complexityAnalysis.factors.join(', ')}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {/* Task Categorization */}
                      {taskCategorization && (
                        <Grid item xs={12} md={6}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <CategoryIcon color="info" />
                            <Typography variant="subtitle2">Task Categorization</Typography>
                            <Chip
                              label={`${Math.round(taskCategorization.confidence * 100)}% confidence`}
                              size="small"
                              color="info"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            Category: {taskCategorization.category}
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {taskCategorization.tags.map((tag, index) => (
                              <Chip key={index} label={tag} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Grid>
                      )}

                      {/* Conflict Detection */}
                      {detectedConflicts.length > 0 && (
                        <Grid item xs={12}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <WarningIcon color="warning" />
                            <Typography variant="subtitle2">Potential Conflicts</Typography>
                          </Box>
                          {detectedConflicts.map((conflict, index) => (
                            <Alert
                              key={index}
                              severity={getConflictSeverityColor(conflict.severity) as any}
                              sx={{ mb: 1 }}
                            >
                              <Typography variant="body2" fontWeight="medium">
                                {conflict.description}
                              </Typography>
                              {conflict.suggestions.length > 0 && (
                                <Typography variant="caption" display="block" mt={0.5}>
                                  Suggestions: {conflict.suggestions.join(', ')}
                                </Typography>
                              )}
                            </Alert>
                          ))}
                        </Grid>
                      )}
                    </Grid>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          )}

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
          {onCancel && (
            <Button
              type="button"
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AITodoForm; 