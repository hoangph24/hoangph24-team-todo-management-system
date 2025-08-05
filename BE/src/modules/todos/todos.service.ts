import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo, TodoStatus } from './entities/todo.entity';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { TeamsService } from '../teams/teams.service';
import { TodoEventsGateway } from '../notifications/events/todo-events.gateway';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
    private teamsService: TeamsService,
    private todoEventsGateway: TodoEventsGateway,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    // Check if user is member of the team if teamId is provided
    if (createTodoDto.teamId) {
      const isMember = await this.teamsService.isUserTeamMember(createTodoDto.teamId, userId);
      if (!isMember) {
        throw new ForbiddenException('You are not a member of this team');
      }
    }

    const todo = this.todosRepository.create({
      ...createTodoDto,
      createdById: userId,
      dueDate: createTodoDto.dueDate ? new Date(createTodoDto.dueDate) : null,
    });

    const savedTodo = await this.todosRepository.save(todo);
    
    // Emit WebSocket event if todo has a team
    if (savedTodo.teamId) {
      this.todoEventsGateway.emitTodoCreated(savedTodo.teamId, savedTodo);
    }

    // Send notification to assignee if assigned
    if (savedTodo.assigneeId && savedTodo.assigneeId !== userId) {
      this.todoEventsGateway.emitToUser(savedTodo.assigneeId, 'notification:received', {
        type: 'todo_created',
        title: 'New Task Created',
        message: `A new task has been created and assigned to you: ${savedTodo.title}`,
        data: savedTodo,
        timestamp: new Date().toISOString(),
      });
    }

    // Return the todo with full relations
    return this.findById(savedTodo.id);
  }

  async findAll(): Promise<Todo[]> {
    return this.todosRepository.find({
      relations: ['assignee', 'team', 'createdBy'],
    });
  }

  async findById(id: string): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id },
      relations: ['assignee', 'team', 'createdBy'],
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async findMyTodos(userId: string): Promise<Todo[]> {
    return this.todosRepository.find({
      where: [
        { createdById: userId },
        { assigneeId: userId },
      ],
      relations: ['assignee', 'team', 'createdBy'],
    });
  }

  async findByTeam(teamId: string, userId: string): Promise<Todo[]> {
    // Check if user is member of the team
    const team = await this.teamsService.findById(teamId);
    const isMember = team.members.some(member => member.id === userId) || team.ownerId === userId;
    
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    return this.todosRepository.find({
      where: { teamId },
      relations: ['assignee', 'team', 'createdBy'],
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string): Promise<Todo> {
    const todo = await this.findById(id);
    
    // Check if user can update this todo
    const canUpdate = todo.createdById === userId || todo.assigneeId === userId;
    if (!canUpdate) {
      throw new ForbiddenException('You can only update your own todos or assigned todos');
    }

    // Handle dueDate conversion if provided
    const updateData: any = { ...updateTodoDto };
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    Object.assign(todo, updateData);
    await this.todosRepository.save(todo);
    
    // Reload the todo with updated relationships
    const updatedTodo = await this.findById(id);
    
    // Emit WebSocket event if todo has a team
    if (updatedTodo.teamId) {
      this.todoEventsGateway.emitTodoUpdated(updatedTodo.teamId, updatedTodo);
    }

    // Send notification to other involved users
    const otherUserId = updatedTodo.createdById === userId ? updatedTodo.assigneeId : updatedTodo.createdById;
    if (otherUserId && otherUserId !== userId) {
      this.todoEventsGateway.emitToUser(otherUserId, 'notification:received', {
        type: 'todo_updated',
        title: 'Task Updated',
        message: `Task "${updatedTodo.title}" has been updated`,
        data: updatedTodo,
        timestamp: new Date().toISOString(),
      });
    }

    return updatedTodo;
  }

  async delete(id: string, userId: string): Promise<void> {
    const todo = await this.findById(id);
    
    if (todo.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own todos');
    }

    const teamId = todo.teamId;
    await this.todosRepository.remove(todo);
    
    // Emit WebSocket event if todo had a team
    if (teamId) {
      this.todoEventsGateway.emitTodoDeleted(teamId, todo.id);
    }
  }

  async assignTodo(todoId: string, assigneeId: string, userId: string): Promise<Todo> {
    
    const todo = await this.findById(todoId);
    
    // Check if user can assign this todo
    const canAssign = todo.createdById === userId;
    if (!canAssign) {
      throw new ForbiddenException('You can only assign todos you created');
    }

    // Use update method instead of save to ensure proper update
    await this.todosRepository.update(todoId, { assigneeId });
    
    // Reload the todo with updated relationships
    const updatedTodo = await this.findById(todoId);
    
    // Emit WebSocket event if todo has a team
    if (updatedTodo.teamId) {
      this.todoEventsGateway.emitTodoAssigned(updatedTodo.teamId, updatedTodo);
    }
    
    // Emit notification to the assigned user
    this.todoEventsGateway.emitToUser(assigneeId, 'notification:received', {
      type: 'todo_assigned',
      title: 'Task Assigned',
      message: `You have been assigned to task: ${updatedTodo.title}`,
      data: updatedTodo,
      timestamp: new Date().toISOString(),
    });

    return updatedTodo;
  }

  async updateStatus(todoId: string, status: TodoStatus, userId: string): Promise<Todo> {
    const todo = await this.findById(todoId);
    
    // Check if user can update status
    const canUpdateStatus = todo.createdById === userId || todo.assigneeId === userId;
    if (!canUpdateStatus) {
      throw new ForbiddenException('You can only update status of your own todos or assigned todos');
    }

    todo.status = status;
    await this.todosRepository.save(todo);
    
    // Reload the todo with updated relationships
    const updatedTodo = await this.findById(todoId);
    
    // Emit WebSocket event if todo has a team
    if (updatedTodo.teamId) {
      this.todoEventsGateway.emitTodoStatusChanged(updatedTodo.teamId, updatedTodo);
    }

    // Send notification to other involved users
    const otherUserId = updatedTodo.createdById === userId ? updatedTodo.assigneeId : updatedTodo.createdById;
    if (otherUserId && otherUserId !== userId) {
      this.todoEventsGateway.emitToUser(otherUserId, 'notification:received', {
        type: 'todo_status_changed',
        title: 'Task Status Changed',
        message: `Task "${updatedTodo.title}" status changed to ${status}`,
        data: updatedTodo,
        timestamp: new Date().toISOString(),
      });
    }

    return updatedTodo;
  }

  async getTodosByStatus(status: TodoStatus, userId: string): Promise<Todo[]> {
    return this.todosRepository.find({
      where: [
        { status, createdById: userId },
        { status, assigneeId: userId },
      ],
      relations: ['assignee', 'team', 'createdBy'],
    });
  }

  async getOverdueTodos(userId: string): Promise<Todo[]> {
    const now = new Date();
    return this.todosRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.assignee', 'assignee')
      .leftJoinAndSelect('todo.team', 'team')
      .leftJoinAndSelect('todo.createdBy', 'createdBy')
      .where('todo.dueDate < :now', { now })
      .andWhere('todo.status != :completed', { completed: TodoStatus.COMPLETED })
      .andWhere('(todo.createdById = :userId OR todo.assigneeId = :userId)', { userId })
      .getMany();
  }
} 