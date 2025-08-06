import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import { Group as GroupIcon, Assignment as TaskIcon, AutoAwesome as AIIcon, Analytics as AnalyticsIcon } from '@mui/icons-material';
import { RootState } from '../store';
import { getProfile } from '../store/slices/authSlice';
import UserProfile from '../components/common/UserProfile';
import ActivityFeed from '../components/common/ActivityFeed';
import AIInsights from '../components/ai/AIInsights';
import AIAnalytics from '../components/ai/AIAnalytics';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = React.useState(0);

  useEffect(() => {
    if (!user) {
      dispatch(getProfile() as any);
    }
  }, [dispatch, user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Dashboard
          </Typography>
          
          {user && (
            <Typography variant="h6" color="text.secondary">
              Welcome back, {user.firstName}!
            </Typography>
          )}
        </Box>
        
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<GroupIcon />}
            onClick={() => navigate('/teams')}
          >
            Manage Teams
          </Button>
          <Button
            variant="outlined"
            startIcon={<TaskIcon />}
            onClick={() => navigate('/todos')}
          >
            View Tasks
          </Button>
        </Box>
      </Box>

      {/* Quick Stats Section */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      My Tasks
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Teams
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overdue
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* User Profile Section */}
        <Grid item xs={12} md={6}>
          <UserProfile />
        </Grid>
      </Grid>

      {/* Tabbed Content */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab 
            icon={<TaskIcon />} 
            label="Activity Feed" 
            iconPosition="start"
          />
          <Tab 
            icon={<AIIcon />} 
            label="AI Insights" 
            iconPosition="start"
          />
          <Tab 
            icon={<AnalyticsIcon />} 
            label="AI Analytics" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <ActivityFeed />
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <AIInsights />
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <AIAnalytics />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default DashboardPage;