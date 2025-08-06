import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  TaskAlt,
  Group,
  TrendingUp,
  Psychology,
  ArrowForward,
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TaskAlt sx={{ fontSize: 40 }} />,
      title: 'Task Management',
      description: 'Create, assign, and track tasks with ease. Set priorities and due dates to stay organized.',
    },
    {
      icon: <Group sx={{ fontSize: 40 }} />,
      title: 'Team Collaboration',
      description: 'Work together with your team. Share tasks, assign responsibilities, and track progress.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Progress Tracking',
      description: 'Monitor your team\'s progress with real-time updates and comprehensive analytics.',
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Insights',
      description: 'Get intelligent suggestions for due dates and task complexity analysis.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Team Todo Management
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                Streamline your team's workflow with intelligent task management and real-time collaboration.
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                  endIcon={<ArrowForward />}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 300,
                }}
              >
                <TaskAlt sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Features
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need to manage your team's tasks effectively
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Paper sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of teams who are already using our platform to manage their tasks efficiently.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              endIcon={<ArrowForward />}
            >
              Create Your Account
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default HomePage;