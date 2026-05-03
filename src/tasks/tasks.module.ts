import { Module } from '@nestjs/common';
import { TasksController } from './presentation/controllers/tasks.controller';
import { TasksService } from './application/services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './infrastructure/persistence/task.entity';
import { TaskRepositoryImpl } from './infrastructure/task.repository';
import { ITaskRepository } from './domain/repositories/task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: ITaskRepository,
      useClass: TaskRepositoryImpl,
    },
  ],
})
export class TasksModule {}
