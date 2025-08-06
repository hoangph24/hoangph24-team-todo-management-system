import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  Button,
  Divider,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  AutoAwesome as AutoAwesomeIcon,
  PriorityHigh as PriorityHighIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface SmartNotification {
  id: string;
  type: 'deadline_reminder' | 'workload_alert' | 'collaboration_opportunity' | 'productivity_tip' | 'conflict_warning' | 'optimization_suggestion';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  action?: {
    type: string;
    data: any;
  };
  read: boolean;
}

const SmartNotifications: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      loadSmartNotifications();
    }
  }, [user]);

  const loadSmartNotifications = async () => {
    if (!user) return;

    setLoadingNotifications(true);
    try {
      // Simulate AI-generated notifications
      const mockNotifications: SmartNotification[] = [
        {
          id: '1',
          type: 'deadline_reminder',
          title: 'Upcoming Deadline',
          message: 'You have 3 tasks due within the next 24 hours. Consider prioritizing urgent items.',
          priority: 'high',
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: '2',
          type: 'workload_alert',
          title: 'Workload Balance',
          message: 'Your current workload is 20% above optimal. Consider delegating some tasks.',
          priority: 'medium',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
        },
        {
          id: '3',
          type: 'collaboration_opportunity',
          title: 'Team Collaboration',
          message: 'John and Sarah are working on similar tasks. Consider combining efforts.',
          priority: 'low',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true,
        },
        {
          id: '4',
          type: 'productivity_tip',
          title: 'Productivity Insight',
          message: 'You\'re most productive between 9-11 AM. Schedule complex tasks during this time.',
          priority: 'low',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          read: true,
        },
        {
          id: '5',
          type: 'conflict_warning',
          title: 'Schedule Conflict',
          message: 'New task conflicts with existing deadline. Consider adjusting timeline.',
          priority: 'high',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          read: false,
        },
        {
          id: '6',
          type: 'optimization_suggestion',
          title: 'Process Optimization',
          message: 'AI suggests batching similar tasks to improve efficiency by 15%.',
          priority: 'medium',
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          read: false,
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading smart notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline_reminder':
        return <ScheduleIcon color="error" />;
      case 'workload_alert':
        return <WarningIcon color="warning" />;
      case 'collaboration_opportunity':
        return <GroupIcon color="primary" />;
      case 'productivity_tip':
        return <TrendingUpIcon color="success" />;
      case 'conflict_warning':
        return <PriorityHighIcon color="error" />;
      case 'optimization_suggestion':
        return <PsychologyIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
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

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            Please log in to view smart notifications
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
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6">Smart Notifications</Typography>
            <Badge badgeContent={getUnreadCount()} color="error">
              <NotificationsIcon color="action" />
            </Badge>
          </Box>
          <Box display="flex" gap={1}>
            <IconButton
              size="small"
              onClick={loadSmartNotifications}
              disabled={loadingNotifications}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          {loadingNotifications ? (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length > 0 ? (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {notifications.length} notifications
                </Typography>
                {getUnreadCount() > 0 && (
                  <Button
                    size="small"
                    onClick={markAllAsRead}
                    variant="text"
                  >
                    Mark all as read
                  </Button>
                )}
              </Box>

              <List>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        bgcolor: notification.read ? 'transparent' : 'action.hover',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemIcon>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              variant="body2"
                              fontWeight={notification.read ? 'normal' : 'medium'}
                            >
                              {notification.title}
                            </Typography>
                            <Chip
                              label={notification.priority}
                              size="small"
                              color={getNotificationColor(notification.priority) as any}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" mb={0.5}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(notification.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                      {!notification.read && (
                        <IconButton
                          size="small"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircleIcon color="success" />
                        </IconButton>
                      )}
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          ) : (
            <Box textAlign="center" py={3}>
              <NotificationsIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No smart notifications available
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AI will generate notifications based on your activity
              </Typography>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SmartNotifications; 