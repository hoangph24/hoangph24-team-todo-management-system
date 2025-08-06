import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamsService } from './teams.service';
import { Team } from './entities/team.entity';
import { Todo } from '../todos/entities/todo.entity';
import { CreateTeamDto } from './dtos/create-team.dto';
import { UpdateTeamDto } from './dtos/update-team.dto';
import { AddMemberDto } from './dtos/add-member.dto';
import { UsersService } from '../users/users.service';
import { TodoEventsGateway } from '../notifications/events/todo-events.gateway';

describe('TeamsService', () => {
  let service: TeamsService;
  let teamRepository: Repository<Team>;
  let todoRepository: Repository<Todo>;
  let usersService: UsersService;
  let todoEventsGateway: TodoEventsGateway;

  const mockTeamRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    remove: jest.fn(),
  };

  const mockTodoRepository = {
    delete: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  const mockTodoEventsGateway = {
    emitMemberAdded: jest.fn(),
    emitMemberRemoved: jest.fn(),
    emitToUser: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockTeam: Team = {
    id: '1',
    name: 'Test Team',
    description: 'Test Description',
    ownerId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: mockUser as any,
    members: [mockUser as any],
    todos: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository,
        },
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TodoEventsGateway,
          useValue: mockTodoEventsGateway,
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
    usersService = module.get<UsersService>(UsersService);
    todoEventsGateway = module.get<TodoEventsGateway>(TodoEventsGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a team successfully', async () => {
      const createTeamDto: CreateTeamDto = {
        name: 'New Team',
        description: 'New Description',
      };
      const userId = '1';

      mockTeamRepository.create.mockReturnValue(mockTeam);
      mockTeamRepository.save.mockResolvedValue(mockTeam);
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockTeamRepository.findOne.mockResolvedValue(mockTeam);

      const result = await service.create(createTeamDto, userId);

      expect(mockTeamRepository.create).toHaveBeenCalledWith({
        ...createTeamDto,
        ownerId: userId,
      });
      expect(mockTeamRepository.save).toHaveBeenCalledWith(mockTeam);
      expect(mockUsersService.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockTeam);
    });
  });

  describe('findAll', () => {
    it('should return all teams', async () => {
      const teams = [mockTeam];
      mockTeamRepository.find.mockResolvedValue(teams);

      const result = await service.findAll();

      expect(mockTeamRepository.find).toHaveBeenCalledWith({
        relations: ['members', 'owner'],
      });
      expect(result).toEqual(teams);
    });
  });

  describe('findById', () => {
    it('should return team if found', async () => {
      const id = '1';
      mockTeamRepository.findOne.mockResolvedValue(mockTeam);

      const result = await service.findById(id);

      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['members', 'owner'],
      });
      expect(result).toEqual(mockTeam);
    });

    it('should throw error if team not found', async () => {
      const id = '999';
      mockTeamRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow('Team not found');
    });
  });

  describe('findMyTeams', () => {
    it('should return user teams', async () => {
      const userId = '1';
      const teams = [mockTeam];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(teams),
      };

      mockTeamRepository.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await service.findMyTeams(userId);

      expect(mockTeamRepository.createQueryBuilder).toHaveBeenCalledWith('team');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('team.members', 'members');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('team.owner', 'owner');
      expect(queryBuilder.where).toHaveBeenCalledWith('members.id = :userId', { userId });
      expect(queryBuilder.orWhere).toHaveBeenCalledWith('owner.id = :userId', { userId });
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(teams);
    });
  });

  describe('addMember', () => {
    it('should add member to team successfully', async () => {
      const teamId = '1';
      const addMemberDto: AddMemberDto = { email: 'new@example.com' };
      const userId = '1';
      const newMember = { ...mockUser, id: '2', email: 'new@example.com' };
      const updatedTeam = { ...mockTeam, members: [...mockTeam.members, newMember] };

      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockUsersService.findByEmail.mockResolvedValue(newMember);
      mockTeamRepository.save.mockResolvedValue(updatedTeam);
      mockTeamRepository.findOne.mockResolvedValueOnce(mockTeam).mockResolvedValueOnce(updatedTeam);

      const result = await service.addMember(teamId, addMemberDto, userId);

      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { id: teamId },
        relations: ['members', 'owner'],
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(addMemberDto.email);
      expect(mockTeamRepository.save).toHaveBeenCalledWith(updatedTeam);
      expect(mockTodoEventsGateway.emitMemberAdded).toHaveBeenCalledWith(teamId, {
        team: updatedTeam,
        member: newMember,
        addedBy: userId,
      });
      expect(mockTodoEventsGateway.emitToUser).toHaveBeenCalledWith(newMember.id, 'notification:received', {
        type: 'team_member_added',
        title: 'Added to Team',
        message: `You have been added to team: ${mockTeam.name}`,
        data: {
          team: updatedTeam,
          addedBy: userId,
        },
        timestamp: expect.any(String),
      });
      expect(result.members).toContain(newMember);
    });

    it('should allow team member to add new member', async () => {
      const teamId = '1';
      const addMemberDto: AddMemberDto = { email: 'new@example.com' };
      const userId = '2'; // Team member (not owner)
      const newMember = { ...mockUser, id: '3', email: 'new@example.com' };
      const teamWithMember = { ...mockTeam, ownerId: '1', members: [{ ...mockUser, id: '2' }] };
      const updatedTeam = { ...teamWithMember, members: [...teamWithMember.members, newMember] };

      mockTeamRepository.findOne.mockResolvedValue(teamWithMember);
      mockUsersService.findByEmail.mockResolvedValue(newMember);
      mockTeamRepository.save.mockResolvedValue(updatedTeam);
      mockTeamRepository.findOne.mockResolvedValueOnce(teamWithMember).mockResolvedValueOnce(updatedTeam);

      const result = await service.addMember(teamId, addMemberDto, userId);

      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { id: teamId },
        relations: ['members', 'owner'],
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(addMemberDto.email);
      expect(mockTodoEventsGateway.emitMemberAdded).toHaveBeenCalledWith(teamId, {
        team: updatedTeam,
        member: newMember,
        addedBy: userId,
      });
      expect(result.members).toContain(newMember);
    });

    it('should throw error if team not found', async () => {
      const teamId = '999';
      const addMemberDto: AddMemberDto = { email: 'new@example.com' };
      const userId = '1';

      mockTeamRepository.findOne.mockResolvedValue(null);

      await expect(service.addMember(teamId, addMemberDto, userId)).rejects.toThrow('Team not found');
    });

    it('should throw error if user not authorized', async () => {
      const teamId = '1';
      const addMemberDto: AddMemberDto = { email: 'new@example.com' };
      const userId = '999'; // User not owner or member

      mockTeamRepository.findOne.mockResolvedValue(mockTeam);

      await expect(service.addMember(teamId, addMemberDto, userId)).rejects.toThrow('You are not authorized to add members to this team');
    });

    it('should throw error if user not found', async () => {
      const teamId = '1';
      const addMemberDto: AddMemberDto = { email: 'nonexistent@example.com' };
      const userId = '1';

      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.addMember(teamId, addMemberDto, userId)).rejects.toThrow('User not found');
    });

    it('should throw error if user is already a member', async () => {
      const teamId = '1';
      const addMemberDto: AddMemberDto = { email: 'existing@example.com' };
      const userId = '1';
      const existingMember = { ...mockUser, email: 'existing@example.com' };
      const teamWithExistingMember = { ...mockTeam, members: [existingMember] };

      mockTeamRepository.findOne.mockResolvedValue(teamWithExistingMember);
      mockUsersService.findByEmail.mockResolvedValue(existingMember);

      await expect(service.addMember(teamId, addMemberDto, userId)).rejects.toThrow('User is already a member of this team');
    });
  });

  describe('removeMember', () => {
    it('should remove member from team successfully', async () => {
      const teamId = '1';
      const memberId = '2';
      const userId = '1';
      const memberToRemove = { ...mockUser, id: '2' };
      const teamWithMembers = { ...mockTeam, members: [memberToRemove] };
      const updatedTeam = { ...teamWithMembers, members: [] };

      mockTeamRepository.findOne.mockResolvedValue(teamWithMembers);
      mockTeamRepository.save.mockResolvedValue(updatedTeam);
      mockTeamRepository.findOne.mockResolvedValueOnce(teamWithMembers).mockResolvedValueOnce(updatedTeam);

      const result = await service.removeMember(teamId, memberId, userId);

      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { id: teamId },
        relations: ['members', 'owner'],
      });
      expect(mockTeamRepository.save).toHaveBeenCalledWith(updatedTeam);
      expect(mockTodoEventsGateway.emitMemberRemoved).toHaveBeenCalledWith(teamId, memberId);
      expect(mockTodoEventsGateway.emitToUser).toHaveBeenCalledWith(memberId, 'notification:received', {
        type: 'team_member_removed',
        title: 'Removed from Team',
        message: `You have been removed from team: ${mockTeam.name}`,
        data: {
          team: updatedTeam,
          removedBy: userId,
        },
        timestamp: expect.any(String),
      });
      expect(result.members).not.toContain(memberToRemove);
    });

    it('should throw error if user not team owner', async () => {
      const teamId = '1';
      const memberId = '2';
      const userId = '2'; // Different user

      mockTeamRepository.findOne.mockResolvedValue(mockTeam);

      await expect(service.removeMember(teamId, memberId, userId)).rejects.toThrow('Only team owner can remove members');
    });
  });

  describe('isUserTeamMember', () => {
    it('should return true if user is team member', async () => {
      const teamId = '1';
      const userId = '1';
      const teamWithMembers = { ...mockTeam, members: [mockUser] };

      mockTeamRepository.findOne.mockResolvedValue(teamWithMembers);

      const result = await service.isUserTeamMember(teamId, userId);

      expect(result).toBe(true);
    });

    it('should return true if user is team owner', async () => {
      const teamId = '1';
      const userId = '1';
      const teamWithOwner = { ...mockTeam, ownerId: userId, members: [] };

      mockTeamRepository.findOne.mockResolvedValue(teamWithOwner);

      const result = await service.isUserTeamMember(teamId, userId);

      expect(result).toBe(true);
    });

    it('should return false if user is not team member', async () => {
      const teamId = '1';
      const userId = '999';
      const teamWithMembers = { ...mockTeam, members: [mockUser] };

      mockTeamRepository.findOne.mockResolvedValue(teamWithMembers);

      const result = await service.isUserTeamMember(teamId, userId);

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should update team successfully', async () => {
      const id = '1';
      const updateTeamDto: UpdateTeamDto = { name: 'Updated Team' };
      const updatedTeam = { ...mockTeam, ...updateTeamDto };

      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockTeamRepository.save.mockResolvedValue(updatedTeam);
      mockTeamRepository.findOne.mockResolvedValueOnce(mockTeam).mockResolvedValueOnce(updatedTeam);

      const userId = '1';
      const result = await service.update(id, updateTeamDto, userId);

      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['members', 'owner'],
      });
      expect(mockTeamRepository.save).toHaveBeenCalledWith(updatedTeam);
      expect(result).toEqual(updatedTeam);
    });

    it('should throw error if team not found', async () => {
      const id = '999';
      const updateTeamDto: UpdateTeamDto = { name: 'Updated Team' };
      const userId = '1';

      mockTeamRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateTeamDto, userId)).rejects.toThrow('Team not found');
    });

    it('should throw error if user is not team owner', async () => {
      const id = '1';
      const updateTeamDto: UpdateTeamDto = { name: 'Updated Team' };
      const userId = '2'; // Not the owner

      mockTeamRepository.findOne.mockResolvedValue(mockTeam);

      await expect(service.update(id, updateTeamDto, userId)).rejects.toThrow('Only team owner can update team');
    });
  });

  describe('delete', () => {
    it('should delete team and associated todos successfully', async () => {
      const id = '1';
      const userId = '1';
      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockTodoRepository.delete.mockResolvedValue({ affected: 5 });
      mockTeamRepository.remove.mockResolvedValue(undefined);

      await service.delete(id, userId);

      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['members', 'owner'],
      });
      expect(mockTodoRepository.delete).toHaveBeenCalledWith({ teamId: id });
      expect(mockTeamRepository.remove).toHaveBeenCalledWith(mockTeam);
    });

    it('should throw error if team not found', async () => {
      const id = '999';
      const userId = '1';
      mockTeamRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(id, userId)).rejects.toThrow('Team not found');
    });

    it('should throw error if user is not team owner', async () => {
      const id = '1';
      const userId = '2'; // Not the owner

      mockTeamRepository.findOne.mockResolvedValue(mockTeam);

      await expect(service.delete(id, userId)).rejects.toThrow('Only team owner can delete team');
    });
  });
}); 