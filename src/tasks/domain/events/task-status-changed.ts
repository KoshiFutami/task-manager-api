import { TaskId } from '../value-objects/task-id';
import { TaskStatus } from '../value-objects/task-status';
import { DomainEvent } from './domain-event';

export class TaskStatusChanged extends DomainEvent {
  readonly eventType = 'TaskStatusChanged';

  constructor(
    public readonly taskId: TaskId,
    public readonly previousStatus: TaskStatus,
    public readonly newStatus: TaskStatus,
  ) {
    super();
  }
}
