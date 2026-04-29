import { TaskStatus } from '../value-objects/task-status';

export class InvalidTaskStatusTransitionError extends Error {
  constructor(props: { currentStatus: TaskStatus; nextStatus: TaskStatus }) {
    super(
      `${props.currentStatus.getValue()} から ${props.nextStatus.getValue()} への遷移は無効です`,
    );
  }
}
