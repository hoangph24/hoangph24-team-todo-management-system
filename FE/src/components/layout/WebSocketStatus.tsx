import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Chip, Box, Typography } from '@mui/material';
import {
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Sync as SyncIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const WebSocketStatus: React.FC = () => {
  const { connected, connecting, error } = useWebSocket();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = () => {
    if (error) return 'error';
    if (connecting) return 'warning';
    if (connected) return 'success';
    return 'default';
  };

  const getStatusIcon = () => {
    if (error) return <ErrorIcon />;
    if (connecting) return <SyncIcon />;
    if (connected) return <WifiIcon />;
    return <WifiOffIcon />;
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (connecting) return 'Connecting...';
    if (connected) return 'Connected';
    return 'Disconnected';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        icon={getStatusIcon()}
        label={getStatusText()}
        color={getStatusColor()}
        size="small"
        variant={connected ? 'filled' : 'outlined'}
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ maxWidth: 200 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default WebSocketStatus; 