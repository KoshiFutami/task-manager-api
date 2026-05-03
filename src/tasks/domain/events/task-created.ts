import { TaskId } from '../value-objects/task-id';
import { TaskTitle } from '../value-objects/task-title';
import { DomainEvent } from './domain-event';

export class TaskCreated extends DomainEvent {
  readonly eventType = 'TaskCreated';

  constructor(
    public readonly taskId: TaskId,
    public readonly title: TaskTitle,
  ) {
    super();
  }
}
