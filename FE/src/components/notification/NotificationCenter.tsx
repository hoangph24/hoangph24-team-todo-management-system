import React, { useState } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Menu,
  ListItemText,
  Typography,
  Divider,
  Button,
  Chip,
  Avatar,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsNone as NotificationsNoneIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Task as TaskIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useWebSocket } from '../../hooks/useWebSocket';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    type: string;
    data: any;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const NotificationCenter: React.FC = () => {
  const { notifications, markAsRead, clearNotifs } = useWebSocket();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    handleClose();
    
    // Handle notification action if present
    if (notification.action) {
      // TODO: Implement action handling
      console.log('Notification action:', notification.action);
    }
  };

  const handleClearAll = () => {
    clearNotifs();
    handleClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'task_assigned':
        return <AssignmentIcon />;
      case 'team_joined':
        return <GroupIcon />;
      case 'task_completed':
        return <TaskIcon />;
      case 'user_joined':
        return <PersonIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const unreadCount = getUnreadCount();

  return (
    <Box>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleClick}
          sx={{ color: 'inherit' }}
        >
          <Badge badgeContent={unreadCount} color="error">
            {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Notifications
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
             {notifications.length > 0 && (
               <Button
                 size="small"
                 startIcon={<ClearIcon />}
                 onClick={handleClearAll}
               >
                 Clear All
               </Button>
             )}
          </Box>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification: Notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    button
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.paper' }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: notification.read ? 'normal' : 'bold',
                            }}
                          >
                            {notification.title}
                          </Typography>
                          {notification.action && (
                            <Chip
                              icon={getActionIcon(notification.action.type)}
                              label={notification.action.type.replace('_', ' ')}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(notification.timestamp), 'MMM dd, yyyy HH:mm')}
                          </Typography>
                          {notification.user && (
                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                              <Avatar sx={{ width: 16, height: 16 }}>
                                {notification.user.firstName.charAt(0)}{notification.user.lastName.charAt(0)}
                              </Avatar>
                              <Typography variant="caption" color="text.secondary">
                                {notification.user.firstName} {notification.user.lastName}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    {!notification.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              fullWidth
              startIcon={<MarkEmailReadIcon />}
              onClick={() => {
                notifications.forEach(n => {
                  if (!n.read) {
                    markAsRead(n.id);
                  }
                });
                handleClose();
              }}
            >
              Mark All as Read
            </Button>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default NotificationCenter; 