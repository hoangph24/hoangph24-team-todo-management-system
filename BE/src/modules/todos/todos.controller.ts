import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TodoStatus } from './entities/todo.entity';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    return this.todosService.create(createTodoDto, req.user.id);
  }

  @Get()
  async findAll() {
    return this.todosService.findAll();
  }

  @Get('my-todos')
  async findMyTodos(@Request() req) {
    return this.todosService.findMyTodos(req.user.id);
  }

  @Get('team/:teamId')
  async findByTeam(@Param('teamId') teamId: string, @Request() req) {
    return this.todosService.findByTeam(teamId, req.user.id);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: TodoStatus, @Request() req) {
    return this.todosService.getTodosByStatus(status, req.user.id);
  }

  @Get('overdue')
  async getOverdueTodos(@Request() req) {
    return this.todosService.getOverdueTodos(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.todosService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ) {
    return this.todosService.update(id, updateTodoDto, req.user.id);
  }

  @Put(':id/assign/:assigneeId')
  async assignTodo(
    @Param('id') id: string,
    @Param('assigneeId') assigneeId: string,
    @Request() req,
  ) {
    return this.todosService.assignTodo(id, assigneeId, req.user.id);
  }

  @Put(':id/status/:status')
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: TodoStatus,
    @Request() req,
  ) {
    return this.todosService.updateStatus(id, status, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.todosService.delete(id, req.user.id);
  }
} 