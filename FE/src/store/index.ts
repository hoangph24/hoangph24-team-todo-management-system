import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import todoReducer from './slices/todoSlice';
import teamReducer from './slices/teamSlice';
import websocketReducer from './slices/websocketSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    teams: teamReducer,
    websocket: websocketReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;