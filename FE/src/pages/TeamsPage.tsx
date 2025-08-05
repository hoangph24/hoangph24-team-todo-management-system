import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography as MuiTypography,
} from '@mui/material';
import { RootState, AppDispatch } from '../store';
import {
  fetchMyTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
  clearError,
} from '../store/slices/teamSlice';
import { Team, CreateTeamRequest, UpdateTeamRequest, AddMemberRequest } from '../types';
import TeamList from '../components/team/TeamList';
import TeamForm from '../components/team/TeamForm';
import AddMemberDialog from '../components/team/AddMemberDialog';
import TeamDetails from '../components/team/TeamDetails';

const TeamsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teams, loading, error } = useSelector((state: RootState) => state.teams);
  const { user } = useSelector((state: RootState) => state.auth);

  // Local state
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [teamDetailsOpen, setTeamDetailsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load teams on component mount
  useEffect(() => {
    dispatch(fetchMyTeams());
  }, [dispatch]);

  // Debug teams state changes
  useEffect(() => {
    console.log('Teams state updated:', { 
      teamsCount: teams.length, 
      teams: teams.map(t => ({ id: t.id, name: t.name })), 
      loading, 
      error 
    });
  }, [teams, loading, error]);

  // Refresh teams when error occurs
  useEffect(() => {
    if (error) {
      console.log('Error detected, refreshing teams...');
      // Refresh teams data when there's an error to ensure UI is in sync
      dispatch(fetchMyTeams());
    }
  }, [error, dispatch]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Update selectedTeam when teams state changes
  useEffect(() => {
    if (selectedTeam && teams.length > 0) {
      const updatedTeam = teams.find(team => team.id === selectedTeam.id);
      if (updatedTeam) {
        setSelectedTeam(updatedTeam);
      }
    }
  }, [teams, selectedTeam]);

  const handleCreateTeam = () => {
    setEditingTeam(null);
    setTeamFormOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamFormOpen(true);
  };

  const handleTeamFormSubmit = async (data: CreateTeamRequest | UpdateTeamRequest) => {
    try {
      if (editingTeam) {
        await dispatch(updateTeam({ id: editingTeam.id, data: data as UpdateTeamRequest })).unwrap();
        showSnackbar('Team updated successfully!', 'success');
      } else {
        const result = await dispatch(createTeam(data as CreateTeamRequest)).unwrap();
        showSnackbar('Team created successfully!', 'success');
      }
      // Close dialogs first
      setTeamFormOpen(false);
      setEditingTeam(null);
    } catch (error: any) {
      console.error('Error creating/updating team:', error);
      showSnackbar(error.message || 'Failed to save team', 'error');
      // Close dialog even on error
      setTeamFormOpen(false);
      setEditingTeam(null);
    }
  };

  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteTeamById = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      handleDeleteTeam(team);
    }
  };

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      await dispatch(deleteTeam(teamToDelete.id)).unwrap();
      showSnackbar('Team deleted successfully!', 'success');
      setDeleteConfirmOpen(false);
      setTeamToDelete(null);
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to delete team', 'error');
      // Close dialog even on error
      setDeleteConfirmOpen(false);
      setTeamToDelete(null);
    }
  };

  const handleAddMember = (teamId: string) => {
    setSelectedTeamId(teamId);
    setAddMemberDialogOpen(true);
  };

  const handleAddMemberSubmit = async (data: AddMemberRequest) => {
    try {
      await dispatch(addMember({ teamId: selectedTeamId, memberData: data })).unwrap();
      showSnackbar('Member added successfully!', 'success');
      setAddMemberDialogOpen(false);
      setSelectedTeamId('');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to add member', 'error');
      // Close dialog even on error
      setAddMemberDialogOpen(false);
      setSelectedTeamId('');
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    try {
      await dispatch(removeMember({ teamId, memberId })).unwrap();
      showSnackbar('Member removed successfully!', 'success');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to remove member', 'error');
      // Close team details dialog on error
      setTeamDetailsOpen(false);
    }
  };



  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setTeamDetailsOpen(true);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Please log in to view teams.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Team Management
      </Typography>

      <TeamList
        teams={teams}
        currentUser={user}
        loading={loading}
        error={error}
        onCreateTeam={handleCreateTeam}
        onEditTeam={handleEditTeam}
        onDeleteTeam={handleDeleteTeamById}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onSelectTeam={handleSelectTeam}
      />

      {/* Team Form Dialog */}
      <TeamForm
        open={teamFormOpen}
        onClose={() => setTeamFormOpen(false)}
        onSubmit={handleTeamFormSubmit}
        team={editingTeam}
        loading={loading}
        error={error}
      />

      {/* Add Member Dialog */}
      <AddMemberDialog
        open={addMemberDialogOpen}
        onClose={() => setAddMemberDialogOpen(false)}
        onSubmit={handleAddMemberSubmit}
        loading={loading}
        error={error}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Team</DialogTitle>
        <DialogContent>
          <MuiTypography>
            Are you sure you want to delete "{teamToDelete?.name}"? This action cannot be undone.
          </MuiTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteTeam} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Team Details Dialog */}
      <TeamDetails
        open={teamDetailsOpen}
        onClose={() => setTeamDetailsOpen(false)}
        team={selectedTeam}
        currentUser={user}
        onEdit={handleEditTeam}
        onDelete={handleDeleteTeamById}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}

      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TeamsPage; 