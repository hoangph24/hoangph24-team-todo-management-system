import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  AutoAwesome as AutoAwesomeIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAI } from '../../hooks/useAI';

const AIAnalytics: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    productivityAnalytics,
    workloadOptimization,
    taskTemplates,
    taskPredictions,
    teamPerformance,
    loading,
    error
  } = useAI();

  const [expandedSections, setExpandedSections] = useState<{
    productivity: boolean;
    workload: boolean;
    templates: boolean;
    predictions: boolean;
    teamPerformance: boolean;
  }>({
    productivity: true,
    workload: true,
    templates: true,
    predictions: true,
    teamPerformance: true,
  });

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      await Promise.all([
      ]);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getProductivityColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (!user) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            Please log in to view AI analytics
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <AnalyticsIcon color="primary" />
        <Typography variant="h5" component="h2">
          AI Analytics Dashboard
        </Typography>
        <IconButton onClick={loadAnalytics} disabled={loading.productivityAnalytics}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {error.productivityAnalytics && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.productivityAnalytics}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Productivity Analytics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUpIcon color="primary" />
                  <Typography variant="h6">Productivity Analytics</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => toggleSection('productivity')}
                >
                  {expandedSections.productivity ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={expandedSections.productivity}>
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
                          <Typography 
                            variant="h4" 
                            color={getProductivityColor(productivityAnalytics.metrics.productivityScore)}
                          >
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
                          Key Insights:
                        </Typography>
                        <List dense>
                          {productivityAnalytics.insights.slice(0, 3).map((insight, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <AutoAwesomeIcon color="primary" />
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
                    No productivity data available
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
                  onClick={() => toggleSection('workload')}
                >
                  {expandedSections.workload ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={expandedSections.workload}>
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
                          {workloadOptimization.optimization.suggestedAssignments.slice(0, 2).map((assignment, index) => (
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
                          {workloadOptimization.insights.slice(0, 2).map((insight, index) => (
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
                    No workload optimization data available
                  </Typography>
                )}
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Templates */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AssignmentIcon color="info" />
                  <Typography variant="h6">Smart Task Templates</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => toggleSection('templates')}
                >
                  {expandedSections.templates ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={expandedSections.templates}>
                {loading.taskTemplates ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : taskTemplates.length > 0 ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      AI-generated templates based on your work patterns
                    </Typography>
                    {taskTemplates.slice(0, 3).map((template, index) => (
                      <Box key={index} mb={2} p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {template.title}
                          </Typography>
                          <Chip
                            label={`${template.estimatedHours}h`}
                            size="small"
                            color="primary"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {template.description}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={template.priority}
                            size="small"
                            color={template.priority === 'high' ? 'error' : template.priority === 'medium' ? 'warning' : 'default'}
                            variant="outlined"
                          />
                          <Chip
                            label={`${template.subtasks.length} subtasks`}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    No task templates available
                  </Typography>
                )}
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Predictions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TimelineIcon color="warning" />
                  <Typography variant="h6">Task Predictions</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => toggleSection('predictions')}
                >
                  {expandedSections.predictions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={expandedSections.predictions}>
                {loading.taskPrediction ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : Object.keys(taskPredictions).length > 0 ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      AI predictions for task completion
                    </Typography>
                    {Object.entries(taskPredictions).slice(0, 3).map(([taskId, prediction], index) => (
                      <Box key={index} mb={2} p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle2" fontWeight="medium">
                            Task #{taskId.slice(-4)}
                          </Typography>
                          <Chip
                            label={`${Math.round(prediction.confidence * 100)}% confidence`}
                            size="small"
                            color={prediction.confidence >= 0.8 ? 'success' : prediction.confidence >= 0.6 ? 'warning' : 'error'}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          Predicted completion: {new Date(prediction.predictedCompletionDate).toLocaleDateString()}
                        </Typography>
                        {prediction.riskFactors.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="warning.main">
                              Risk factors: {prediction.riskFactors.slice(0, 2).join(', ')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    No task predictions available
                  </Typography>
                )}
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AssessmentIcon color="secondary" />
                  <Typography variant="h6">Team Performance Analysis</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => toggleSection('teamPerformance')}
                >
                  {expandedSections.teamPerformance ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={expandedSections.teamPerformance}>
                {loading.teamPerformance ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : Object.keys(teamPerformance).length > 0 ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      AI-powered team performance insights
                    </Typography>
                    {Object.entries(teamPerformance).slice(0, 2).map(([teamId, performance], index) => (
                      <Box key={index} mb={3} p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Team #{teamId.slice(-4)}
                          </Typography>
                          <Chip
                            label={`${Math.round(performance.performance.overallScore)}% score`}
                            size="small"
                            color={getPerformanceColor(performance.performance.overallScore)}
                          />
                        </Box>
                        
                        <Grid container spacing={2} mb={2}>
                          <Grid item xs={6}>
                            <Box textAlign="center">
                              <Typography variant="h6" color="primary">
                                {Math.round(performance.performance.taskCompletionRate * 100)}%
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Completion Rate
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box textAlign="center">
                              <Typography variant="h6" color="success.main">
                                {Math.round(performance.performance.collaborationScore * 100)}%
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Collaboration Score
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {performance.insights.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                              Key Insights:
                            </Typography>
                            {performance.insights.slice(0, 2).map((insight, insightIndex) => (
                              <Typography key={insightIndex} variant="body2" color="text.secondary" mb={0.5}>
                                • {insight}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    No team performance data available
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

export default AIAnalytics; 