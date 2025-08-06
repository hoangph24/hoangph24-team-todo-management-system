import { Test, TestingModule } from '@nestjs/testing';
import { TodoEventsGateway } from './todo-events.gateway';
import { Todo } from '../../todos/entities/todo.entity';

describe('TodoEventsGateway', () => {
  let gateway: TodoEventsGateway;

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };

  const mockSocket = {
    id: 'socket1',
    data: {},
    join: jest.fn(),
    leave: jest.fn(),
    emit: jest.fn(),
  };

  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    dueDate: new Date(),
    status: 'pending' as any,
    priority: 'medium' as any,
    assigneeId: 'user1',
    teamId: 'team1',
    createdById: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: null,
    team: null,
    createdBy: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoEventsGateway],
    }).compile();

    gateway = module.get<TodoEventsGateway>(TodoEventsGateway);
    gateway.server = mockServer as any;
    
    // Mock the connectedUsers Map
    (gateway as any).connectedUsers = new Map();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  describe('handleJoinTeam', () => {
    it('should handle join team event', () => {
      const client = mockSocket as any;
      const teamId = 'team1';

      gateway.handleJoinTeam(client, teamId);

      expect(client.join).toHaveBeenCalledWith('team-team1');
      expect(client.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleLeaveTeam', () => {
    it('should handle leave team event', () => {
      const client = mockSocket as any;
      const teamId = 'team1';

      gateway.handleLeaveTeam(client, teamId);

      expect(client.leave).toHaveBeenCalledWith('team-team1');
      expect(client.emit).not.toHaveBeenCalled();
    });
  });

  describe('emitTodoCreated', () => {
    it('should emit todo created event', () => {
      const teamId = 'team1';

      gateway.emitTodoCreated(teamId, mockTodo);

      expect(mockServer.to).toHaveBeenCalledWith('team-team1');
      expect(mockServer.emit).toHaveBeenCalledWith('todo:created', mockTodo);
    });
  });

  describe('emitTodoUpdated', () => {
    it('should emit todo updated event', () => {
      const teamId = 'team1';

      gateway.emitTodoUpdated(teamId, mockTodo);

      expect(mockServer.to).toHaveBeenCalledWith('team-team1');
      expect(mockServer.emit).toHaveBeenCalledWith('todo:updated', mockTodo);
    });
  });

  describe('emitTodoDeleted', () => {
    it('should emit todo deleted event', () => {
      const teamId = 'team1';
      const todoId = '1';

      gateway.emitTodoDeleted(teamId, todoId);

      expect(mockServer.to).toHaveBeenCalledWith('team-team1');
      expect(mockServer.emit).toHaveBeenCalledWith('todo:deleted', { id: todoId });
    });
  });

  describe('emitTodoAssigned', () => {
    it('should emit todo assigned event', () => {
      const teamId = 'team1';

      gateway.emitTodoAssigned(teamId, mockTodo);

      expect(mockServer.to).toHaveBeenCalledWith('team-team1');
      expect(mockServer.emit).toHaveBeenCalledWith('todo:assigned', mockTodo);
    });
  });

  describe('emitTodoStatusChanged', () => {
    it('should emit todo status changed event', () => {
      const teamId = 'team1';

      gateway.emitTodoStatusChanged(teamId, mockTodo);

      expect(mockServer.to).toHaveBeenCalledWith('team-team1');
      expect(mockServer.emit).toHaveBeenCalledWith('todo:status_changed', mockTodo);
    });
  });

  describe('emitToUser', () => {
    it('should emit event to specific user', () => {
      const userId = 'user1';
      const event = 'notification:received';
      const data = { message: 'test' };

      // Mock connectedUsers Map
      (gateway as any).connectedUsers.set(userId, 'socket1');

      gateway.emitToUser(userId, event, data);

      expect(mockServer.to).toHaveBeenCalledWith('socket1');
      expect(mockServer.emit).toHaveBeenCalledWith(event, data);
    });

    it('should not emit event if user not connected', () => {
      const userId = 'user1';
      const event = 'notification:received';
      const data = { message: 'test' };

      // Mock empty connectedUsers Map
      (gateway as any).connectedUsers.clear();

      gateway.emitToUser(userId, event, data);

      expect(mockServer.to).not.toHaveBeenCalled();
      expect(mockServer.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleAuthenticate', () => {
    it('should authenticate user', () => {
      const client = mockSocket as any;
      const userId = 'user1';

      gateway.handleAuthenticate(client, userId);

      expect((gateway as any).connectedUsers.get(userId)).toBe('socket1');
    });
  });
}); 