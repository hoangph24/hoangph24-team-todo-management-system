import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api';
import { 
  Team, 
  CreateTeamRequest, 
  UpdateTeamRequest, 
  AddMemberRequest,
  User 
} from '../types';

// Team service
export const teamService = {
  // Get all teams
  async getAll(): Promise<Team[]> {
    const response = await apiGet<Team[]>('/teams');
    return response;
  },

  // Get user's teams
  async getMyTeams(): Promise<Team[]> {
    const response = await apiGet<Team[]>('/teams/my-teams');
    return response;
  },

  // Get team by ID
  async getById(id: string): Promise<Team> {
    const response = await apiGet<Team>(`/teams/${id}`);
    return response;
  },

  // Create team
  async create(teamData: CreateTeamRequest): Promise<Team> {
    const response = await apiPost<Team>('/teams', teamData);
    return response;
  },

  // Update team
  async update(id: string, teamData: UpdateTeamRequest): Promise<Team> {
    const response = await apiPut<Team>(`/teams/${id}`, teamData);
    return response;
  },

  // Delete team
  async delete(id: string): Promise<void> {
    await apiDelete<void>(`/teams/${id}`);
  },

  // Add member to team
  async addMember(teamId: string, memberData: AddMemberRequest): Promise<Team> {
    const response = await apiPost<Team>(`/teams/${teamId}/members`, memberData);
    return response;
  },

  // Remove member from team
  async removeMember(teamId: string, memberId: string): Promise<Team> {
    const response = await apiDelete<Team>(`/teams/${teamId}/members/${memberId}`);
    return response;
  },
};

// Legacy functions for backward compatibility
export const fetchTeams = async (): Promise<Team[]> => {
  return await teamService.getAll();
};

export const createTeam = async (data: { name: string; description: string }): Promise<Team> => {
  return await teamService.create(data);
};

export const updateTeam = async (id: string, data: Partial<{ name: string; description: string }>): Promise<Team> => {
  return await teamService.update(id, data);
}; 