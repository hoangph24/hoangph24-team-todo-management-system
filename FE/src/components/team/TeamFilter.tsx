import React from 'react';
import { 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Team } from '../../types';

interface TeamFilterProps {
  teams: Team[];
  selectedTeamId: string | '';
  onChange: (teamId: string | '') => void;
  showLabel?: boolean;
  fullWidth?: boolean;
}

const TeamFilter: React.FC<TeamFilterProps> = ({ 
  teams, 
  selectedTeamId, 
  onChange, 
  showLabel = true,
  fullWidth = true 
}) => {
  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  return (
    <Box>
      {showLabel && (
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Filter by Team
        </Typography>
      )}
      
      <FormControl fullWidth={fullWidth} sx={{ mb: 2 }}>
        <InputLabel>Team</InputLabel>
        <Select
          value={selectedTeamId}
          label="Team"
          onChange={(e) => onChange(e.target.value as string | '')}
        >
          <MenuItem value="">
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>All Teams</Typography>
              <Chip label={teams.length} size="small" color="primary" />
            </Box>
          </MenuItem>
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Typography>{team.name}</Typography>
                <Chip 
                  label={team.todos?.length || 0} 
                  size="small" 
                  color="secondary" 
                  variant="outlined"
                />
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {selectedTeam && (
        <Box mt={1}>
          <Typography variant="caption" color="text.secondary">
            Selected: {selectedTeam.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TeamFilter;