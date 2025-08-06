import { io, Socket } from 'socket.io-client';
import { WebSocketState } from '../types';
import { store } from '../store';
import { 
  addTodo, 
  updateTodoRealTime, 
  removeTodo
} from '../store/slices/todoSlice';
import { 
  addTeam as addTeamToStore,
  updateTeamRealTime as updateTeamRealTimeInStore,
  removeTeam as removeTeamFromStore
} from '../store/slices/teamSlice';
import { addNotification } from '../store/slices/websocketSlice';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private eventListeners: Map<string, Function[]> = new Map();

  // Connection state
  private _connected = false;
  private _connecting = false;
  private _error: string | null = null;

  get connected() {
    return this._connected;
  }

  get connecting() {
    return this._connecting;
  }

  get error() {
    return this._error;
  }

  // Initialize WebSocket connection
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        console.log('WebSocket connection timeout, resolving anyway...');
        this._connecting = false;
        this.isConnecting = false;
        resolve();
      }, 6000); // 6 seconds timeout
      
      // If already connected, resolve immediately
      if (this.socket?.connected) {
        console.log('WebSocket already connected');
        resolve();
        return;
      }

      // If connection is in progress, wait for it to complete
      if (this.isConnecting) {
        console.log('WebSocket connection already in progress, waiting...');
        // Wait for connection to complete
        const checkConnection = () => {
          if (this._connected) {
            resolve();
          } else if (!this.isConnecting) {
            // Connection failed, try again
            this.connect().then(resolve).catch(reject);
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
        return;
      }

      this.isConnecting = true;
      this._connecting = true;
      this._error = null;

      try {
        this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3000', {
          transports: ['websocket', 'polling'],
          timeout: 5000, // Reduced timeout
          reconnection: false,
          reconnectionAttempts: 0,
          reconnectionDelay: 1000,
          path: '/socket.io/', // Explicit Socket.IO path
        });

        // Connection event handlers
        this.socket.on('connect', () => {
          console.log('WebSocket connected successfully');
          this._connected = true;
          this._connecting = false;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this._error = null;
          clearTimeout(timeout);
          
          // Authenticate user immediately after connection
          const user = store.getState().auth.user;
          if (user) {
            this.socket?.emit('authenticate', user.id);
            console.log('Authenticated user after connection:', user.id);
          }
          
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          this._connected = false;
          this._connecting = false;
          this.isConnecting = false;
          
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            this.socket?.connect();
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          this._error = error.message;
          this._connecting = false;
          this.isConnecting = false;
          console.log('WebSocket connection failed, but continuing...');
          clearTimeout(timeout);
          resolve();
        });

        this.socket.on('reconnect', (attemptNumber) => {
          console.log('WebSocket reconnected after', attemptNumber, 'attempts');
          this._connected = true;
          this._connecting = false;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this._error = null;
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
          console.log('WebSocket reconnection attempt:', attemptNumber);
          this.reconnectAttempts = attemptNumber;
          this._connecting = true;
        });

        this.socket.on('reconnect_failed', () => {
          console.error('WebSocket reconnection failed');
          this._error = 'Failed to reconnect after maximum attempts';
          this._connecting = false;
          this.isConnecting = false;
        });

        // Real-time event handlers
        this.setupEventHandlers();

        // Authenticate user if we have user data
        const user = store.getState().auth.user;
        if (user) {
          this.socket.emit('authenticate', user.id);
          console.log('Authenticated user:', user.id);
        }

      } catch (error) {
        this.isConnecting = false;
        this._connecting = false;
        this._error = error instanceof Error ? error.message : 'Connection failed';
        reject(error);
      }
    });
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this._connected = false;
      this._connecting = false;
      this.isConnecting = false;
      this._error = null;
      this.eventListeners.clear();
    }
  }

  // Setup real-time event handlers
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Todo events
    this.socket.on('todo:created', (data: any) => {
      console.log('Todo created:', data);
      try {
        store.dispatch(addTodo(data));
      } catch (error) {
        console.error('Error dispatching todo created:', error);
      }
      this.emit('todo:created', data);
    });

    this.socket.on('todo:updated', (data: any) => {
      console.log('Todo updated:', data);
      try {
        store.dispatch(updateTodoRealTime(data));
      } catch (error) {
        console.error('Error dispatching todo updated:', error);
      }
      this.emit('todo:updated', data);
    });

    this.socket.on('todo:deleted', (data: { id: string }) => {
      console.log('Todo deleted:', data);
      try {
        store.dispatch(removeTodo(data.id));
      } catch (error) {
        console.error('Error dispatching todo deleted:', error);
      }
      this.emit('todo:deleted', data);
    });

    this.socket.on('todo:assigned', (data: any) => {
      console.log('Todo assigned:', data);
      try {
        store.dispatch(updateTodoRealTime(data));
      } catch (error) {
        console.error('Error dispatching todo assigned:', error);
      }
      this.emit('todo:assigned', data);
    });

    this.socket.on('todo:status_changed', (data: any) => {
      console.log('Todo status changed:', data);
      try {
        store.dispatch(updateTodoRealTime(data));
      } catch (error) {
        console.error('Error dispatching todo status changed:', error);
      }
      this.emit('todo:status_changed', data);
    });

    // Team events
    this.socket.on('team:created', (data: any) => {
      console.log('Team created:', data);
      try {
        store.dispatch(addTeamToStore(data));
      } catch (error) {
        console.error('Error dispatching team created:', error);
      }
      this.emit('team:created', data);
    });

    this.socket.on('team:updated', (data: any) => {
      console.log('Team updated:', data);
      try {
        store.dispatch(updateTeamRealTimeInStore(data));
      } catch (error) {
        console.error('Error dispatching team updated:', error);
      }
      this.emit('team:updated', data);
    });

    this.socket.on('team:deleted', (data: { id: string }) => {
      console.log('Team deleted:', data);
      try {
        store.dispatch(removeTeamFromStore(data.id));
      } catch (error) {
        console.error('Error dispatching team deleted:', error);
      }
      this.emit('team:deleted', data);
    });

    this.socket.on('team:member_added', (data: any) => {
      console.log('Team member added:', data);
      try {
        store.dispatch(updateTeamRealTimeInStore(data.team));
      } catch (error) {
        console.error('Error dispatching team member added:', error);
      }
      this.emit('team:member_added', data);
    });

    this.socket.on('team:member_removed', (data: any) => {
      console.log('Team member removed:', data);
      try {
        // Update team data if available
        if (data.team) {
          store.dispatch(updateTeamRealTimeInStore(data.team));
        }
      } catch (error) {
        console.error('Error dispatching team member removed:', error);
      }
      this.emit('team:member_removed', data);
    });

    // User events
    this.socket.on('user:joined', (data: any) => {
      console.log('User joined:', data);
      this.emit('user:joined', data);
    });

    this.socket.on('user:left', (data: any) => {
      console.log('User left:', data);
      this.emit('user:left', data);
    });

    // Activity events
    this.socket.on('activity:created', (data: any) => {
      console.log('Activity created:', data);
      this.emit('activity:created', data);
    });

    // Notification events
    this.socket.on('notification:received', (data: any) => {
      // Add notification to Redux store
      try {
        store.dispatch(addNotification(data));
      } catch (error) {
        console.error('Error dispatching notification:', error);
      }
      this.emit('notification:received', data);
    });

    // Error events
    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
      this._error = error.message;
      this.emit('error', error);
    });
  }

  // Join a room (team or todo)
  joinRoom(roomId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join-team', roomId);
      console.log('Joined room:', roomId);
    }
  }

  // Leave a room
  leaveRoom(roomId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave-team', roomId);
      console.log('Left room:', roomId);
    }
  }

  // Send a message to a room
  sendMessage(roomId: string, message: string): void {
    if (this.socket?.connected) {
      this.socket.emit('message:send', { roomId, message });
    }
  }

  // Authenticate user
  authenticate(userId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('authenticate', userId);
      console.log('Authenticated user:', userId);
    }
  }

  // Re-authenticate user (useful when user data changes)
  reAuthenticate(): void {
    const user = store.getState().auth.user;
    if (user && this.socket?.connected) {
      this.socket.emit('authenticate', user.id);
      console.log('Re-authenticated user:', user.id);
    }
  }

  // Emit custom event
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  // Add event listener
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  // Remove event listener
  off(event: string, callback?: Function): void {
    if (!callback) {
      this.eventListeners.delete(event);
    } else {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  // Get connection state
  getState(): WebSocketState {
    return {
      connected: this._connected,
      connecting: this._connecting,
      error: this._error,
    };
  }

  // Check if connected
  isConnected(): boolean {
    return this._connected && this.socket?.connected === true;
  }

  // Get socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 