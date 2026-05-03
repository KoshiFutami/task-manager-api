import { Injectable } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task as TaskEntity } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { Task } from '../domain/entities/task.aggregate';
import { TaskId } from '../domain/value-objects/task-id';

@Injectable()
export class TaskRepositoryImpl implements ITaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly ormRepository: Repository<TaskEntity>,
  ) {}

  async save(task: Task): Promise<void> {
    const entity = this.toPersistence(task);
    await this.ormRepository.save(entity);
  }

  async findById(taskId: TaskId): Promise<Task | null> {
    const entity = await this.ormRepository.findOne({
      where: { id: taskId.getValue() },
    });

    if (!entity) return null;

    return this.toDomain(entity);
  }

  async findAll(): Promise<Task[]> {
    const entities = await this.ormRepository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(taskId: TaskId): Promise<void> {
    await this.ormRepository.delete(taskId.getValue());
  }

  private toPersistence(task: Task): TaskEntity {
    const entity = new TaskEntity();
    entity.id = task.getId().getValue();
    entity.title = task.getTitle().getValue();
    entity.description = task.getDescription().getValue();
    entity.status = task.getStatus().getValue();
    entity.createdAt = task.getCreatedAt();
    entity.updatedAt = task.getUpdatedAt();
    return entity;
  }

  private toDomain(entity: TaskEntity): Task {
    return Task.from({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
