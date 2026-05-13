import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from 'src/tasks/domain/entities/task.aggregate';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskResponseDto } from '../dtos/task-response.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { ITaskRepository } from 'src/tasks/domain/repositories/task.repository';
import { TaskTitle } from 'src/tasks/domain/value-objects/task-title';
import { TaskDescription } from 'src/tasks/domain/value-objects/task-description';
import { TaskId } from 'src/tasks/domain/value-objects/task-id';
import { TaskStatus } from 'src/tasks/domain/value-objects/task-status';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InvalidTaskStatusTransitionError } from 'src/tasks/domain/exceptions/invalid-task-status-transition-error';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { UserId } from 'src/users/domain/value-objects/user-id';

@Injectable()
export class TasksService {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.findAll();
    return tasks.map((task) => this.toDto(task));
  }

  async create(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = Task.create(
      TaskTitle.from(createTaskDto.title),
      TaskDescription.from(createTaskDto.description),
    );
    await this.taskRepository.save(task);

    task.getDomainEvents().forEach((event) => {
      this.eventEmitter.emit(event.eventType, event);
    });
    task.clearDomainEvents();

    return this.toDto(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(TaskId.from(id));
    if (!task) throw new NotFoundException(`Task not found: ${id}`);

    if (updateTaskDto.title) task.changeTitle(TaskTitle.from(updateTaskDto.title));
    if (updateTaskDto.description)
      task.changeDescription(TaskDescription.from(updateTaskDto.description));
    try {
      if (updateTaskDto.status) task.changeStatus(TaskStatus.from(updateTaskDto.status));
    } catch (error) {
      if (error instanceof InvalidTaskStatusTransitionError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    await this.taskRepository.save(task);

    task.getDomainEvents().forEach((event) => {
      this.eventEmitter.emit(event.eventType, event);
    });
    task.clearDomainEvents();

    return this.toDto(task);
  }

  async remove(id: string) {
    const taskId = TaskId.from(id);
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException(`Task not found: ${id}`);

    await this.taskRepository.delete(taskId);
  }

  async assignTo(taskId: string, userId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(TaskId.from(taskId));
    if (!task) throw new NotFoundException(`Task not found: ${taskId}`);

    const user = await this.userRepository.findById(UserId.from(userId));
    if (!user) throw new NotFoundException(`User not found: ${userId}`);

    task.assignTo(user.getId());
    await this.taskRepository.save(task);

    task.getDomainEvents().forEach((event) => {
      this.eventEmitter.emit(event.eventType, event);
    });
    task.clearDomainEvents();

    return this.toDto(task);
  }

  async unassign(taskId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(TaskId.from(taskId));
    if (!task) throw new NotFoundException(`Task not found: ${taskId}`);

    task.unassign();
    await this.taskRepository.save(task);
    return this.toDto(task);
  }

  private toDto(task: Task): TaskResponseDto {
    return {
      id: task.getId().getValue(),
      title: task.getTitle().getValue(),
      description: task.getDescription().getValue(),
      status: task.getStatus().getValue(),
      statusDisplayName: task.getStatus().getDisplayName(),
      assigneeId: task.getAssigneeId()?.getValue() ?? null,
      createdAt: task.getCreatedAt(),
      updatedAt: task.getUpdatedAt(),
    };
  }
}
