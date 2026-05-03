import { Task } from '../entities/task.aggregate';
import { TaskId } from '../value-objects/task-id';

export interface ITaskRepository {
  save(task: Task): Promise<void>;

  findById(taskId: TaskId): Promise<Task | null>;

  findAll(): Promise<Task[]>;

  delete(taskId: TaskId): Promise<void>;
}
