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
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  Divider,
  Tooltip,
  LinearProgress,
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
  Add as AddIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface TaskRecommendation {
  id: string;
  type: 'task_creation' | 'task_optimization' | 'team_assignment' | 'priority_adjustment' | 'deadline_optimization' | 'workload_balance';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  action: {
    type: string;
    data: any;
  };
  applied: boolean;
}

const AITaskRecommendations: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [recommendations, setRecommendations] = useState<TaskRecommendation[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;

    setLoadingRecommendations(true);
    try {
      // Simulate AI-generated recommendations
      const mockRecommendations: TaskRecommendation[] = [
        {
          id: '1',
          type: 'task_creation',
          title: 'Create Project Documentation',
          description: 'Based on your recent project activities, you should create comprehensive documentation for the current sprint.',
          confidence: 0.85,
          impact: 'high',
          effort: 'medium',
          action: {
            type: 'create_task',
            data: {
              title: 'Create Project Documentation',
              description: 'Document current sprint progress, decisions, and next steps',
              priority: 'medium',
              estimatedHours: 4,
            },
          },
          applied: false,
        },
        {
          id: '2',
          type: 'priority_adjustment',
          title: 'Reprioritize Bug Fixes',
          description: 'Critical bugs are affecting user experience. Consider moving them to high priority.',
          confidence: 0.92,
          impact: 'high',
          effort: 'low',
          action: {
            type: 'update_priority',
            data: {
              taskIds: ['bug-001', 'bug-002'],
              newPriority: 'high',
            },
          },
          applied: false,
        },
        {
          id: '3',
          type: 'team_assignment',
          title: 'Assign Code Review to Sarah',
          description: 'Sarah has expertise in this area and is currently available. Perfect match for the pending code review.',
          confidence: 0.78,
          impact: 'medium',
          effort: 'low',
          action: {
            type: 'assign_task',
            data: {
              taskId: 'review-001',
              assigneeId: 'sarah-id',
            },
          },
          applied: false,
        },
        {
          id: '4',
          type: 'deadline_optimization',
          title: 'Extend Feature Deadline',
          description: 'Current deadline is too aggressive. Extending by 2 days will improve quality without significant impact.',
          confidence: 0.67,
          impact: 'medium',
          effort: 'low',
          action: {
            type: 'update_deadline',
            data: {
              taskId: 'feature-001',
              newDeadline: '2024-01-15',
            },
          },
          applied: false,
        },
        {
          id: '5',
          type: 'workload_balance',
          title: 'Distribute Tasks Evenly',
          description: 'Team workload is imbalanced. Move 2 tasks from John to available team members.',
          confidence: 0.81,
          impact: 'high',
          effort: 'medium',
          action: {
            type: 'redistribute_tasks',
            data: {
              fromUserId: 'john-id',
              toUserIds: ['sarah-id', 'mike-id'],
              taskIds: ['task-001', 'task-002'],
            },
          },
          applied: false,
        },
        {
          id: '6',
          type: 'task_optimization',
          title: 'Break Down Complex Task',
          description: 'The database migration task is too complex. Break it into 3 smaller, manageable subtasks.',
          confidence: 0.74,
          impact: 'medium',
          effort: 'medium',
          action: {
            type: 'split_task',
            data: {
              taskId: 'db-migration',
              subtasks: [
                { title: 'Backup Database', estimatedHours: 2 },
                { title: 'Run Migration Scripts', estimatedHours: 4 },
                { title: 'Verify Data Integrity', estimatedHours: 2 },
              ],
            },
          },
          applied: false,
        },
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const applyRecommendation = (recommendationId: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === recommendationId
          ? { ...rec, applied: true }
          : rec
      )
    );
    // In a real app, this would trigger the actual action
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'task_creation':
        return <AddIcon color="primary" />;
      case 'task_optimization':
        return <TrendingUpIcon color="success" />;
      case 'team_assignment':
        return <GroupIcon color="secondary" />;
      case 'priority_adjustment':
        return <PriorityHighIcon color="warning" />;
      case 'deadline_optimization':
        return <ScheduleIcon color="info" />;
      case 'workload_balance':
        return <PsychologyIcon color="primary" />;
      default:
        return <InfoIcon />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getAppliedCount = () => {
    return recommendations.filter(rec => rec.applied).length;
  };

  if (!user) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            Please log in to view AI recommendations
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6">AI Task Recommendations</Typography>
            <Chip
              label={`${getAppliedCount()}/${recommendations.length} applied`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Box display="flex" gap={1}>
            <IconButton
              size="small"
              onClick={loadRecommendations}
              disabled={loadingRecommendations}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          {loadingRecommendations ? (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} />
            </Box>
          ) : recommendations.length > 0 ? (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                AI-powered recommendations to optimize your workflow
              </Typography>

              <List>
                {recommendations.map((recommendation, index) => (
                  <React.Fragment key={recommendation.id}>
                    <ListItem
                      sx={{
                        bgcolor: recommendation.applied ? 'success.light' : 'background.paper',
                        borderRadius: 1,
                        mb: 1,
                        border: recommendation.applied ? 1 : 0,
                        borderColor: 'success.main',
                      }}
                    >
                      <ListItemIcon>
                        {getRecommendationIcon(recommendation.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography
                              variant="body2"
                              fontWeight="medium"
                              color={recommendation.applied ? 'success.main' : 'text.primary'}
                            >
                              {recommendation.title}
                            </Typography>
                            <Chip
                              label={`${Math.round(recommendation.confidence * 100)}%`}
                              size="small"
                              color={getConfidenceColor(recommendation.confidence) as any}
                            />
                            {recommendation.applied && (
                              <CheckCircleIcon color="success" fontSize="small" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              {recommendation.description}
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                              <Chip
                                label={`Impact: ${recommendation.impact}`}
                                size="small"
                                color={getImpactColor(recommendation.impact) as any}
                                variant="outlined"
                              />
                              <Chip
                                label={`Effort: ${recommendation.effort}`}
                                size="small"
                                color={getEffortColor(recommendation.effort) as any}
                                variant="outlined"
                              />
                              <Chip
                                label={recommendation.type.replace('_', ' ')}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        }
                      />
                      {!recommendation.applied && (
                        <Tooltip title="Apply recommendation">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => applyRecommendation(recommendation.id)}
                            startIcon={<CheckCircleIcon />}
                          >
                            Apply
                          </Button>
                        </Tooltip>
                      )}
                    </ListItem>
                    {index < recommendations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Box mt={2} p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Recommendation Summary
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Chip
                    label={`${recommendations.filter(r => r.impact === 'high').length} High Impact`}
                    color="error"
                    size="small"
                  />
                  <Chip
                    label={`${recommendations.filter(r => r.effort === 'low').length} Low Effort`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`${Math.round(recommendations.reduce((acc, r) => acc + r.confidence, 0) / recommendations.length * 100)}% Avg Confidence`}
                    color="primary"
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          ) : (
            <Box textAlign="center" py={3}>
              <LightbulbIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No recommendations available
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AI will generate recommendations based on your activity patterns
              </Typography>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default AITaskRecommendations; 