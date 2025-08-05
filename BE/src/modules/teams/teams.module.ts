import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './entities/team.entity';
import { Todo } from '../todos/entities/todo.entity';
import { UsersModule } from '../users/users.module';
import { TodoEventsGateway } from '../notifications/events/todo-events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Todo]), UsersModule],
  controllers: [TeamsController],
  providers: [TeamsService, TodoEventsGateway],
  exports: [TeamsService],
})
export class TeamsModule {} 