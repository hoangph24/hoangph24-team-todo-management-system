import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/auth';
import { useWebSocket } from '../../hooks/useWebSocket';
import NotificationCenter from '../notification/NotificationCenter';
import WebSocketStatus from './WebSocketStatus';
import GlobalNotificationManager from '../notification/GlobalNotificationManager';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { disconnect } = useWebSocket();

  const handleLogout = async () => {
    try {
      // Disconnect WebSocket first
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting WebSocket:', error);
    }
    
    // Clear auth data
    authService.clearToken();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Team Todo App
          </Typography>
          
          {/* WebSocket Status */}
          <Box sx={{ mr: 1 }}>
            <WebSocketStatus />
          </Box>
          
          {/* Notification Center */}
          <Box sx={{ mr: 2 }}>
            <NotificationCenter />
          </Box>
          
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box mt={4}>{children}</Box>
      
      {/* Global Notification Manager */}
      <GlobalNotificationManager />
    </Box>
  );
};

export default Layout;