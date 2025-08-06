import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Grid,
  IconButton,
  Collapse,
  Divider,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { TodoFilters as TodoFiltersType, TodoStatus, TodoPriority, Team, User } from '../../types';

interface TodoFiltersProps {
  filters: TodoFiltersType;
  onFiltersChange: (filters: TodoFiltersType) => void;
  teams: Team[];
  users: User[];
  currentUser: User;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({
  filters,
  onFiltersChange,
  teams,
  users,
  currentUser,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<TodoFiltersType>(filters);

  const handleFilterChange = (field: keyof TodoFiltersType, value: any) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: TodoFiltersType = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== '').length;
  };

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.COMPLETED:
        return 'success';
      case TodoStatus.IN_PROGRESS:
        return 'primary';
      case TodoStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
      case TodoPriority.URGENT:
        return 'error';
      case TodoPriority.HIGH:
        return 'warning';
      case TodoPriority.MEDIUM:
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <FilterIcon />
            <Typography variant="h6">Filters</Typography>
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={getActiveFiltersCount()}
                color="primary"
                size="small"
              />
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {expanded ? 'Hide' : 'Show'} Filters
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Button
                size="small"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                color="error"
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            {/* Search */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Search tasks"
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                fullWidth
                placeholder="Search by title or description..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={localFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {Object.values(TodoStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={status.replace('_', ' ')}
                          color={getStatusColor(status) as any}
                          size="small"
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Priority Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={localFilters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  {Object.values(TodoPriority).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={priority}
                          color={getPriorityColor(priority) as any}
                          size="small"
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Team Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Team</InputLabel>
                <Select
                  value={localFilters.teamId || ''}
                  onChange={(e) => handleFilterChange('teamId', e.target.value)}
                  label="Team"
                >
                  <MenuItem value="">All Teams</MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
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

            {/* Assignee Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={localFilters.assigneeId || ''}
                  onChange={(e) => handleFilterChange('assigneeId', e.target.value)}
                  label="Assignee"
                >
                  <MenuItem value="">All Assignees</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
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

            {/* Overdue Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Due Date</InputLabel>
                <Select
                  value={localFilters.overdue ? 'overdue' : ''}
                  onChange={(e) => handleFilterChange('overdue', e.target.value === 'overdue')}
                  label="Due Date"
                >
                  <MenuItem value="">All Tasks</MenuItem>
                  <MenuItem value="overdue">Overdue Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Active Filters:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {filters.status && (
                  <Chip
                    label={`Status: ${filters.status.replace('_', ' ')}`}
                    color={getStatusColor(filters.status) as any}
                    size="small"
                    onDelete={() => handleFilterChange('status', undefined)}
                  />
                )}
                {filters.priority && (
                  <Chip
                    label={`Priority: ${filters.priority}`}
                    color={getPriorityColor(filters.priority) as any}
                    size="small"
                    onDelete={() => handleFilterChange('priority', undefined)}
                  />
                )}
                {filters.teamId && (
                  <Chip
                    label={`Team: ${teams.find(t => t.id === filters.teamId)?.name}`}
                    color="secondary"
                    size="small"
                    onDelete={() => handleFilterChange('teamId', undefined)}
                  />
                )}
                {filters.assigneeId && (
                  <Chip
                    label={`Assignee: ${users.find(u => u.id === filters.assigneeId)?.firstName} ${users.find(u => u.id === filters.assigneeId)?.lastName}`}
                    color="primary"
                    size="small"
                    onDelete={() => handleFilterChange('assigneeId', undefined)}
                  />
                )}
                {filters.overdue && (
                  <Chip
                    label="Overdue Only"
                    color="error"
                    size="small"
                    onDelete={() => handleFilterChange('overdue', undefined)}
                  />
                )}
                {filters.search && (
                  <Chip
                    label={`Search: "${filters.search}"`}
                    color="info"
                    size="small"
                    onDelete={() => handleFilterChange('search', undefined)}
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Action Buttons */}
          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              disabled={JSON.stringify(localFilters) === JSON.stringify(filters)}
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              disabled={getActiveFiltersCount() === 0}
            >
              Clear All
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default TodoFilters; 