import { UserId } from 'src/users/domain/value-objects/user-id';
import { TaskId } from '../value-objects/task-id';
import { DomainEvent } from './domain-event';

export class TaskAssigned extends DomainEvent {
  readonly eventType = 'TaskAssigned';

  constructor(
    public readonly taskId: TaskId,
    public readonly assigneeId: UserId,
  ) {
    super();
  }
}
