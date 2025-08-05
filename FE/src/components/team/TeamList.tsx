import React from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Button, 
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Team, User } from '../../types';
import TeamCard from './TeamCard';

interface TeamListProps {
  teams: Team[];
  currentUser: User;
  loading?: boolean;
  error?: string | null;
  onCreateTeam: () => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  onAddMember: (teamId: string) => void;
  onRemoveMember: (teamId: string, memberId: string) => void;
  onSelectTeam: (team: Team) => void;
}

const TeamList: React.FC<TeamListProps> = ({
  teams,
  currentUser,
  loading = false,
  error = null,
  onCreateTeam,
  onEditTeam,
  onDeleteTeam,
  onAddMember,
  onRemoveMember,

  onSelectTeam,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (teams.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No teams found
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Create your first team to start collaborating with others.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateTeam}
        >
          Create Team
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          My Teams ({teams.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateTeam}
        >
          Create Team
        </Button>
      </Box>

      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <TeamCard
              team={team}
              currentUser={currentUser}
              onEdit={onEditTeam}
              onDelete={onDeleteTeam}
              onAddMember={onAddMember}
              onRemoveMember={onRemoveMember}
              
              onSelectTeam={onSelectTeam}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TeamList;