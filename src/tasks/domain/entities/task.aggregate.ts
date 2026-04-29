import { TaskDescription } from '../value-objects/task-description';
import { TaskId } from '../value-objects/task-id';
import { TaskStatus } from '../value-objects/task-status';
import { TaskTitle } from '../value-objects/task-title';
import { InvalidTaskStatusTransitionError } from '../exceptions/invalid-task-status-transition-error';

export class Task {
  private readonly id: TaskId;
  private title: TaskTitle;
  private description: TaskDescription;
  private status: TaskStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(props: {
    id: TaskId;
    title: TaskTitle;
    description: TaskDescription;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(title: TaskTitle, description: TaskDescription): Task {
    return new Task({
      id: TaskId.create(),
      title: title,
      description: description,
      status: TaskStatus.create(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static from(props: {
    id: string;
    title: string;
    description: string | undefined;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return new Task({
      id: TaskId.from(props.id),
      title: TaskTitle.from(props.title),
      description: TaskDescription.from(props.description),
      status: TaskStatus.from(props.status),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  changeStatus(newStatus: TaskStatus): void {
    if (!this.status.canTransitionTo(newStatus)) {
      throw new InvalidTaskStatusTransitionError({
        currentStatus: this.status,
        nextStatus: newStatus,
      });
    }
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  getId(): TaskId {
    return this.id;
  }

  getTitle(): TaskTitle {
    return this.title;
  }

  getDescription(): TaskDescription {
    return this.description;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
