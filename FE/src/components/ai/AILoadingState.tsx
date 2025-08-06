import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface LoadingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  progress: number;
  estimatedTime: number;
  actualTime?: number;
  icon: React.ReactNode;
}

interface AILoadingStateProps {
  title: string;
  description?: string;
  steps?: LoadingStep[];
  progress?: number;
  estimatedTotalTime?: number;
  onCancel?: () => void;
  showDetails?: boolean;
  type?: 'simple' | 'detailed' | 'analytics';
}

const AILoadingState: React.FC<AILoadingStateProps> = ({
  title,
  description,
  steps = [],
  progress = 0,
  estimatedTotalTime = 0,
  onCancel,
  showDetails = true,
  type = 'detailed',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (steps.length > 0 && progress > 0) {
      const stepIndex = Math.floor((progress / 100) * steps.length);
      setCurrentStep(Math.min(stepIndex, steps.length - 1));
    }
  }, [progress, steps]);

  const getLoadingIcon = (type: string) => {
    switch (type) {
      case 'analytics':
        return <TrendingUpIcon color="primary" />;
      case 'detailed':
        return <PsychologyIcon color="secondary" />;
      default:
        return <AutoAwesomeIcon color="primary" />;
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'loading':
        return <ScheduleIcon color="primary" />;
      case 'error':
        return <WarningIcon color="error" />;
      default:
        return <InfoIcon color="action" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'primary';
    if (progress >= 20) return 'warning';
    return 'error';
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getEstimatedTimeRemaining = () => {
    if (progress === 0) return estimatedTotalTime;
    const elapsedRatio = elapsedTime / estimatedTotalTime;
    const remainingRatio = 1 - elapsedRatio;
    return Math.max(0, Math.round(remainingRatio * estimatedTotalTime));
  };

  const getLoadingMessage = () => {
    if (progress < 20) return 'Initializing AI analysis...';
    if (progress < 40) return 'Processing data patterns...';
    if (progress < 60) return 'Generating insights...';
    if (progress < 80) return 'Optimizing recommendations...';
    return 'Finalizing results...';
  };

  const getAITip = () => {
    const tips = [
      'AI is analyzing your work patterns to provide personalized insights',
      'Processing historical data to improve future recommendations',
      'Optimizing task assignments based on team performance',
      'Generating smart notifications to enhance productivity',
      'Calculating workload balance for better resource allocation',
    ];
    return tips[Math.floor(progress / 20)] || tips[tips.length - 1];
  };

  if (type === 'simple') {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={4}>
        <CircularProgress size={60} color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
            {description}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {getLoadingIcon(type)}
            <Typography variant="h6">{title}</Typography>
          </Box>
          {showDetails && (
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>

        {description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {description}
          </Typography>
        )}

        {/* Progress Bar */}
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              {getLoadingMessage()}
            </Typography>
            <Chip
              label={`${Math.round(progress)}%`}
              size="small"
              color={getProgressColor(progress) as any}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={getProgressColor(progress) as any}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Time Information */}
        <Box display="flex" gap={2} mb={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Elapsed Time
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatTime(elapsedTime)}
            </Typography>
          </Box>
          {estimatedTotalTime > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Estimated Remaining
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatTime(getEstimatedTimeRemaining())}
              </Typography>
            </Box>
          )}
        </Box>

        {/* AI Tip */}
        <Box mb={2} p={2} sx={{ bgcolor: 'primary.light', borderRadius: 1 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <AutoAwesomeIcon color="primary" fontSize="small" />
            <Typography variant="caption" color="primary.main" fontWeight="medium">
              AI Tip
            </Typography>
          </Box>
          <Typography variant="body2" color="primary.main">
            {getAITip()}
          </Typography>
        </Box>

        {/* Detailed Steps */}
        {showDetails && steps.length > 0 && (
          <Collapse in={expanded}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Processing Steps:
              </Typography>
              <List dense>
                {steps.map((step, index) => (
                  <ListItem key={step.id}>
                    <ListItemIcon>
                      {getStepIcon(step.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight="medium">
                            {step.title}
                          </Typography>
                          {step.status === 'loading' && (
                            <CircularProgress size={16} />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {step.description}
                          </Typography>
                          {step.status === 'loading' && step.progress > 0 && (
                            <Box mt={0.5}>
                              <LinearProgress
                                variant="determinate"
                                value={step.progress}
                                sx={{ height: 4 }}
                              />
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    {step.estimatedTime > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(step.estimatedTime)}
                      </Typography>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        )}

        {/* Cancel Button */}
        {onCancel && (
          <Box display="flex" justifyContent="center" mt={2}>
            <IconButton
              onClick={onCancel}
              color="error"
              size="small"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AILoadingState; 