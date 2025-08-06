import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  LinearProgress,
  Tooltip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAI } from '../../hooks/useAI';
import AITaskRecommendations from './AITaskRecommendations';
import SmartNotifications from '../notification/SmartNotifications';

const AIInsights: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    taskRecommendations,
    teamRecommendations,
    productivityAnalytics,
    workloadOptimization,
    loading,
    error,
    getTaskRecommendationsForUser,
    getTeamRecommendationsForUser,
    getProductivityAnalyticsForUser,
    optimizeUserWorkload,
  } = useAI();

  const [expandedSections, setExpandedSections] = useState<{
    taskRecommendations: boolean;
    teamRecommendations: boolean;
    productivityAnalytics: boolean;
    workloadOptimization: boolean;
  }>({
    taskRecommendations: true,
    teamRecommendations: true,
    productivityAnalytics: true,
    workloadOptimization: true,
  });

  useEffect(() => {
    if (user) {
      loadAIInsights();
    }
  }, [user]);

  const loadAIInsights = async () => {
    if (!user) return;

    try {
      await Promise.all([
        getTaskRecommendationsForUser(user.id),
        getTeamRecommendationsForUser(user.id),
        getProductivityAnalyticsForUser(user.id),
        optimizeUserWorkload(user.id),
      ]);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'task_creation':
        return <AssignmentIcon color="primary" />;
      case 'task_optimization':
        return <TrendingUpIcon color="success" />;
      case 'team_assignment':
        return <GroupIcon color="secondary" />;
      case 'priority_adjustment':
        return <PriorityHighIcon color="warning" />;
      case 'team_join':
        return <GroupIcon color="primary" />;
      case 'team_create':
        return <GroupIcon color="success" />;
      case 'member_suggestion':
        return <GroupIcon color="info" />;
      case 'skill_gap':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'task_creation':
      case 'team_create':
        return 'success';
      case 'task_optimization':
      case 'team_assignment':
        return 'primary';
      case 'priority_adjustment':
      case 'skill_gap':
        return 'warning';
      case 'team_join':
      case 'member_suggestion':
        return 'info';
      default:
        return 'default';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  if (!user) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            Please log in to view AI insights
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <AutoAwesomeIcon color="primary" />
        <Typography variant="h5" component="h2">
          AI Insights
        </Typography>
        <IconButton onClick={loadAIInsights} disabled={loading.taskRecommendations}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {error.taskRecommendations && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.taskRecommendations}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Smart Notifications */}
        <Grid item xs={12} md={6}>
          <SmartNotifications />
        </Grid>

        {/* AI Task Recommendations */}
        <Grid item xs={12} md={6}>
          <AITaskRecommendations />
        </Grid>

        {/* Task Recommendations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AssignmentIcon color="primary" />
                  <Typography variant="h6">Task Recommendations</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => toggleSection('taskRecommendations')}
                >
                  {expandedSections.taskRecommendations ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={expandedSections.taskRecommendations}>
                {loading.taskRecommendations ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : taskRecommendations.length > 0 ? (
                  <List>
                    {taskRecommendations.map((recommendation, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemIcon>
                            {getRecommendationIcon(recommendation.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" fontWeight="medium">
                                  {recommendation.title}
                                </Typography>
                                <Chip
                                  label={`${Math.round(recommendation.confidence * 100)}%`}
                                  size="small"
                                  color={getConfidenceColor(recommendation.confidence) as any}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {recommendation.description}
                                </Typography>
                                <Chip
                                  label={recommendation.type.replace('_', ' ')}
                                  size="small"
                                  color={getRecommendationColor(recommendation.type) as any}
                                  variant="outlined"
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < taskRecommendations.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    No task recommendations available
                  </Typography>
                )}
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Recommendations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <GroupIcon color="secondary" />
                  <Typography variant="h6">Team Recommendations</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => toggleSection('teamRecommendations')}
                >
                  {expandedSections.teamRecommendations ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={expandedSections.teamRecommendations}>
                {loading.teamRecommendations ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : teamRecommendations.length > 0 ? (
                  <List>
                    {teamRecommendations.map((recommendation, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemIcon>
                            {getRecommendationIcon(recommendation.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" fontWeight="medium">
                                  {recommendation.title}
                                </Typography>
                                <Chip
                                  label={`${Math.round(recommendation.confidence * 100)}%`}
                                  size="small"
                                  color={getConfidenceColor(recommendation.confidence) as any}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {recommendation.description}
                                </Typography>
                                <Chip
                                  label={recommendation.type.replace('_', ' ')}
                                  size="small"
                                  color={getRecommendationColor(recommendation.type) as any}
                                  variant="outlined"
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < teamRecommendations.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    No team recommendations available
                  </Typography>
                )}
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* Productivity Analytics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AnalyticsIcon color="primary" />
                  <Typography variant="h6">Productivity Analytics</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => toggleSection('productivityAnalytics')}
                >
                  {expandedSections.productivityAnalytics ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={expandedSections.productivityAnalytics}>
                {loading.productivityAnalytics ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : productivityAnalytics ? (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="primary">
                            {productivityAnalytics.metrics.tasksCompleted}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tasks Completed
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="success.main">
                            {Math.round(productivityAnalytics.metrics.productivityScore * 100)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Productivity Score
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="warning.main">
                            {productivityAnalytics.metrics.averageCompletionTime}h
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Avg. Completion Time
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="info.main">
                            {Math.round(productivityAnalytics.metrics.deadlineAdherence * 100)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Deadline Adherence
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {productivityAnalytics.insights.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Insights:
                        </Typography>
                        <List dense>
                          {productivityAnalytics.insights.map((insight, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <LightbulbIcon color="warning" />
                              </ListItemIcon>
                              <ListItemText primary={insight} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    No productivity analytics available
                  </Typography>
                )}
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* Workload Optimization */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PsychologyIcon color="secondary" />
                  <Typography variant="h6">Workload Optimization</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => toggleSection('workloadOptimization')}
                >
                  {expandedSections.workloadOptimization ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={expandedSections.workloadOptimization}>
                {loading.workloadOptimization ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : workloadOptimization ? (
                  <Box>
                    {workloadOptimization.optimization.suggestedAssignments.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Suggested Assignments:
                        </Typography>
                        <List dense>
                          {workloadOptimization.optimization.suggestedAssignments.slice(0, 3).map((assignment, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <AssignmentIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={assignment.reason}
                                secondary={`Confidence: ${Math.round(assignment.confidence * 100)}%`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {workloadOptimization.insights.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Optimization Insights:
                        </Typography>
                        <List dense>
                          {workloadOptimization.insights.slice(0, 3).map((insight, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <TrendingUpIcon color="success" />
                              </ListItemIcon>
                              <ListItemText primary={insight} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    No workload optimization available
                  </Typography>
                )}
              </Collapse>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIInsights; 