import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Task as TaskIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface NotificationPopupProps {
  notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
    timestamp: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  notification,
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const [autoHideDuration, setAutoHideDuration] = useState(6000);

  useEffect(() => {
    if (notification) {
      // Reset auto-hide duration when new notification arrives
      setAutoHideDuration(6000);
    }
  }, [notification]);

  const handleClose = () => {
    onClose();
  };

  const handleViewTask = () => {
    if (notification?.type?.startsWith('todo_') && notification?.data?.id) {
      // Navigate to todos page and scroll to the specific task
      navigate('/todos', { 
        state: { 
          scrollToTask: notification.data.id,
          highlightTask: notification.data.id 
        } 
      });
    } else if (notification?.type?.startsWith('team_') && notification?.data?.team?.id) {
      // Navigate to teams page
      navigate('/teams');
    } else {
      // Navigate to dashboard
      navigate('/dashboard');
    }
    onClose();
  };

  const getNotificationIcon = () => {
    switch (notification?.type) {
      case 'todo_assigned':
        return <AssignmentIcon color="primary" />;
      case 'todo_created':
        return <TaskIcon color="success" />;
      case 'todo_updated':
        return <TaskIcon color="info" />;
      case 'todo_status_changed':
        return <TaskIcon color="warning" />;
      case 'team_member_added':
        return <PersonIcon color="success" />;
      case 'team_member_removed':
        return <PersonIcon color="error" />;
      default:
        return <TaskIcon />;
    }
  };

  const getNotificationColor = () => {
    switch (notification?.type) {
      case 'todo_assigned':
        return 'info';
      case 'todo_created':
        return 'success';
      case 'todo_updated':
        return 'warning';
      case 'todo_status_changed':
        return 'info';
      case 'team_member_added':
        return 'success';
      case 'team_member_removed':
        return 'error';
      default:
        return 'info';
    }
  };

  if (!notification) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ 
        '& .MuiSnackbar-root': {
          top: 80, // Below the app bar
        }
      }}
    >
      <Alert
        severity={getNotificationColor()}
        onClose={handleClose}
        sx={{
          width: '100%',
          maxWidth: 400,
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleViewTask}
            sx={{ textTransform: 'none' }}
          >
            View
          </Button>
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          {getNotificationIcon()}
          <Box sx={{ flex: 1 }}>
            <AlertTitle sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {notification.title}
            </AlertTitle>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {notification.message}
            </Typography>
            
            {notification.data && (
              <Box sx={{ mt: 1 }}>
                {/* Show priority and status for todo notifications */}
                {notification.type?.startsWith('todo_') && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={notification.data.priority || 'Medium'}
                      size="small"
                      color={notification.data.priority === 'high' ? 'error' : 
                             notification.data.priority === 'low' ? 'success' : 'warning'}
                    />
                    <Chip
                      label={notification.data.status || 'Pending'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                )}
                
                {/* Show assignee for todo notifications */}
                {notification.type?.startsWith('todo_') && notification.data.assignee && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="caption">
                      Assigned to: {notification.data.assignee.firstName} {notification.data.assignee.lastName}
                    </Typography>
                  </Box>
                )}
                
                {/* Show team information */}
                {notification.data.team && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Avatar sx={{ width: 16, height: 16, fontSize: '0.6rem' }}>
                      {notification.data.team.name.charAt(0)}
                    </Avatar>
                    <Typography variant="caption">
                      Team: {notification.data.team.name}
                    </Typography>
                  </Box>
                )}
                
                {/* Show member information for team notifications */}
                {notification.type?.startsWith('team_') && notification.data.member && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="caption">
                      Member: {notification.data.member.firstName} {notification.data.member.lastName}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {format(new Date(notification.timestamp), 'MMM dd, yyyy HH:mm')}
            </Typography>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificationPopup; 