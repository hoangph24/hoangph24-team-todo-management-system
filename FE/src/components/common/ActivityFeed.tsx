import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Task as TaskIcon,
  Group as TeamIcon,
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { useWebSocket } from '../../hooks/useWebSocket';

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  data?: any;
}

const ActivityFeed: React.FC = () => {
  const { activityFeed, clearActivity, connected } = useWebSocket();
  const [showAll, setShowAll] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_created':
        return <AssignmentIcon color="primary" />;
      case 'task_updated':
        return <EditIcon color="info" />;
      case 'task_completed':
        return <CheckCircleIcon color="success" />;
      case 'task_deleted':
        return <DeleteIcon color="error" />;
      case 'task_assigned':
        return <AssignmentIcon color="warning" />;
      case 'team_created':
        return <TeamIcon color="primary" />;
      case 'team_updated':
        return <EditIcon color="info" />;
      case 'team_deleted':
        return <DeleteIcon color="error" />;
      case 'member_added':
        return <AddIcon color="success" />;
      case 'member_removed':
        return <RemoveIcon color="error" />;
      case 'user_joined':
        return <PersonIcon color="primary" />;
      case 'user_left':
        return <PersonIcon color="secondary" />;
      default:
        return <TimelineIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_created':
      case 'team_created':
      case 'member_added':
      case 'user_joined':
        return 'success';
      case 'task_updated':
      case 'team_updated':
        return 'info';
      case 'task_completed':
        return 'success';
      case 'task_deleted':
      case 'team_deleted':
      case 'member_removed':
      case 'user_left':
        return 'error';
      case 'task_assigned':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getActivityTitle = (activity: Activity) => {
    switch (activity.type) {
      case 'task_created':
        return 'Task Created';
      case 'task_updated':
        return 'Task Updated';
      case 'task_completed':
        return 'Task Completed';
      case 'task_deleted':
        return 'Task Deleted';
      case 'task_assigned':
        return 'Task Assigned';
      case 'team_created':
        return 'Team Created';
      case 'team_updated':
        return 'Team Updated';
      case 'team_deleted':
        return 'Team Deleted';
      case 'member_added':
        return 'Member Added';
      case 'member_removed':
        return 'Member Removed';
      case 'user_joined':
        return 'User Joined';
      case 'user_left':
        return 'User Left';
      default:
        return 'Activity';
    }
  };

  const getDisplayedActivities = () => {
    return showAll ? activityFeed : activityFeed.slice(0, 10);
  };

  const displayedActivities = getDisplayedActivities();

  if (!connected) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TimelineIcon />
            <Typography variant="h6">Activity Feed</Typography>
          </Box>
          <Alert severity="info">
            Connect to WebSocket to see real-time activities
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <TimelineIcon />
            <Typography variant="h6">Activity Feed</Typography>
            {activityFeed.length > 0 && (
              <Chip
                label={activityFeed.length}
                size="small"
                color="primary"
              />
            )}
          </Box>
          <Box display="flex" gap={1}>
            {activityFeed.length > 10 && (
              <Button
                size="small"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : 'Show All'}
              </Button>
            )}
            {activityFeed.length > 0 && (
              <Tooltip title="Clear all activities">
                <IconButton
                  size="small"
                  onClick={clearActivity}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {activityFeed.length === 0 ? (
          <Box textAlign="center" py={4}>
            <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No activities yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Activities will appear here as they happen
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {displayedActivities.map((activity: Activity, index) => (
              <React.Fragment key={activity.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'background.paper' }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" fontWeight="medium">
                          {getActivityTitle(activity)}
                        </Typography>
                        <Chip
                          label={activity.type.replace('_', ' ')}
                          size="small"
                          color={getActivityColor(activity.type) as any}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <Avatar sx={{ width: 16, height: 16 }}>
                            {activity.user.firstName.charAt(0)}{activity.user.lastName.charAt(0)}
                          </Avatar>
                          <Typography variant="caption" color="text.secondary">
                            {activity.user.firstName} {activity.user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            •
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </Typography>
                        </Box>
                        {activity.data && (
                          <Box mt={1}>
                            <Typography variant="caption" color="text.secondary">
                              {JSON.stringify(activity.data, null, 2)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < displayedActivities.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {activityFeed.length > 10 && !showAll && (
          <Box textAlign="center" mt={2}>
            <Button
              size="small"
              onClick={() => setShowAll(true)}
            >
              Show {activityFeed.length - 10} more activities
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );


};

export default ActivityFeed; 