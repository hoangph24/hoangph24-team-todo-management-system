import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebSocketState } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const JWT_STORAGE_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'team_todo_token';

const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
  });

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    setState(prev => ({ ...prev, connecting: true, error: null }));

    const token = localStorage.getItem(JWT_STORAGE_KEY);
    
    socketRef.current = io(WS_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      timeout: 5000,
    });

    // Connection events
    socketRef.current.on('connect', () => {
      setState({
        connected: true,
        connecting: false,
        error: null,
      });
      console.log('WebSocket connected');
    });

    socketRef.current.on('disconnect', () => {
      setState({
        connected: false,
        connecting: false,
        error: null,
      });
      console.log('WebSocket disconnected');
    });

    socketRef.current.on('connect_error', (error) => {
      setState({
        connected: false,
        connecting: false,
        error: error.message,
      });
      console.error('WebSocket connection error:', error);
    });

    socketRef.current.on('error', (error) => {
      setState(prev => ({
        ...prev,
        error: error.message,
      }));
      console.error('WebSocket error:', error);
    });
  }, []);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState({
        connected: false,
        connecting: false,
        error: null,
      });
    }
  }, []);

  // Join team room
  const joinTeam = useCallback((teamId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-team', teamId);
      console.log(`Joined team room: ${teamId}`);
    }
  }, []);

  // Leave team room
  const leaveTeam = useCallback((teamId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave-team', teamId);
      console.log(`Left team room: ${teamId}`);
    }
  }, []);

  // Authenticate user
  const authenticate = useCallback((userId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('authenticate', userId);
      console.log(`Authenticated user: ${userId}`);
    }
  }, []);

  // Listen to events
  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  // Remove event listener
  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.off(event);
      }
    }
  }, []);

  // Emit event
  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    state,
    connect,
    disconnect,
    joinTeam,
    leaveTeam,
    authenticate,
    on,
    off,
    emit,
  };
};

export default useSocket;