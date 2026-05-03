import { Module } from '@nestjs/common';
import { TasksController } from './presentation/controllers/tasks.controller';
import { TasksService } from './application/services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './infrastructure/persistence/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
