import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Todo } from '../todos/entities/todo.entity';
import { CreateTeamDto } from './dtos/create-team.dto';
import { UpdateTeamDto } from './dtos/update-team.dto';
import { AddMemberDto } from './dtos/add-member.dto';
import { UsersService } from '../users/users.service';
import { TodoEventsGateway } from '../notifications/events/todo-events.gateway';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
    private usersService: UsersService,
    private todoEventsGateway: TodoEventsGateway,
  ) {}

  async create(createTeamDto: CreateTeamDto, ownerId: string): Promise<Team> {
    const team = this.teamsRepository.create({
      ...createTeamDto,
      ownerId,
    });

    const savedTeam = await this.teamsRepository.save(team);
    
    // Add owner as member
    const owner = await this.usersService.findById(ownerId);
    if (owner) {
      savedTeam.members = [owner];
      await this.teamsRepository.save(savedTeam);
    }

    // Return team with full relations
    return this.findById(savedTeam.id);
  }

  async findAll(): Promise<Team[]> {
    return this.teamsRepository.find({
      relations: ['members', 'owner'],
    });
  }

  async findById(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['members', 'owner'],
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async findMyTeams(userId: string): Promise<Team[]> {
    const teams = await this.teamsRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'members')
      .leftJoinAndSelect('team.owner', 'owner')
      .where('members.id = :userId', { userId })
      .orWhere('owner.id = :userId', { userId })
      .getMany();
    
    return teams;
  }

  async addMember(teamId: string, addMemberDto: AddMemberDto, userId: string): Promise<Team> {
    const team = await this.findById(teamId);
    
    // Check if user is owner or member
    const isOwner = team.ownerId === userId;
    const isMember = team.members.some(member => member.id === userId);
    
    if (!isOwner && !isMember) {
      throw new ForbiddenException('You are not authorized to add members to this team');
    }

    const user = await this.usersService.findByEmail(addMemberDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member
    const isAlreadyMember = team.members.some(member => member.id === user.id);
    if (isAlreadyMember) {
      throw new ForbiddenException('User is already a member of this team');
    }

    team.members.push(user);
    await this.teamsRepository.save(team);
    
    // Emit WebSocket event to team members
    this.todoEventsGateway.emitMemberAdded(teamId, {
      team,
      member: user,
      addedBy: userId,
    });
    
    // Send notification to the added user
    this.todoEventsGateway.emitToUser(user.id, 'notification:received', {
      type: 'team_member_added',
      title: 'Added to Team',
      message: `You have been added to team: ${team.name}`,
      data: {
        team,
        addedBy: userId,
      },
      timestamp: new Date().toISOString(),
    });
    
    // Return team with full relations
    return this.findById(teamId);
  }

  async removeMember(teamId: string, memberId: string, userId: string): Promise<Team> {
    const team = await this.findById(teamId);
    
    // Only owner can remove members
    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only team owner can remove members');
    }

    const removedMember = team.members.find(member => member.id === memberId);
    team.members = team.members.filter(member => member.id !== memberId);
    await this.teamsRepository.save(team);
    
    // Emit WebSocket event to team members
    this.todoEventsGateway.emitMemberRemoved(teamId, memberId);
    
    // Send notification to the removed user
    if (removedMember) {
      this.todoEventsGateway.emitToUser(memberId, 'notification:received', {
        type: 'team_member_removed',
        title: 'Removed from Team',
        message: `You have been removed from team: ${team.name}`,
        data: {
          team,
          removedBy: userId,
        },
        timestamp: new Date().toISOString(),
      });
    }
    
    // Return team with full relations
    return this.findById(teamId);
  }

  async isUserTeamMember(teamId: string, userId: string): Promise<boolean> {
    const team = await this.findById(teamId);
    const isOwner = team.ownerId === userId;
    const isMember = team.members.some(member => member.id === userId);
    
    return isOwner || isMember;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto, userId: string): Promise<Team> {
    const team = await this.findById(id);
    
    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only team owner can update team');
    }

    Object.assign(team, updateTeamDto);
    await this.teamsRepository.save(team);
    
    // Return team with full relations
    return this.findById(id);
  }

  async delete(id: string, userId: string): Promise<void> {
    const team = await this.findById(id);
    
    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only team owner can delete team');
    }

    // First, delete all todos associated with this team
    await this.todosRepository.delete({ teamId: id });
    
    // Then delete the team
    await this.teamsRepository.remove(team);
  }
} 