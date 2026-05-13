import { TaskDescription } from '../value-objects/task-description';
import { TaskId } from '../value-objects/task-id';
import { TaskStatus } from '../value-objects/task-status';
import { TaskTitle } from '../value-objects/task-title';
import { InvalidTaskStatusTransitionError } from '../exceptions/invalid-task-status-transition-error';
import { TaskCreated } from '../events/task-created';
import { TaskStatusChanged } from '../events/task-status-changed';
import { UserId } from 'src/users/domain/value-objects/user-id';
import { TaskAssigned } from '../events/task-assigned';

export class Task {
  private readonly id: TaskId;
  private title: TaskTitle;
  private description: TaskDescription;
  private status: TaskStatus;
  private assigneeId: UserId | null;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private domainEvents: (TaskCreated | TaskStatusChanged | TaskAssigned)[] = [];

  private constructor(props: {
    id: TaskId;
    title: TaskTitle;
    description: TaskDescription;
    status: TaskStatus;
    assigneeId: UserId | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.assigneeId = props.assigneeId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(title: TaskTitle, description: TaskDescription): Task {
    const task = new Task({
      id: TaskId.create(),
      title: title,
      description: description,
      status: TaskStatus.create(),
      assigneeId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    task.domainEvents.push(new TaskCreated(task.id, task.title));

    return task;
  }

  static from(props: {
    id: string;
    title: string;
    description: string | undefined;
    status: string;
    assigneeId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return new Task({
      id: TaskId.from(props.id),
      title: TaskTitle.from(props.title),
      description: TaskDescription.from(props.description),
      status: TaskStatus.from(props.status),
      assigneeId: props.assigneeId ? UserId.from(props.assigneeId) : null,
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

    const previousStatus = this.status;
    this.status = newStatus;
    this.updatedAt = new Date();

    this.domainEvents.push(new TaskStatusChanged(this.id, previousStatus, newStatus));
  }

  getId(): TaskId {
    return this.id;
  }

  getTitle(): TaskTitle {
    return this.title;
  }

  changeTitle(newTitle: TaskTitle) {
    this.title = newTitle;
  }

  getDescription(): TaskDescription {
    return this.description;
  }

  changeDescription(newDescription: TaskDescription) {
    this.description = newDescription;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  getAssigneeId(): UserId | null {
    return this.assigneeId;
  }

  assignTo(userId: UserId): void {
    this.assigneeId = userId;
    this.updatedAt = new Date();

    this.domainEvents.push(new TaskAssigned(this.id, this.assigneeId));
  }

  unassign(): void {
    this.assigneeId = null;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDomainEvents(): (TaskCreated | TaskStatusChanged | TaskAssigned)[] {
    return this.domainEvents;
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
