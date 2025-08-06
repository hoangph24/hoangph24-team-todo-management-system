import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TodoEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Don't set userId here, wait for authentication
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove user from connected users
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  }

  @SubscribeMessage('join-team')
  handleJoinTeam(client: Socket, teamId: string) {
    client.join(`team-${teamId}`);
    console.log(`User joined team: ${teamId}`);
  }

  @SubscribeMessage('leave-team')
  handleLeaveTeam(client: Socket, teamId: string) {
    client.leave(`team-${teamId}`);
    console.log(`User left team: ${teamId}`);
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(client: Socket, userId: string) {
    this.connectedUsers.set(userId, client.id);
    client.data.userId = userId;
    console.log(`User authenticated: ${userId}`);
  }

  // Emit events to team members
  emitTodoCreated(teamId: string, todo: any) {
    this.server.to(`team-${teamId}`).emit('todo:created', todo);
  }

  emitTodoUpdated(teamId: string, todo: any) {
    this.server.to(`team-${teamId}`).emit('todo:updated', todo);
  }

  emitTodoDeleted(teamId: string, todoId: string) {
    this.server.to(`team-${teamId}`).emit('todo:deleted', { id: todoId });
  }

  emitTodoAssigned(teamId: string, todo: any) {
    this.server.to(`team-${teamId}`).emit('todo:assigned', todo);
  }

  emitTodoStatusChanged(teamId: string, todo: any) {
    this.server.to(`team-${teamId}`).emit('todo:status_changed', todo);
  }

  // Emit events to specific user
  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    console.log(`Attempting to emit ${event} to user ${userId}, socketId: ${socketId}`);
    console.log(`Connected users:`, Array.from(this.connectedUsers.entries()));
    
    if (socketId) {
      this.server.to(socketId).emit(event, data);
      console.log(`Emitted ${event} to user ${userId} with data:`, data);
    } else {
      console.log(`User ${userId} not connected, cannot emit ${event}`);
    }
  }

  // Emit team events
  emitTeamCreated(userId: string, team: any) {
    this.emitToUser(userId, 'team:created', team);
  }

  emitTeamUpdated(teamId: string, team: any) {
    this.server.to(`team-${teamId}`).emit('team:updated', team);
  }

  emitMemberAdded(teamId: string, data: any) {
    this.server.to(`team-${teamId}`).emit('team:member_added', data);
  }

  emitMemberRemoved(teamId: string, memberId: string) {
    this.server.to(`team-${teamId}`).emit('team:member_removed', { id: memberId });
  }
} 