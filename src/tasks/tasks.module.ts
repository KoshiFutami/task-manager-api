import { Module } from '@nestjs/common';
import { TasksController } from './presentation/controllers/tasks.controller';
import { TasksService } from './application/services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './infrastructure/persistence/task.entity';
import { TaskRepositoryImpl } from './infrastructure/task.repository';
import { ITaskRepository } from './domain/repositories/task.repository';
import { TaskCreatedHandler } from './application/event-handlers/task-created.handler';
import { TaskStatusChangedHandler } from './application/event-handlers/task-status-changed.handler';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: ITaskRepository,
      useClass: TaskRepositoryImpl,
    },
    TaskCreatedHandler,
    TaskStatusChangedHandler,
  ],
})
export class TasksModule {}
