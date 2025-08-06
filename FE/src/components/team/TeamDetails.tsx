import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  RemoveCircle as RemoveIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store';
import { Team, User } from '../../types';

interface TeamDetailsProps {
  open: boolean;
  onClose: () => void;
  team: Team | null;
  currentUser: User;
  onEdit: (team: Team) => void;
  onDelete: (teamId: string) => void;
  onAddMember: (teamId: string) => void;
  onRemoveMember: (teamId: string, memberId: string) => void;

}

const TeamDetails: React.FC<TeamDetailsProps> = ({
  open,
  onClose,
  team,
  currentUser,
  onEdit,
  onDelete,
  onAddMember,
  onRemoveMember,

}) => {
  const dispatch = useDispatch<AppDispatch>();

  if (!team) {
    return null;
  }

  const isOwner = team.ownerId === currentUser.id;
  const isMember = team.members.some(member => member.id === currentUser.id);
  const canManage = isOwner || isMember;

  const handleEdit = () => {
    onEdit(team);
    onClose();
  };

  const handleDelete = () => {
    onDelete(team.id);
    onClose();
  };

  const handleAddMember = () => {
    onAddMember(team.id);
  };

  const handleRemoveMember = (memberId: string) => {
    try {
      onRemoveMember(team.id, memberId);
    } catch (error) {
      // Dialog will be closed by parent component error handling
      console.error('Error removing member:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{team.name}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Team Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Team Information
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {team.description}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Owner
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {team.owner?.firstName?.charAt(0) || 'U'}{team.owner?.lastName?.charAt(0) || 'U'}
                    </Avatar>
                    <Typography>
                      {team.owner?.firstName || 'Unknown'} {team.owner?.lastName || 'User'}
                    </Typography>
                    <Chip label="Owner" size="small" color="primary" />
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                {canManage && (
                  <Box display="flex" gap={1} mt={2}>
                    {isOwner && (
                      <>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={handleEdit}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          color="error"
                          onClick={handleDelete}
                        >
                          Delete
                        </Button>
                        <Button
                          size="small"
                          startIcon={<PersonAddIcon />}
                          onClick={handleAddMember}
                        >
                          Add Member
                        </Button>
                      </>
                    )}

                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Team Members */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Members ({team.members?.length || 0})
                  </Typography>
                  {isOwner && (
                    <Button
                      size="small"
                      startIcon={<PersonAddIcon />}
                      onClick={handleAddMember}
                    >
                      Add Member
                    </Button>
                  )}
                </Box>

                {!team.members || team.members.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No members yet.
                  </Typography>
                ) : (
                  <List>
                    {team.members.map((member, index) => (
                      <React.Fragment key={member.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              {member.firstName?.charAt(0) || 'U'}{member.lastName?.charAt(0) || 'U'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${member.firstName || 'Unknown'} ${member.lastName || 'User'}`}
                            secondary={member.email}
                          />
                          <ListItemSecondaryAction>
                            {isOwner && (
                              <Box display="flex" gap={1}>

                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveMember(member.id)}
                                  title="Remove member"
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < team.members.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Team Todos */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Team Tasks ({team.todos?.length || 0})
                </Typography>
                
                {!team.todos || team.todos.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No tasks assigned to this team yet.
                  </Typography>
                ) : (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Recent tasks will be displayed here.
                    </Typography>
                    {/* TODO: Implement todo list for team */}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamDetails; 