import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  MoreVert as MoreVertIcon,
  Group as GroupIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Team, User } from '../../types';

interface TeamCardProps {
  team: Team;
  currentUser: User;
  onEdit: (team: Team) => void;
  onDelete: (teamId: string) => void;
  onAddMember: (teamId: string) => void;
  onRemoveMember: (teamId: string, memberId: string) => void;

  onSelectTeam: (team: Team) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  currentUser,
  onEdit,
  onDelete,
  onAddMember,
  onRemoveMember,

  onSelectTeam,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isOwner = team.ownerId === currentUser.id;
  const isMember = team.members.some(member => member.id === currentUser.id);
  const canManage = isOwner || isMember;

  const handleEdit = () => {
    handleMenuClose();
    onEdit(team);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(team.id);
  };

  const handleAddMember = () => {
    handleMenuClose();
    onAddMember(team.id);
  };

  const handleRemoveMember = (memberId: string) => {
    handleMenuClose();
    onRemoveMember(team.id, memberId);
  };

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography variant="h6" component="div" gutterBottom>
              {team.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {team.description}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Chip
                icon={<PersonIcon />}
                label={`Owner: ${team.owner?.firstName || 'Unknown'} ${team.owner?.lastName || 'User'}`}
                color="primary"
                size="small"
              />
              <Chip
                icon={<GroupIcon />}
                label={`${team.members?.length || 0} members`}
                color="secondary"
                size="small"
              />
            </Box>

            {/* Team Members */}
            {team.members && team.members.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Members:
                </Typography>
                <AvatarGroup max={4} sx={{ mb: 1 }}>
                  {team.members.map((member) => (
                    <Avatar
                      key={member.id}
                      alt={`${member.firstName || 'Unknown'} ${member.lastName || 'User'}`}
                      sx={{ width: 32, height: 32 }}
                    >
                      {(member.firstName?.charAt(0) || 'U')}{(member.lastName?.charAt(0) || 'U')}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Box>
            )}
          </Box>

          {canManage && (
            <IconButton
              aria-label="more"
              aria-controls={open ? 'team-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleMenuClick}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          variant="outlined"
          onClick={() => onSelectTeam(team)}
        >
          View Details
        </Button>
        
        {isOwner && (
          <Button
            size="small"
            startIcon={<PersonAddIcon />}
            onClick={handleAddMember}
          >
            Add Member
          </Button>
        )}
      </CardActions>

      {/* Team Menu */}
      <Menu
        id="team-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'team-menu-button',
        }}
      >
        {isOwner && (
          <>
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Team</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete Team</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleAddMember}>
              <ListItemIcon>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add Member</ListItemText>
            </MenuItem>
          </>
        )}



        {/* Remove member options for owner */}
        {isOwner && team.members.map((member) => (
          <MenuItem
            key={member.id}
            onClick={() => handleRemoveMember(member.id)}
            sx={{ pl: 4 }}
          >
            <ListItemText>
              Remove {member.firstName} {member.lastName}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
};

export default TeamCard; 