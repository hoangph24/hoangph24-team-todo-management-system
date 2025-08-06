import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WebSocketState, WebSocketEvent } from '../../types';
import websocketService from '../../services/websocket';
import { authService } from '../../services/auth';

// Async thunks
export const connectWebSocket = createAsyncThunk(
  'websocket/connect',
  async (_, { rejectWithValue }) => {
    try {
      await websocketService.connect();
      return websocketService.getState();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to connect to WebSocket');
    }
  }
);

export const disconnectWebSocket = createAsyncThunk(
  'websocket/disconnect',
  async (_, { rejectWithValue }) => {
    try {
      websocketService.disconnect();
      return websocketService.getState();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to disconnect WebSocket');
    }
  }
);

export const joinRoom = createAsyncThunk(
  'websocket/joinRoom',
  async (roomId: string, { rejectWithValue }) => {
    try {
      websocketService.joinRoom(roomId);
      return roomId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to join room');
    }
  }
);

export const leaveRoom = createAsyncThunk(
  'websocket/leaveRoom',
  async (roomId: string, { rejectWithValue }) => {
    try {
      websocketService.leaveRoom(roomId);
      return roomId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to leave room');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'websocket/sendMessage',
  async ({ roomId, message }: { roomId: string; message: string }, { rejectWithValue }) => {
    try {
      websocketService.sendMessage(roomId, message);
      return { roomId, message };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

// Extended WebSocket state
interface ExtendedWebSocketState extends WebSocketState {
  events: WebSocketEvent[];
  joinedRooms: string[];
  messages: { [roomId: string]: any[] };
  notifications: any[];
  activityFeed: any[];
}

// Initial state
const initialState: ExtendedWebSocketState = {
  connected: false,
  connecting: false,
  error: null,
  events: [],
  joinedRooms: [],
  messages: {},
  notifications: [],
  activityFeed: [],
};

// WebSocket slice
const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    // Update connection state
    updateConnectionState: (state, action: PayloadAction<WebSocketState>) => {
      state.connected = action.payload.connected;
      state.connecting = action.payload.connecting;
      state.error = action.payload.error;
    },

    // Add event to history
    addEvent: (state, action: PayloadAction<WebSocketEvent>) => {
      state.events.unshift(action.payload);
      // Keep only last 100 events
      if (state.events.length > 100) {
        state.events = state.events.slice(0, 100);
      }
    },

    // Add room to joined rooms
    addJoinedRoom: (state, action: PayloadAction<string>) => {
      if (!state.joinedRooms.includes(action.payload)) {
        state.joinedRooms.push(action.payload);
      }
    },

    // Remove room from joined rooms
    removeJoinedRoom: (state, action: PayloadAction<string>) => {
      state.joinedRooms = state.joinedRooms.filter(room => room !== action.payload);
    },

    // Add message to room
    addMessage: (state, action: PayloadAction<{ roomId: string; message: any }>) => {
      const { roomId, message } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push(message);
      // Keep only last 50 messages per room
      if (state.messages[roomId].length > 50) {
        state.messages[roomId] = state.messages[roomId].slice(-50);
      }
    },

    // Add notification
    addNotification: (state, action: PayloadAction<any>) => {
      state.notifications = [action.payload];
    },

    // Mark notification as read
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },

    // Clear notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Add activity to feed
    addActivity: (state, action: PayloadAction<any>) => {
      state.activityFeed.unshift(action.payload);
      // Keep only last 50 activities
      if (state.activityFeed.length > 50) {
        state.activityFeed = state.activityFeed.slice(0, 50);
      }
    },

    // Clear activity feed
    clearActivityFeed: (state) => {
      state.activityFeed = [];
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear events
    clearEvents: (state) => {
      state.events = [];
    },

    // Clear messages for a room
    clearRoomMessages: (state, action: PayloadAction<string>) => {
      state.messages[action.payload] = [];
    },
  },
  extraReducers: (builder) => {
    // Connect WebSocket
    builder
      .addCase(connectWebSocket.pending, (state) => {
        state.connecting = true;
        state.error = null;
      })
      .addCase(connectWebSocket.fulfilled, (state, action: PayloadAction<WebSocketState>) => {
        state.connected = action.payload.connected;
        state.connecting = action.payload.connecting;
        state.error = action.payload.error;
      })
      .addCase(connectWebSocket.rejected, (state, action) => {
        state.connected = false;
        state.connecting = false;
        state.error = action.payload as string;
      });

    // Disconnect WebSocket
    builder
      .addCase(disconnectWebSocket.pending, (state) => {
        state.connecting = true;
      })
      .addCase(disconnectWebSocket.fulfilled, (state, action: PayloadAction<WebSocketState>) => {
        state.connected = action.payload.connected;
        state.connecting = action.payload.connecting;
        state.error = action.payload.error;
      })
      .addCase(disconnectWebSocket.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Join room
    builder
      .addCase(joinRoom.fulfilled, (state, action: PayloadAction<string>) => {
        if (!state.joinedRooms.includes(action.payload)) {
          state.joinedRooms.push(action.payload);
        }
      });

    // Leave room
    builder
      .addCase(leaveRoom.fulfilled, (state, action: PayloadAction<string>) => {
        state.joinedRooms = state.joinedRooms.filter(room => room !== action.payload);
      });
  },
});

export const {
  updateConnectionState,
  addEvent,
  addJoinedRoom,
  removeJoinedRoom,
  addMessage,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
  addActivity,
  clearActivityFeed,
  clearError,
  clearEvents,
  clearRoomMessages,
} = websocketSlice.actions;

export default websocketSlice.reducer; 