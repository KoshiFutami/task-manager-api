import { Task } from '../entities/task.aggregate';
import { TaskId } from '../value-objects/task-id';

export abstract class ITaskRepository {
  abstract save(task: Task): Promise<void>;

  abstract findById(taskId: TaskId): Promise<Task | null>;

  abstract findAll(): Promise<Task[]>;

  abstract delete(taskId: TaskId): Promise<void>;
}
