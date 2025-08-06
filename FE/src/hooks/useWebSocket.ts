import { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  connectWebSocket,
  disconnectWebSocket,
  joinRoom,
  leaveRoom,
  sendMessage,
  addEvent,
  addNotification,
  addActivity,
  markNotificationAsRead,
  clearNotifications,
  clearActivityFeed,
} from '../store/slices/websocketSlice';
import websocketService from '../services/websocket';
import autoJoinService from '../services/autoJoinService';
import { WebSocketEvent } from '../types';

export const useWebSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connected, connecting, error, events, joinedRooms, messages, notifications, activityFeed } = useSelector(
    (state: RootState) => state.websocket
  );
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const eventListenersRef = useRef<Map<string, Function[]>>(new Map());
  const hasAttemptedConnect = useRef(false);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (isAuthenticated && user) {
      try {
        console.log('Attempting to connect WebSocket...');
        await dispatch(connectWebSocket()).unwrap();
        console.log('WebSocket connected successfully');
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        // Don't throw error to prevent app crash
      }
    }
  }, [dispatch, isAuthenticated, user]);

  // Disconnect from WebSocket
  const disconnect = useCallback(async () => {
    try {
      await dispatch(disconnectWebSocket()).unwrap();
      console.log('WebSocket disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect WebSocket:', error);
    }
  }, [dispatch]);

  // Join a room
  const join = useCallback(async (roomId: string) => {
    try {
      await dispatch(joinRoom(roomId)).unwrap();
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  }, [dispatch]);

  // Leave a room
  const leave = useCallback(async (roomId: string) => {
    try {
      await dispatch(leaveRoom(roomId)).unwrap();
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  }, [dispatch]);

  // Send a message to a room
  const send = useCallback(async (roomId: string, message: string) => {
    try {
      await dispatch(sendMessage({ roomId, message })).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [dispatch]);

  // Add event listener
  const on = useCallback((event: string, callback: Function) => {
    if (!eventListenersRef.current.has(event)) {
      eventListenersRef.current.set(event, []);
    }
    eventListenersRef.current.get(event)?.push(callback);
    
    // Also register with WebSocket service
    websocketService.on(event, callback);
  }, []);

  // Remove event listener
  const off = useCallback((event: string, callback?: Function) => {
    const listeners = eventListenersRef.current.get(event);
    if (listeners) {
      if (callback) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      } else {
        eventListenersRef.current.delete(event);
      }
    }
    
    // Also unregister from WebSocket service
    websocketService.off(event, callback);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  }, [dispatch]);

  // Clear notifications
  const clearNotifs = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  // Clear activity feed
  const clearActivity = useCallback(() => {
    dispatch(clearActivityFeed());
  }, [dispatch]);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && !connected && !connecting && !hasAttemptedConnect.current) {
      try {
        console.log('Attempting WebSocket connection...');
        hasAttemptedConnect.current = true;
        connect().catch((error) => {
          console.error('Error in WebSocket auto-connect:', error);
          hasAttemptedConnect.current = false; // Reset on error
        });
      } catch (error) {
        console.error('Error in WebSocket auto-connect:', error);
        hasAttemptedConnect.current = false; // Reset on error
      }
    }
  }, [isAuthenticated, user, connected, connecting, connect]);

  // Re-authenticate when user changes
  useEffect(() => {
    if (connected && isAuthenticated && user) {
      websocketService.reAuthenticate();
    }
  }, [connected, isAuthenticated, user?.id]);

  // Auto-join teams when WebSocket is connected
  useEffect(() => {
    if (connected && isAuthenticated && user) {
      autoJoinService.checkAndJoin();
    }
  }, [connected, isAuthenticated, user]);

  // Auto-disconnect when user logs out
  useEffect(() => {
    if (!isAuthenticated && connected) {
      autoJoinService.leaveAllTeams();
      disconnect();
      hasAttemptedConnect.current = false; // Reset flag when user logs out
    }
  }, [isAuthenticated, connected, disconnect]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      eventListenersRef.current.clear();
    };
  }, []);

  // Listen for WebSocket events and dispatch to Redux
  useEffect(() => {
    const handleEvent = (event: WebSocketEvent) => {
      try {
        dispatch(addEvent(event));
      } catch (error) {
        console.error('Error handling WebSocket event:', error);
      }
    };

    const handleNotification = (notification: any) => {
      try {
        dispatch(addNotification(notification));
      } catch (error) {
        console.error('Error handling notification:', error);
      }
    };

    const handleActivity = (activity: any) => {
      try {
        dispatch(addActivity(activity));
      } catch (error) {
        console.error('Error handling activity:', error);
      }
    };

    // Register event listeners
    websocketService.on('todo:created', handleEvent);
    websocketService.on('todo:updated', handleEvent);
    websocketService.on('todo:deleted', handleEvent);
    websocketService.on('todo:assigned', handleEvent);
    websocketService.on('todo:status_changed', handleEvent);
    websocketService.on('team:created', handleEvent);
    websocketService.on('team:updated', handleEvent);
    websocketService.on('team:deleted', handleEvent);
    websocketService.on('team:member_added', handleEvent);
    websocketService.on('team:member_removed', handleEvent);
    websocketService.on('user:joined', handleEvent);
    websocketService.on('user:left', handleEvent);
    websocketService.on('activity:created', handleActivity);
    websocketService.on('notification:received', handleNotification);

    return () => {
      websocketService.off('todo:created');
      websocketService.off('todo:updated');
      websocketService.off('todo:deleted');
      websocketService.off('todo:assigned');
      websocketService.off('todo:status_changed');
      websocketService.off('team:created');
      websocketService.off('team:updated');
      websocketService.off('team:deleted');
      websocketService.off('team:member_added');
      websocketService.off('team:member_removed');
      websocketService.off('user:joined');
      websocketService.off('user:left');
      websocketService.off('activity:created');
      websocketService.off('notification:received');
    };
  }, [dispatch]);

  return {
    // State
    connected,
    connecting,
    error,
    events,
    joinedRooms,
    messages,
    notifications,
    activityFeed,
    
    // Actions
    connect,
    disconnect,
    join,
    leave,
    send,
    on,
    off,
    markAsRead,
    clearNotifs,
    clearActivity,
    
    // Utility
    isConnected: connected && !connecting,
  };
}; 