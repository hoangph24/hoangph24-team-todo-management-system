import { Module } from '@nestjs/common';
import { TodoEventsGateway } from './events/todo-events.gateway';

@Module({
  providers: [TodoEventsGateway],
  exports: [TodoEventsGateway],
})
export class NotificationsModule {} 