import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  BugReport as BugReportIcon,
  Lightbulb as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  expanded: boolean;
  recoveryAttempts: number;
}

class AIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      expanded: false,
      recoveryAttempts: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      expanded: false,
      recoveryAttempts: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console for debugging
    console.error('AI Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryAttempts: prevState.recoveryAttempts + 1,
    }));
  };

  handleExpand = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  };

  getErrorAnalysis = () => {
    const { error } = this.state;
    if (!error) return null;

    const errorMessage = error.message.toLowerCase();
    const stackTrace = error.stack || '';

    // AI-powered error analysis
    const analysis = {
      type: 'unknown',
      severity: 'medium',
      suggestions: [] as string[],
      commonCauses: [] as string[],
    };

    // Analyze error type and provide suggestions
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      analysis.type = 'network';
      analysis.severity = 'high';
      analysis.suggestions = [
        'Check your internet connection',
        'Verify the API endpoint is accessible',
        'Try refreshing the page',
        'Clear browser cache and cookies',
      ];
      analysis.commonCauses = [
        'Poor internet connection',
        'API server down',
        'CORS issues',
        'Network timeout',
      ];
    } else if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
      analysis.type = 'authentication';
      analysis.severity = 'high';
      analysis.suggestions = [
        'Log out and log back in',
        'Check if your session has expired',
        'Verify your credentials',
        'Clear browser storage',
      ];
      analysis.commonCauses = [
        'Expired authentication token',
        'Invalid credentials',
        'Session timeout',
        'Permission issues',
      ];
    } else if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      analysis.type = 'validation';
      analysis.severity = 'medium';
      analysis.suggestions = [
        'Check the input data format',
        'Verify required fields are filled',
        'Ensure data meets validation rules',
        'Try with different input values',
      ];
      analysis.commonCauses = [
        'Invalid input format',
        'Missing required fields',
        'Data type mismatch',
        'Validation rule violations',
      ];
    } else if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
      analysis.type = 'permission';
      analysis.severity = 'high';
      analysis.suggestions = [
        'Contact your administrator',
        'Check your user permissions',
        'Verify you have access to this resource',
        'Try a different account',
      ];
      analysis.commonCauses = [
        'Insufficient permissions',
        'Resource access denied',
        'Role-based restrictions',
        'Account limitations',
      ];
    } else if (stackTrace.includes('useEffect') || stackTrace.includes('useState')) {
      analysis.type = 'react';
      analysis.severity = 'medium';
      analysis.suggestions = [
        'Check component lifecycle hooks',
        'Verify dependency arrays',
        'Ensure proper cleanup in useEffect',
        'Check for infinite re-renders',
      ];
      analysis.commonCauses = [
        'Missing dependencies in useEffect',
        'Infinite re-render loop',
        'Improper cleanup',
        'State update in unmounted component',
      ];
    } else {
      analysis.type = 'general';
      analysis.severity = 'medium';
      analysis.suggestions = [
        'Refresh the page',
        'Clear browser cache',
        'Try a different browser',
        'Contact support if the issue persists',
      ];
      analysis.commonCauses = [
        'Unexpected application state',
        'Browser compatibility issues',
        'Memory or performance issues',
        'Unknown system error',
      ];
    }

    return analysis;
  };

  getSeverityColor = (severity: string) => {
    switch (severity) {
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

  render() {
    const { hasError, error, errorInfo, expanded, recoveryAttempts } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    const analysis = this.getErrorAnalysis();

    if (fallback) {
      return fallback;
    }

    return (
      <Box sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <ErrorIcon color="error" />
              <Typography variant="h6" color="error">
                AI-Powered Error Recovery
              </Typography>
              <IconButton
                size="small"
                onClick={this.handleExpand}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="medium">
                An error occurred while processing your request
              </Typography>
              {error && (
                <Typography variant="caption" display="block" mt={0.5}>
                  {error.message}
                </Typography>
              )}
            </Alert>

            {analysis && (
              <Box mb={2}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AutoAwesomeIcon color="primary" />
                  <Typography variant="subtitle2">
                    AI Error Analysis
                  </Typography>
                  <Chip
                    label={analysis.type}
                    size="small"
                    color={this.getSeverityColor(analysis.severity) as any}
                  />
                </Box>

                <Collapse in={expanded}>
                  <Box>
                    {analysis.suggestions.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Suggested Solutions:
                        </Typography>
                        <List dense>
                          {analysis.suggestions.map((suggestion, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <LightbulbIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={suggestion} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {analysis.commonCauses.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Common Causes:
                        </Typography>
                        <List dense>
                          {analysis.commonCauses.map((cause, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <BugReportIcon color="warning" />
                              </ListItemIcon>
                              <ListItemText primary={cause} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Box>
            )}

            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
                disabled={recoveryAttempts >= 3}
              >
                {recoveryAttempts >= 3 ? 'Max Retries Reached' : 'Try Again'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>

              <Button
                variant="text"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </Box>

            {recoveryAttempts > 0 && (
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                  Recovery attempts: {recoveryAttempts}/3
                </Typography>
              </Box>
            )}

            {errorInfo && expanded && (
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Technical Details:
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    bgcolor: 'grey.100',
                    p: 1,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: 200,
                  }}
                >
                  {errorInfo.componentStack}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }
}

export default AIErrorBoundary; 