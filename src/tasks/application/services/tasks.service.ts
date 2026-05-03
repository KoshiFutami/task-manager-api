import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../infrastructure/persistence/task.entity';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskResponseDto } from '../dtos/task-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTaskDto } from '../dtos/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  findAll(): Promise<TaskResponseDto[]> {
    return this.taskRepository.find() as Promise<TaskResponseDto[]>;
  }

  create(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task) as Promise<TaskResponseDto>;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
    await this.taskRepository.update(id, updateTaskDto);
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task not found: ${id}`);
    }
    return task as TaskResponseDto;
  }

  async remove(id: string) {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task not found: ${id}`);
    }
  }
}
