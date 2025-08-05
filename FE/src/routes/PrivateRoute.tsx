import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { getProfile, initializeAuth } from '../store/slices/authSlice';
import { authService } from '../services/auth';
import { CircularProgress, Box, Typography } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAuth = true,
  roles = []
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const token = useSelector((state: RootState) => state.auth.token) || authService.getToken();
  const hasInitialized = useRef(false);

  // Initialize auth on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // Always try to initialize auth from storage first
      const storedToken = authService.getToken();
      if (storedToken) {
        console.log('Found stored token, initializing auth...');
        dispatch(initializeAuth());
        
        // If we don't have user data, fetch it
        if (!user) {
          console.log('Fetching user profile...');
          dispatch(getProfile()).catch((error) => {
            console.error('Failed to get user profile:', error);
            // If getProfile fails, clear token and redirect to login
            authService.clearToken();
          });
        }
      } else {
        console.log('No stored token found');
      }
    }
  }, [dispatch, user]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check user permissions
  if (roles.length > 0 && user) {
    // For now, we'll use a simple role check
    // In a real app, you might have user.roles or similar
    const hasRequiredRole = true; // Placeholder - implement based on your role system
    
    if (!hasRequiredRole) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Typography variant="h4" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            You don't have permission to access this page.
          </Typography>
        </Box>
      );
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default PrivateRoute;