import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from './store';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TeamsPage from './pages/TeamsPage';
import TodosPage from './pages/TodosPage';
import PrivateRoute from './routes/PrivateRoute';
import GlobalNotificationManager from './components/notification/GlobalNotificationManager';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <GlobalNotificationManager />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={
                <PrivateRoute requireAuth={false}>
                  <LoginPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PrivateRoute requireAuth={false}>
                  <RegisterPage />
                </PrivateRoute>
              } 
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/teams"
              element={
                <PrivateRoute>
                  <TeamsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/todos"
              element={
                <PrivateRoute>
                  <TodosPage />
                </PrivateRoute>
              }
            />
            {/* Add more protected routes here */}
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;