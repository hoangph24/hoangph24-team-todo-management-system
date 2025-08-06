import { store } from '../store';
import websocketService from './websocket';

class AutoJoinService {
  private joinedTeams = new Set<string>();

  // Auto-join teams when user logs in
  async joinUserTeams() {
    const state = store.getState();
    const { user } = state.auth;
    const { teams } = state.teams;

    if (!user || !websocketService.isConnected()) {
      return;
    }

    // Join all teams the user is a member of
    teams.forEach(team => {
      if (!this.joinedTeams.has(team.id)) {
        websocketService.joinRoom(`team-${team.id}`);
        this.joinedTeams.add(team.id);
      }
    });
  }

  // Leave all teams when user logs out
  leaveAllTeams() {
    this.joinedTeams.forEach(teamId => {
      websocketService.leaveRoom(`team-${teamId}`);
    });
    this.joinedTeams.clear();
  }

  // Check if connected and join teams
  async checkAndJoin() {
    if (websocketService.isConnected()) {
      await this.joinUserTeams();
    }
  }

  // Get joined teams
  getJoinedTeams(): string[] {
    return Array.from(this.joinedTeams);
  }
}

const autoJoinService = new AutoJoinService();

export default autoJoinService; 