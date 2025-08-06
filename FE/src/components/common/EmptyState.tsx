import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      textAlign="center"
    >
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {description}
      </Typography>
      {action && (
        <Box mt={2}>
          {action}
        </Box>
      )}
    </Box>
  );
};

export default EmptyState; 