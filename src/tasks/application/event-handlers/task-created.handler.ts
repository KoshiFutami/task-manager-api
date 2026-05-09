import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreated } from 'src/tasks/domain/events/task-created';

@Injectable()
export class TaskCreatedHandler {
  @OnEvent('TaskCreated')
  handle(event: TaskCreated): void {
    console.log(
      `[TaskCreated] taskId: ${event.taskId.getValue()} taskTitle: ${event.taskTitle.getValue()}`,
    );
  }
}
