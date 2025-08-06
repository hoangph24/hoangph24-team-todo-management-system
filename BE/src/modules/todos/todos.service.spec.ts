import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { TodoStatus } from './entities/todo.entity';
import { TodoPriority } from './entities/todo.entity';
import { TeamsService } from '../teams/teams.service';
import { TodoEventsGateway } from '../notifications/events/todo-events.gateway';

describe('TodosService', () => {
  let service: TodosService;
  let todoRepository: Repository<Todo>;
  let teamsService: TeamsService;
  let todoEventsGateway: TodoEventsGateway;

  const mockTodoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  const mockTeamsService = {
    findById: jest.fn(),
    isUserTeamMember: jest.fn(),
  };

  const mockTodoEventsGateway = {
    emitTodoCreated: jest.fn(),
    emitTodoUpdated: jest.fn(),
    emitTodoDeleted: jest.fn(),
    emitTodoAssigned: jest.fn(),
    emitTodoStatusChanged: jest.fn(),
    emitToUser: jest.fn(),
  };

  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    dueDate: new Date('2024-12-31'),
    status: TodoStatus.PENDING,
    priority: TodoPriority.MEDIUM,
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
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
        {
          provide: TodoEventsGateway,
          useValue: mockTodoEventsGateway,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
    teamsService = module.get<TeamsService>(TeamsService);
    todoEventsGateway = module.get<TodoEventsGateway>(TodoEventsGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a todo successfully', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'New Todo',
        description: 'New Description',
        dueDate: '2024-12-31',
        priority: TodoPriority.HIGH,
        teamId: 'team1',
        assigneeId: 'user1',
      };

      const userId = 'user1';

      mockTodoRepository.create.mockReturnValue(mockTodo);
      mockTodoRepository.save.mockResolvedValue(mockTodo);
      mockTodoRepository.findOne.mockResolvedValue(mockTodo);
      mockTeamsService.isUserTeamMember.mockResolvedValue(true);

      const result = await service.create(createTodoDto, userId);

      expect(mockTodoRepository.create).toHaveBeenCalledWith({
        ...createTodoDto,
        createdById: userId,
        dueDate: new Date(createTodoDto.dueDate),
      });
      expect(mockTodoRepository.save).toHaveBeenCalledWith(mockTodo);
      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTodo.id },
        relations: ['assignee', 'team', 'createdBy'],
      });
      expect(mockTodoEventsGateway.emitTodoCreated).toHaveBeenCalledWith('team1', mockTodo);
      expect(result).toEqual(mockTodo);
    });

    it('should throw error if user is not team member', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'New Todo',
        description: 'New Description',
        dueDate: '2024-12-31',
        priority: TodoPriority.HIGH,
        teamId: 'team1',
        assigneeId: 'user1',
      };

      const userId = 'user1';

      mockTeamsService.isUserTeamMember.mockResolvedValue(false);

      await expect(service.create(createTodoDto, userId)).rejects.toThrow(
        'You are not a member of this team'
      );
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      const todos = [mockTodo];
      mockTodoRepository.find.mockResolvedValue(todos);

      const result = await service.findAll();

      expect(mockTodoRepository.find).toHaveBeenCalledWith({
        relations: ['assignee', 'team', 'createdBy'],
      });
      expect(result).toEqual(todos);
    });
  });

  describe('findMyTodos', () => {
    it('should return user todos', async () => {
      const userId = 'user1';
      const todos = [mockTodo];

      mockTodoRepository.find.mockResolvedValue(todos);

      const result = await service.findMyTodos(userId);

      expect(mockTodoRepository.find).toHaveBeenCalledWith({
        where: [
          { createdById: userId },
          { assigneeId: userId },
        ],
        relations: ['assignee', 'team', 'createdBy'],
      });
      expect(result).toEqual(todos);
    });
  });

  describe('findByTeam', () => {
    it('should return team todos', async () => {
      const teamId = 'team1';
      const userId = 'user1';
      const todos = [mockTodo];

      mockTodoRepository.find.mockResolvedValue(todos);
      mockTeamsService.findById.mockResolvedValue({
        id: teamId,
        ownerId: userId,
        members: [{ id: userId }],
      });

      const result = await service.findByTeam(teamId, userId);

      expect(mockTodoRepository.find).toHaveBeenCalledWith({
        where: { teamId },
        relations: ['assignee', 'team', 'createdBy'],
      });
      expect(result).toEqual(todos);
    });
  });

  describe('getTodosByStatus', () => {
    it('should return todos by status', async () => {
      const status = TodoStatus.PENDING;
      const userId = 'user1';
      const todos = [mockTodo];

      mockTodoRepository.find.mockResolvedValue(todos);

      const result = await service.getTodosByStatus(status, userId);

      expect(mockTodoRepository.find).toHaveBeenCalledWith({
        where: [
          { status, createdById: userId },
          { status, assigneeId: userId },
        ],
        relations: ['assignee', 'team', 'createdBy'],
      });
      expect(result).toEqual(todos);
    });
  });



  describe('findById', () => {
    it('should return a todo by id', async () => {
      const id = '1';
      mockTodoRepository.findOne.mockResolvedValue(mockTodo);

      const result = await service.findById(id);

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['assignee', 'team', 'createdBy'],
      });
      expect(result).toEqual(mockTodo);
    });

    it('should throw error if todo not found', async () => {
      const id = '999';
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow('Todo not found');
    });
  });

  describe('update', () => {
    it('should update a todo successfully', async () => {
      const id = '1';
      const userId = 'user1';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        description: 'Updated Description',
      };

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);
      mockTodoRepository.save.mockResolvedValue({ ...mockTodo, ...updateTodoDto });

      const result = await service.update(id, updateTodoDto, userId);

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['assignee', 'team', 'createdBy'],
      });
      expect(mockTodoRepository.save).toHaveBeenCalled();
      expect(mockTodoEventsGateway.emitTodoUpdated).toHaveBeenCalledWith(mockTodo.teamId, expect.any(Object));
      expect(result).toEqual({ ...mockTodo, ...updateTodoDto });
    });

    it('should throw error if todo not found', async () => {
      const id = '999';
      const userId = 'user1';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
      };

      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateTodoDto, userId)).rejects.toThrow('Todo not found');
    });
  });

  describe('assignTodo', () => {
    it('should assign todo to user successfully', async () => {
      const id = '1';
      const assigneeId = 'user2';
      const userId = 'user1';

      const mockUpdatedTodo = { ...mockTodo, assigneeId };

      // First call to findById (initial load)
      mockTodoRepository.findOne.mockResolvedValueOnce(mockTodo);
      // Second call to findById (after update)
      mockTodoRepository.findOne.mockResolvedValueOnce(mockUpdatedTodo);
      // Update call
      mockTodoRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.assignTodo(id, assigneeId, userId);

      // Verify findById was called twice (initial load + reload after update)
      expect(mockTodoRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['assignee', 'team', 'createdBy'],
      });
      // Verify update was called with correct parameters
      expect(mockTodoRepository.update).toHaveBeenCalledWith(id, { assigneeId });
      expect(mockTodoEventsGateway.emitTodoAssigned).toHaveBeenCalledWith(mockTodo.teamId, mockUpdatedTodo);
      expect(mockTodoEventsGateway.emitToUser).toHaveBeenCalledWith(assigneeId, 'notification:received', {
        type: 'todo_assigned',
        title: 'Task Assigned',
        message: `You have been assigned to task: ${mockUpdatedTodo.title}`,
        data: mockUpdatedTodo,
        timestamp: expect.any(String),
      });
      expect(result).toEqual(mockUpdatedTodo);
    });

    it('should throw error if todo not found', async () => {
      const id = '999';
      const assigneeId = 'user2';
      const userId = 'user1';

      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.assignTodo(id, assigneeId, userId)).rejects.toThrow('Todo not found');
    });
  });

  describe('updateStatus', () => {
    it('should update todo status successfully', async () => {
      const id = '1';
      const status = TodoStatus.IN_PROGRESS;
      const userId = 'user1';

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);
      mockTodoRepository.save.mockResolvedValue({ ...mockTodo, status });

      const result = await service.updateStatus(id, status, userId);

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['assignee', 'team', 'createdBy'],
      });
      expect(mockTodoRepository.save).toHaveBeenCalledWith({ ...mockTodo, status });
      expect(mockTodoEventsGateway.emitTodoStatusChanged).toHaveBeenCalledWith(mockTodo.teamId, expect.any(Object));
      expect(result).toEqual({ ...mockTodo, status });
    });

    it('should throw error if todo not found', async () => {
      const id = '999';
      const status = TodoStatus.IN_PROGRESS;
      const userId = 'user1';

      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.updateStatus(id, status, userId)).rejects.toThrow('Todo not found');
    });
  });

  describe('delete', () => {
    it('should delete a todo successfully', async () => {
      const id = '1';
      const userId = 'user1';

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);
      mockTodoRepository.remove.mockResolvedValue(undefined);

      const result = await service.delete(id, userId);

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['assignee', 'team', 'createdBy'],
      });
      expect(mockTodoRepository.remove).toHaveBeenCalledWith(mockTodo);
      expect(mockTodoEventsGateway.emitTodoDeleted).toHaveBeenCalledWith(mockTodo.teamId, id);
      expect(result).toBeUndefined();
    });

    it('should throw error if todo not found', async () => {
      const id = '999';
      const userId = 'user1';

      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(id, userId)).rejects.toThrow('Todo not found');
    });
  });
}); 