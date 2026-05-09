import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskStatusChanged } from 'src/tasks/domain/events/task-status-changed';

@Injectable()
export class TaskStatusChangedHandler {
  @OnEvent('TaskStatusChanged')
  handle(event: TaskStatusChanged): void {
    console.log(
      `[TaskStatusChanged] taskId: ${event.taskId.getValue()} previousStatus: ${event.previousStatus.getDisplayName()} newStatus: ${event.newStatus.getDisplayName()}`,
    );
  }
}
