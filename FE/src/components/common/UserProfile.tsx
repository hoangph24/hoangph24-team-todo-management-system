import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import { Edit, Save, Cancel, Person } from '@mui/icons-material';
import { RootState } from '../../store';
import { logout, updateProfile } from '../../store/slices/authSlice';
import { authService } from '../../services/auth';
import { User } from '../../types';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Update editData when user changes
  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleEdit = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      password: '',
    });
    setErrors({});
    setUpdateError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setUpdateError('');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!editData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!editData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password is optional, but if provided, must be at least 6 characters
    if (editData.password && editData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setUpdateLoading(true);
    setUpdateError('');

    try {
      // Create update data without empty password
      const updateData: Partial<User> = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
      };
      
      // Only include password if it's not empty
      if (editData.password) {
        (updateData as any).password = editData.password;
      }
      
      // Dispatch update profile action
      await dispatch(updateProfile(updateData)).unwrap();
      
      setIsEditing(false);
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Alert severity="error">
        User information not available
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mr: 2,
            }}
          >
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h2">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {updateError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {updateError}
          </Alert>
        )}

        {isEditing ? (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleInputChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleInputChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password (optional)"
                  name="password"
                  type="password"
                  value={editData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password || 'Leave blank to keep current password'}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={3} justifyContent="center">
              <Button
                variant="contained"
                startIcon={updateLoading ? <CircularProgress size={20} /> : <Save />}
                onClick={handleSave}
                disabled={updateLoading}
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={updateLoading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user.firstName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user.email}
                </Typography>
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={3} justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile; 