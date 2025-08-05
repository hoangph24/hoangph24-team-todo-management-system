import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  TeamState, 
  Team, 
  CreateTeamRequest, 
  UpdateTeamRequest, 
  AddMemberRequest
} from '../../types';
import { teamService } from '../../services/team';

// Async thunks
export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      return await teamService.getAll();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teams');
    }
  }
);

export const fetchMyTeams = createAsyncThunk(
  'teams/fetchMyTeams',
  async (_, { rejectWithValue }) => {
    try {
      return await teamService.getMyTeams();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch my teams');
    }
  }
);

export const fetchTeamById = createAsyncThunk(
  'teams/fetchTeamById',
  async (teamId: string, { rejectWithValue }) => {
    try {
      return await teamService.getById(teamId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch team');
    }
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamData: CreateTeamRequest, { rejectWithValue }) => {
    try {
      return await teamService.create(teamData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create team');
    }
  }
);

export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ id, data }: { id: string; data: UpdateTeamRequest }, { rejectWithValue }) => {
    try {
      return await teamService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update team');
    }
  }
);

export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (id: string, { rejectWithValue }) => {
    try {
      await teamService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete team');
    }
  }
);

export const addMember = createAsyncThunk(
  'teams/addMember',
  async ({ teamId, memberData }: { teamId: string; memberData: AddMemberRequest }, { rejectWithValue }) => {
    try {
      return await teamService.addMember(teamId, memberData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add member');
    }
  }
);

export const removeMember = createAsyncThunk(
  'teams/removeMember',
  async ({ teamId, memberId }: { teamId: string; memberId: string }, { rejectWithValue }) => {
    try {
      return await teamService.removeMember(teamId, memberId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove member');
    }
  }
);



// Initial state
const initialState: TeamState = {
  teams: [],
  currentTeam: null,
  loading: false,
  error: null,
};

// Team slice
const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    // Set current team
    setCurrentTeam: (state, action: PayloadAction<Team | null>) => {
      state.currentTeam = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Add team (for real-time updates)
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.unshift(action.payload);
    },

    // Update team (for real-time updates)
    updateTeamRealTime: (state, action: PayloadAction<Team>) => {
      const index = state.teams.findIndex(team => team.id === action.payload.id);
      if (index !== -1) {
        state.teams[index] = action.payload;
      }
      if (state.currentTeam?.id === action.payload.id) {
        state.currentTeam = action.payload;
      }
    },

    // Remove team (for real-time updates)
    removeTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter(team => team.id !== action.payload);
      if (state.currentTeam?.id === action.payload) {
        state.currentTeam = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch teams
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
        state.loading = false;
        // Remove duplicates before setting teams
        const uniqueTeams = action.payload.filter((team, index, self) => 
          index === self.findIndex(t => t.id === team.id)
        );
        state.teams = uniqueTeams;
        state.error = null;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch my teams
    builder
      .addCase(fetchMyTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
        state.loading = false;
        // Remove duplicates before setting teams
        const uniqueTeams = action.payload.filter((team, index, self) => 
          index === self.findIndex(t => t.id === team.id)
        );
        state.teams = uniqueTeams;
        state.error = null;
      })
      .addCase(fetchMyTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch team by ID
    builder
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        state.currentTeam = action.payload;
        state.error = null;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create team
    builder
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        state.teams.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update team
    builder
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        const index = state.teams.findIndex(team => team.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        if (state.currentTeam?.id === action.payload.id) {
          state.currentTeam = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete team
    builder
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.teams = state.teams.filter(team => team.id !== action.payload);
        if (state.currentTeam?.id === action.payload) {
          state.currentTeam = null;
        }
        state.error = null;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add member
    builder
      .addCase(addMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        const index = state.teams.findIndex(team => team.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        if (state.currentTeam?.id === action.payload.id) {
          state.currentTeam = action.payload;
        }
        state.error = null;
      })
      .addCase(addMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Remove member
    builder
      .addCase(removeMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        const index = state.teams.findIndex(team => team.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        if (state.currentTeam?.id === action.payload.id) {
          state.currentTeam = action.payload;
        }
        state.error = null;
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


  },
});

export const { 
  setCurrentTeam, 
  clearError, 
  addTeam, 
  updateTeamRealTime, 
  removeTeam 
} = teamSlice.actions;

export default teamSlice.reducer; 